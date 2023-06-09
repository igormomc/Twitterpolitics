import {z} from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";
import {clerkClient} from "@clerk/nextjs/server";
import type {User} from "@clerk/nextjs/dist/api";
import {TRPCError} from "@trpc/server";
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;

import {Ratelimit} from "@upstash/ratelimit";
import {Redis} from "@upstash/redis";
import {filterUserForClient} from "~/server/helpers/filterUsersForClient";
import {Post} from ".prisma/client";



const addUserDateToPosts = async (posts: Post[]) => {
    const users = (
        await clerkClient.users.getUserList({
            userId: posts.map((post) => post.authorId),
            limit: 100,
        })
    ).map(filterUserForClient);

    return posts.map((post) => {
        const author = users.find((user) => user.id === post.authorId);
        if (!author)
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Author for post not found",
            });
        return {
            post,
            author: {
                ...author,
                username: author.username,
            },
        };
    });
}


// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(8, "1 m"),
    analytics: true
});
const likePostInput = z.object({
    postId: z.string(),
});

export const postsRouter = createTRPCRouter({

    getById: publicProcedure
        .input(z.object({id: z.string()}))
        .query(async ({ctx, input}) => {
            const post = await ctx.prisma.post.findUnique({
                where: {id: input.id},
                include: {
                    like: true,
                }
            });

            if (!post) throw new TRPCError({code: "NOT_FOUND"});
            return (await addUserDateToPosts([post]))[0];
        }),

    getAll: publicProcedure.query(async ({ctx}) => {
        const posts = await ctx.prisma.post.findMany({
            take: 100,
            orderBy: [{createdAt: "desc"}]
        });
        return addUserDateToPosts(posts)
    }),

    getPostsByUserId: publicProcedure
        .input(
            z.object({
                userId: z.string(),
            })
        )
        .query(({ctx, input}) =>
            ctx.prisma.post
                .findMany({
                    where: {
                        authorId: input.userId,
                    },
                    take: 100,
                    orderBy: [{createdAt: "desc"}],
                }).then(addUserDateToPosts)
        ),


    //TODO: CHANGE EMOJI AND MAX SIZE
    create: protectedProcedure.input(
        z.object({
            content: z.string().min(1).max(280),
        })
    ).mutation(async ({ctx, input}) => {
        const authorId = ctx.userId;

        const {success} = await ratelimit.limit(ctx.userId);
        if (!success) throw new TRPCError({code: "TOO_MANY_REQUESTS"})

        const post = await ctx.prisma.post.create({
            data: {
                authorId,
                content: input.content,
            },
            include: { like: true },
        });
        return post;
    }),

    likePost: protectedProcedure
        .input(likePostInput)
        .mutation(async ({ ctx, input }) => {
            const accountId = ctx.userId;
            const { postId } = input;

            const post = await ctx.prisma.post.findUnique({
                where: { id: postId },
                include: { like: true },
            });

            if (!post) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            const existingLike = await ctx.prisma.like.findUnique({
                where: { accountId_postId: { accountId, postId } },
            });

            if (existingLike) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "You have already liked this post",
                });
            }

            const like = await ctx.prisma.like.create({
                data: {
                    accountId,
                    postId,
                },
            });

            return like;
        }),
    removeLike: protectedProcedure
        .input(likePostInput)
        .mutation(async ({ ctx, input }) => {
            const accountId = ctx.userId;
            const { postId } = input;

            const post = await ctx.prisma.post.findUnique({
                where: { id: postId },
                include: { like: true },
            });

            if (!post) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            const existingLike = await ctx.prisma.like.findUnique({
                where: { accountId_postId: { accountId, postId } },
            });

            if (!existingLike) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "You have not liked this post",
                });
            }

            const like = await ctx.prisma.like.delete({
                where: { accountId_postId: { accountId, postId } },
            });

            return like;
        }
    ),

});
