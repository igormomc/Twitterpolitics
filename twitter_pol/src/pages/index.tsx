import {type NextPage} from "next";
import Head from "next/head";
import Link from "next/link";
import {signIn, signOut, useSession} from "next-auth/react";

import {api, RouterOutputs} from "~/utils/api";
import {SignIn, SignInButton, SignOutButton, useUser} from "@clerk/nextjs";
import {RouterOptions} from "express";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import Image from "next/image";
import {LoadingPage} from "~/components/loading";
import {useState} from "react";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
    const {user} = useUser();
    console.log("User", user)
    const [input, setInput] = useState("");

    const ctx = api.useContext();

    const {mutate, isLoading: isPosting} = api.posts.create.useMutation({onSuccess: () => {
        setInput("");
        void ctx.posts.getAll.invalidate();
        }});


    if (!user) return null;
    console.log("data", user);
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
                placeholder="Type something"
                className="grow bg-transparent outline-none"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isPosting}
            />
            <button onClick={() => mutate({content: input})}>Post</button>
        </div>
    )
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostView = (props: PostWithUser) => {
    const {post, author} = props;
    return (
        <div key={post.id} className="flex gap-3 p-4 border-b border-slate-400">
            <Image
                src={author.profileImageUrl}
                alt="profile image"
                className="h-14 w-14 rounded-full"
                width={56}
                height={56}
            />
            <div className="flex flex-col">
                <div className="flex gap-1 text-slate-300">
                    <span>{`@${author.username}`}</span>
                    <span className="font-thin">{`· ${dayjs(post.createdAt).fromNow()}`}</span>
                </div>
                <span className="text-xl">{post.content}</span>
            </div>
        </div>
    )
}

const Feed = () => {
    const {data, isLoading: postsLoading} = api.posts.getAll.useQuery();
    if (postsLoading) return <LoadingPage/>;
    if (!data) return <div>Something went wrong</div>;

    return (
        <div className="flex flex-col">
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
                <title>Create T3 App</title>
                <meta name="description" content="Generated by create-t3-app"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className="flex h-screen justify-center">
                <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
                    <div className="flex border-b border-slate-400 p-4">
                        <div className="flex justify-center">
                            {!isSignedIn && <SignInButton/>}
                        </div>
                        <div>
                            {isSignedIn && <CreatePostWizard/>}
                            {!isSignedIn && <SignOutButton/>}

                        </div>
                    </div>
                    <Feed/>
                </div>
            </main>
        </>
    );
};

export default Home;
