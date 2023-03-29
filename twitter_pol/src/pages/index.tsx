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
import {LoadingPage, LoadingSpinner} from "~/components/loading";
import {useState} from "react";
import toast from "react-hot-toast";
import {PageLayout} from "~/components/layout";

dayjs.extend(relativeTime);

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
                placeholder="Type something"
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
                    <Link href={`/@${author.username}`}><span>{`@${author.username}`}</span></Link>
                    <Link href={`/post/${post.id}`}><span
                        className="font-thin">{`· ${dayjs(post.createdAt).fromNow()}`}</span></Link>
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
                <div className="flex border-b border-slate-400 p-4">
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
