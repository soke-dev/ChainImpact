'use client';
import { useState } from 'react';
import { client } from "@/app/client";
import Link from "next/link";
import { ConnectButton, lightTheme, useActiveAccount } from "thirdweb/react";

const Navbar = () => {
    const account = useActiveAccount();

    // State to manage mobile menu visibility
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Custom theme for the ConnectButton
    const customTheme = {
        ...lightTheme(),
        button: {
            primary: {
                background: "#4f46e5", 
                color: "#ffffff", 
                border: "none", 
            },
            secondary: {
                background: "#1f2937",
                color: "#ffffff",
            },
        },
    };

    return (
        <nav className="bg-gradient-to-r from-indigo-600 via-blue-500 to-teal-400 text-white shadow-xl py-4">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    {/* Mobile menu button */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <div className="flex flex-1 items-center sm:items-stretch sm:justify-start justify-between">
  {/* Logo Section */}
  <div className="flex flex-shrink-0 items-center ml-9 sm:ml-0">
    <Link href="/">
      <img 
        src="/logo.png" 
        alt="ChainImpact Logo" 
        className="h-10 w-auto spin" // Apply the spin animation class
      />
    </Link>
  </div>

                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <Link href={'/'}>
                                    <p className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition duration-300">Home</p>
                                </Link>
                                <Link href="/page2">
                                    <p className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition duration-300">View Campaigns</p>
                                </Link>
                                {account && (
                                    <Link href={`/dashboard/${account?.address}`}>
                                        <p className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition duration-300">Dashboard</p>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <ConnectButton
                            client={client}
                            theme={customTheme}
                            detailsButton={{
                                style: {
                                    maxHeight: "50px",
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile menu (visible when open) */}
            {isMobileMenuOpen && (
                <div className="sm:hidden" id="mobile-menu">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        <Link href="/">
                            <p className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-indigo-700 transition duration-300">Home</p>
                        </Link>
                        <Link href="/page2">
                            <p className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-indigo-700 transition duration-300">View Campaigns</p>
                        </Link>
                        {account && (
                            <Link href={`/dashboard/${account?.address}`}>
                                <p className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-indigo-700 transition duration-300">Dashboard</p>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
