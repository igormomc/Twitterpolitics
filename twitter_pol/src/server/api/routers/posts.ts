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

const filterUserForClient = (user: User) => {
    return {
        id: user.id,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
    };
};

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(8, "1 m"),
    analytics: true
});


export const postsRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ctx}) => {
        const posts = await ctx.prisma.post.findMany({
            take: 100,
            orderBy: [{createdAt: "desc"}]
        });

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
                }
            };
        });
    }),
    //TODO: CHANGE EMOJI AND MAX SIZE
    create: protectedProcedure.input(
        z.object({
            content: z.string().min(1).max(280),
        })
    ).mutation(async ({ctx, input}) => {
        const authorId = ctx.userId;

        const { success } = await ratelimit.limit(ctx.userId);
        if(!success) throw new  TRPCError({code: "TOO_MANY_REQUESTS"})

        const post = await ctx.prisma.post.create({
            data: {
                authorId,
                content: input.content,
            },
        });
        return post;
    }),
});
