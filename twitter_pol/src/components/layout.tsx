import type {PropsWithChildren} from "react";
import {SignInButton} from "@clerk/nextjs";
import Link from "next/link";
import Sidebar from "~/components/sidebar";


export const PageLayout = (props: PropsWithChildren) => {
    return (
        <main className="flex flex-col md:flex-row h-screen justify-center">
                <Sidebar />
            <div
                className="flex flex-col justify-center h-full w-full border-x border-slate-400 md:max-w-2xl overflow-y-scroll">
                {props.children}
            </div>
        </main>
    )
}


