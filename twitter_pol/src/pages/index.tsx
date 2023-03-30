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
            <input
                placeholder="What's happening "
                className="grow bg-transparent outline-none"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isPosting}
            />
            {input !== "" && !isPosting && (
                <button onClick={() => mutate({content: input})} disabled={isPosting}>Post</button>)}
            {isPosting && (
                <div className="flex items-center justify-center">
                    <LoadingSpinner/>
                </div>
            )}
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
