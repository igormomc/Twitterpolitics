import type {GetStaticProps, NextPage} from "next";
import Head from "next/head";
import {api} from "~/utils/api";
import {createProxySSGHelpers} from "@trpc/react-query/ssg";
import {appRouter} from "~/server/api/root";
import superjson from "superjson";
import {prisma} from "~/server/db";
import {PageLayout} from "~/components/layout";
import Image from "next/image";
import {LoadingPage} from "~/components/loading";
import {PostView} from "~/components/postview";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const SinglePostPage: NextPage<{ id: string }> = ({id}) => {

    const {data} = api.posts.getById.useQuery({
        id
    })
    if (!data) return <div>404</div>
    console.log(dayjs(data.post.createdAt))
    const dateFormated = dayjs(data.post.createdAt).format("MMM D, YYYY")
    const timeAtDay = dayjs(data.post.createdAt).format("h:mm A")
    return (
        <>
            <Head>
                <title>{`${data.post.content} - @${data.author.username}`}</title>
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
                <div key={data.post.id} className="flex gap-3 pl-4 pb-4" >
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
                <div key={data.post.id} className="flex gap-3 pl-4 pb-4 border-b border-zinc-800">
                    <div className="flex flex-col">
                        <div className="flex flex-col">
                            <div className="flex gap-1 text-slate-300">
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
