import Image from "next/image";
import {useState} from "react";
import {SignIn, SignInButton, SignOutButton, useUser} from "@clerk/nextjs";
import Link from "next/link";

export default function Sidebar() {
    const [profileOpen, setProfileOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const {isLoaded: userLoaded, isSignedIn} = useUser();
    //MAKE FILTER FOR USER DATA, DONT NEED TO FETCH SO MUCH STUFF
    const {user} = useUser();


    return (
        <>
            <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar"
                    aria-controls="default-sidebar" type="button"   onClick={() => setSidebarOpen(!sidebarOpen)}

                    className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg">
                    <path clip-rule="evenodd" fill-rule="evenodd"
                          d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>
            <div
                className={`pr-24 px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-black ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
                <ul className="space-y-2 font-medium">
                    <li>
                        <Link href={`/`}
                           className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-zinc-900 dark:hover:bg-zinc-900">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
                            </svg>
                            <span className="ml-3">Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={`/`}
                           className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-zinc-900 dark:hover:bg-zinc-900">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5"/>
                            </svg>

                            <span className="ml-3">Explore</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={`/`}
                           className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-zinc-900 dark:hover:bg-zinc-900">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>
                            </svg>

                            <span className="ml-3">Notifications</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={`/`}
                           className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-zinc-900 dark:hover:bg-zinc-900">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
                            </svg>

                            <span className="ml-3">Mesages</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={`/`}
                           className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-zinc-900 dark:hover:bg-zinc-900">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9"/>
                            </svg>
                            <span className="ml-3">Bookmarks</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={`/`}
                           className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-zinc-900 dark:hover:bg-zinc-900">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span className="ml-3">More</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={`/`}
                           className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-zinc-900 dark:hover:bg-zinc-900">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span className="ml-3">Profile</span>
                        </Link>
                    </li>
                </ul>
                {/* button at the bottom */}
                <div className='fixed bottom-0 mb-4 rounded'>
                    {isSignedIn && (
                        <div>
                            {profileOpen && (
                                <div id="userDropdown"
                                     className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-zinc-900 dark:divide-gray-600">
                                    <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                        <div>{user?.fullName}</div>
                                        <div
                                            className="font-medium truncate">{user?.primaryEmailAddress?.emailAddress}</div>
                                    </div>
                                    <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                        <SignOutButton/>
                                    </div>
                                </div>
                            )}
                            <div onClick={() => {
                                setProfileOpen(!profileOpen)
                            }} className="flex items-center space-x-4 hover:bg-zinc-900 p-4 rounded-full">
                                <Image
                                    src={user?.profileImageUrl || ""}
                                    alt="profile image"
                                    className="h-10 w-10 rounded-full bg-red-600"
                                    width={36}
                                    height={36}
                                />
                                <div className="font-medium truncate">
                                    <div>{user?.username}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 md:">Joined in August
                                        2023
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {!isSignedIn && (
                        <SignInButton/>
                    )}
                </div>
            </div>
        </>
    )
}
