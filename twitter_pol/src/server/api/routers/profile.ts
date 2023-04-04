import {z} from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";
import {clerkClient} from "@clerk/nextjs/server";
import {TRPCError} from "@trpc/server";
import {filterUserForClient} from "~/server/helpers/filterUsersForClient";


export const profileRouter = createTRPCRouter({

    //user.create a user
    create: protectedProcedure
        .input(z.object({email:z.string(), name: z.string()}))
        .query(async ({ctx, input}) => {
                const user = await ctx.prisma.user.create({
                    data: {
                        name: input.name,
                        email: input.email,
                    },
                });
                return user;
            }
        ),


    getUserByUsername: publicProcedure.input(z.object({username: z.string()})).query(async ({input}) => {
        const [user] = await clerkClient.users.getUserList({
            username: [input.username],
        });
        if (!user) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "User not found",
            });
        }
        return filterUserForClient(user);
    }),
});


