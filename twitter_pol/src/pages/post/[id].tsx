import type {GetStaticProps, NextPage} from "next";
import Head from "next/head";
import {api} from "~/utils/api";
import {createProxySSGHelpers} from "@trpc/react-query/ssg";
import {appRouter} from "~/server/api/root";
import superjson from "superjson";
import {prisma} from "~/server/db";
import {PageLayout} from "~/components/layout";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import toast from "react-hot-toast";
import {useEffect, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {SignIn, SignInButton, SignOutButton, useUser} from "@clerk/nextjs";


dayjs.extend(relativeTime);

const SinglePostPage: NextPage<{ id: string }> = ({id}) => {
    const ctx = api.useContext();
    const {data} = api.posts.getById.useQuery({
        id,
    })


    //update likes with mutation
    if (!data) return <div>404</div>
    const dateFormated = dayjs(data.post.createdAt).format("MMM D, YYYY")
    const timeAtDay = dayjs(data.post.createdAt).format("h:mm A")
    // TODO: WHY ERROR????
    const [likes, setLikes] = useState(data.post.like.length);
    const authorIdStr = data.post.authorId.toString();
    const [isPostLiked, setIsPostLiked] = useState(false);
    useEffect(() => {
        if (data.post.like.find((like) => like.accountId === authorIdStr)) {
            setIsPostLiked(true);
        }
        else {
            setIsPostLiked(false);
        }
    }, [data.post.like, authorIdStr])

    const {mutate: likePost} = api.posts.likePost.useMutation({
        onSuccess: () => {
            toast.success("Liked post")
            setLikes(likes + 1);
        }
    })
    const {mutate: removeLike} = api.posts.removeLike.useMutation({
        onSuccess: () => {
            toast.success("Removed like")
            setLikes(likes - 1);
        }
    })

    const handeLikeClick = () => {
        if (isPostLiked) {
            removeLike({postId: data.post.id})
        } else {
            likePost({postId: data.post.id})
        }
        setIsPostLiked(!isPostLiked);
    }
    const likeButtonStyle = isPostLiked ?
        "inline-flex items-center px-4 py-2 text-sm font-medium text-red-500 bg-transparent rounded-l-lg hover:text-red-500" :
        "inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 text-zinc-500 hover:text-red-500 bg-transparent rounded-l-lg";


    return (
        <>
            <Head>
                <title>{`@${data.author.username} - ${data.post.content.substring(0, 20)}`}</title>
            </Head>
            <PageLayout>
                <div className="h-[16px]"></div>
                <div className="p-4 text-2xl font-bold">
                    <div className="flex flex-col">
                        <div className="flex gap-1 text-slate-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
                            </svg>
                            <span className="text-xl text-white ml-4">Tweet</span>
                        </div>
                    </div>
                </div>
                <div className="w-full bg-black"></div>
                <div key={data.post.id} className="flex gap-3 pl-6 pb-4">
                    <Image
                        src={data.author.profileImageUrl}
                        alt="profile image"
                        className="h-14 w-14 rounded-full"
                        width={56}
                        height={56}
                    />
                    <div className="flex flex-col">
                        <div className="flex gap-1 text-slate-1 00">
                            <Link href={`/@${data.author.username}`}><span>{`@${data.author.username}`}</span></Link>
                        </div>
                        <span className={"text-zinc-600"}>{`@${data.author.username}`}</span>
                    </div>
                </div>
                <div key={data.post.id} className="flex gap-3 pl-2 pb-4 m-4 border-b border-zinc-800">
                    <div className="flex flex-col">
                        <div className="flex flex-col">
                            <div className="flex gap-1 pb-4">
                                <span>{data.post.content}</span>
                            </div>
                            <div>
                                <span
                                    className={"text-zinc-600 text-sm"}>
                                    {`${timeAtDay} · ${dateFormated} · 81.1K Views`}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div key={data.post.id} className="flex gap-3 pl-2 pb-1 pt-1 ml-4 mr-4 border-b border-zinc-800">
                    <div className="flex flex-col">
                        <div className="flex flex-col">
                            <div className="flex gap-1 pb-4">
                                <span className="text-sm">{likes}</span>
                                <span className="text-zinc-400 font-light text-sm">Like</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="inline-flex shadow-sm justify-evenly pl-2 pb-1 pt-1 ml-4 mr-4 border-b border-zinc-800"
                     role="group">
                    <button type="button"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 text-zinc-500 hover:text-red-500 bg-transparent rounded-l-lg focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"/>
                        </svg>
                    </button>
                    <button type="button"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 text-zinc-500 hover:text-red-500 bg-transparent rounded-l-lg focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/>
                        </svg>
                    </button>
                    <button type="button"
                            onClick={() => {handeLikeClick()}}
                            //use likeButtonStyle for like button and rest of the styling
                            className={likeButtonStyle}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                        </svg>
                    </button>
                    <button type="button"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 text-zinc-500 hover:text-red-500 bg-transparent rounded-l-lg focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"/>
                        </svg>
                    </button>
                    <button type="button"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 text-zinc-500 hover:text-red-500 bg-transparent rounded-l-lg focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                        </svg>
                    </button>
                </div>

            </PageLayout>

        </>
    );
};


export const getStaticProps: GetStaticProps = async (context) => {
    const ssg = createProxySSGHelpers({
        router: appRouter,
        ctx: {prisma, userId: null},
        transformer: superjson,
    });

    const id = context.params?.id;
    if (typeof id !== "string") throw  new Error("no id");

    await ssg.posts.getById.prefetch({id});

    return {
        props: {
            trpcState: ssg.dehydrate(),
            id,
        },
    };
};

//Lol Big letters destroys the code
/*export const getStaticPaths = () => {
    return {paths: [], fallback: "Blocking"}
}*/

export const getStaticPaths = () => {
    return {paths: [], fallback: "blocking"};
};

export default SinglePostPage;
