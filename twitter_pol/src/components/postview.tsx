import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import {RouterOutputs} from "~/utils/api";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number]
export const PostView = (props: PostWithUser) => {
    const {post, author} = props;
    return (
        <div key={post.id} className="flex gap-3 p-4 border-b border-zinc-800">
            <Image
                src={author.profileImageUrl}
                alt="profile image"
                className="h-14 w-14 rounded-full"
                width={56}
                height={56}
            />
            <div className="flex flex-col w-full">
                <div className="flex gap-1 text-slate-300">
                    <Link href={`/@${author.username}`}><span>{`@${author.username}`}</span></Link>
                    <Link href={`/post/${post.id}`}><span
                        className="font-thin">{`· ${dayjs(post.createdAt).fromNow()}`}</span></Link>
                </div>
                <span className="text-xl">{post.content}</span>
                <div className="inline-flex justify-evenly pl-2 pb-1 pt-1 ml-4 mr-4" role="group">
                    <button type="button"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 text-zinc-500 hover:text-red-500 bg-transparent rounded-l-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                             stroke="currentColor" className="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"/>
                        </svg>
                    </button>
                    <button type="button"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 text-zinc-500 hover:text-red-500 bg-transparent rounded-l-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                             stroke="currentColor" className="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/>
                        </svg>
                    </button>
                    <button type="button"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 text-zinc-500 hover:text-red-500 bg-transparent rounded-l-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                             stroke="currentColor" className="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                        </svg>
                    </button>
                    <button type="button"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 text-zinc-500 hover:text-red-500 bg-transparent rounded-l-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                             stroke="currentColor" className="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"/>
                        </svg>
                    </button>
                    <button type="button"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 text-zinc-500 hover:text-red-500 bg-transparent rounded-l-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                             stroke="currentColor" className="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}