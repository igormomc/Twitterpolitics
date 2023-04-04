import {type NextPage} from "next";
import Head from "next/head";
import Link from "next/link";
import {signIn, signOut, useSession} from "next-auth/react";

import {api, RouterOutputs} from "~/utils/api";
import {SignIn, SignInButton, SignOutButton, useUser} from "@clerk/nextjs";
import {RouterOptions} from "express";
import Image from "next/image";
import {LoadingPage, LoadingSpinner} from "~/components/loading";
import {useState} from "react";
import toast from "react-hot-toast";
import {PageLayout} from "~/components/layout";
import {PostView} from "~/components/postview";
import dayjs from "dayjs";

const CreatePostWizard = () => {
    const {user} = useUser();
    const [input, setInput] = useState("");

    const ctx = api.useContext();

    const {mutate, isLoading: isPosting} = api.posts.create.useMutation({
        onSuccess: () => {
            setInput("");
            void ctx.posts.getAll.invalidate();
        },
        onError: (e) => {
            const errorMessage = e.data?.zodError?.fieldErrors.content;
            if (errorMessage && errorMessage[0]) {
                toast.error(errorMessage[0])
            } else {
                toast.error("Failed to Post! Try again later!")
            }

        }
    });

    //update like count on post
    const {mutate: likeMutate} = api.posts.updateLikesCountWithOne.useMutation({
onSuccess: () => {
            void ctx.posts.getAll.invalidate();
        },
        onError: (e) => {
            const errorMessage = e.data?.zodError?.fieldErrors.content;
            if (errorMessage && errorMessage[0]) {
                toast.error(errorMessage[0])
            } else {
                toast.error("Failed to Post! Try again later!")
            }
    }
    });


    if (!user) return null;
    return (
        <div className="flex w-full gap-3">
            <Image
                src={user.profileImageUrl}
                alt="profile image"
                className="h-14 w-14 rounded-full"
                width={56}
                height={56}
            />
            <div className="w-full">
                <div
                    className="w-full">
                    <div className="px-4 py-2">
                        <label htmlFor="comment" className="sr-only">Your comment</label>
                        <textarea id="comment"
                                  className="w-full px-0 text-sm text-white bg-transparent focus:outline-none resize-none"
                                  value={input}
                                  onChange={(e) => setInput(e.target.value)}
                                  disabled={isPosting}
                                  placeholder="What´s happening?" required></textarea>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
                        <div className="flex pl-0 space-x-1 sm:pl-2">
                            <button type="button"
                                    className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
                                </svg>
                                <span className="sr-only">Attach Image</span>
                            </button>
                            <button type="button"
                                    className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M12.75 8.25v7.5m6-7.5h-3V12m0 0v3.75m0-3.75H18M9.75 9.348c-1.03-1.464-2.698-1.464-3.728 0-1.03 1.465-1.03 3.84 0 5.304 1.03 1.464 2.699 1.464 3.728 0V12h-1.5M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/>
                                </svg>

                                <span className="sr-only">Attach Gif</span>
                            </button>
                            <button type="button"
                                    className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5"/>
                                </svg>
                                <span className="sr-only">Poll</span>
                            </button>
                            <button type="button"
                                    className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"/>
                                </svg>

                                <span className="sr-only">Emoji</span>
                            </button>
                            <button type="button"
                                    className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"/>
                                </svg>

                                <span className="sr-only">Scheduler</span>
                            </button>
                        </div>
                        {input !== "" && !isPosting && (
                            <button type="submit"
                                    onClick={() => mutate({content: input})} disabled={isPosting}
                                    className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 hover:bg-blue-800">
                                Tweet
                            </button>)
                        }
                        {isPosting && (
                            <div className="flex items-center justify-center">
                                <LoadingSpinner/>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const Feed = () => {
    const {data, isLoading: postsLoading} = api.posts.getAll.useQuery();
    if (postsLoading) return <LoadingPage/>;
    if (!data) return <div>Something went wrong</div>;

    return (
        <div className="flex grow flex-col overflow-y-scroll">
            {data?.map((fullPost) => (
                <PostView {...fullPost} key={fullPost.post.id}/>
            ))}
        </div>
    )
}

const Home: NextPage = () => {

    const {isLoaded: userLoaded, isSignedIn} = useUser();

    //start fetching ASAP
    api.posts.getAll.useQuery()

    if (!userLoaded) return <div/>;

    return (
        <>
            <Head>
                <title>Twitter Politics</title>
                <meta name="description" content="💂"/>
            </Head>
            <PageLayout>
                <div className="flex flex-col ">
                    <div className="flex flex-col h-24 px-4">
                        <div className="font-bold text-xl">HOME</div>
                    </div>
                    <div className="flex justify-center">
                        <div className="w-1/2 border-b border-zinc-800">
                            <div className="flex justify-center space-x-2">
                                <button
                                    type="button"
                                    className="inline-block w-full rounded text-gray-400 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-xl transition duration-150 ease-in-out hover:bg-gray-700 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-gray-700">
                                    For you
                                </button>
                            </div>
                        </div>
                        <div className="w-1/2 border-b border-zinc-800 px-4">
                            <div className="flex justify-center space-x-2">
                                <button
                                    type="button"
                                    className="inline-block w-full rounded text-gray-400 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-xl transition duration-150 ease-in-out hover:bg-gray-700 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-gray-700">
                                    Following
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex border-b border-zinc-800 p-4">
                    {!isSignedIn && (
                        <div className="flex justify-center">
                            <SignInButton/>
                        </div>
                    )}
                    {isSignedIn && <CreatePostWizard/>}
                </div>
                <Feed/>
            </PageLayout>
        </>
    );
};

export default Home;
