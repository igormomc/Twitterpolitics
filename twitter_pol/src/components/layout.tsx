import type {PropsWithChildren} from "react";
import {SignInButton} from "@clerk/nextjs";
import Link from "next/link";
import Sidebar from "~/components/sidebar";


export const PageLayout = (props: PropsWithChildren) => {
    return (
        <main className="flex flex-col md:flex-row justify-center">
                <Sidebar />
            <div
                className="flex flex-col h-screen w-full border-x border-zinc-800 md:max-w-2xl overflow-y-scroll">
                {props.children}
            </div>
        </main>
    )
}


