"use client";

import Link from 'next/link';
import { usePathname } from "next/navigation";
import React from "react";
import Image from "next/image";
import { UserDropdown } from "./UserDropdown";
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeaderMobile from './DashboardHeaderMobile';
import DashboardHeaderMainNavigation from './DashboardHeaderMainNavigation';

import { NotificationPopover } from "./NotificationPopover";

interface DashboardHeaderProps {
    // Editor specific props (only used in project page)
    title?: string;
    editorActions?: {
        imageUploadDialog?: React.ReactNode;
        pdfCropper?: React.ReactNode;
        questionEditor?: React.ReactNode;
    }
}

export function DashboardHeader({ editorActions }: DashboardHeaderProps) {
    const pathname = usePathname();

    // Check if we are in a project detail page (e.g., /dashboard/project/[id])
    const isProjectPage = pathname?.includes("/dashboard/project/");

    return (
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-[50] shadow-sm shrink-0">
            <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
                    {/* Logo Area */}
                    <div className="flex items-center gap-4 lg:gap-6 shrink-0">
                        <Link href="/dashboard" className="flex items-center gap-2.5 group">
                            <div className="relative w-8 h-8 group-hover:scale-110 transition-transform">
                                <Image
                                    src="/images/logo2.png"
                                    alt="Testoloji Logo"
                                    fill
                                    className="object-contain drop-shadow-lg"
                                />
                            </div>
                            <span className="font-black text-lg tracking-tighter text-gray-900 hidden md:block">TESTOLOJİ</span>
                        </Link>

                        <div className="h-8 w-px bg-gray-100 mx-1 hidden sm:block" />

                        {/* Main Navigation - Desktop */}
                        <DashboardHeaderMainNavigation />

                        {/* Mobile Menu Trigger */}
                        <DashboardHeaderMobile isProjectPage={isProjectPage} editorActions={editorActions} />
                    </div>

                    {/* Editor Navigation - Only in Project Page */}
                    {isProjectPage && editorActions && (
                        <>
                            <div className="h-8 w-px bg-gray-100 mx-2 shrink-0 hidden lg:block" />
                            <div className="flex items-center gap-2 flex-1 justify-end sm:justify-center max-w-[600px]">
                                {editorActions.imageUploadDialog}
                                {editorActions.pdfCropper}
                                <div className="hidden sm:block">
                                    {editorActions.questionEditor}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* User Area Dropdown */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <NotificationPopover />
                    <UserDropdown />
                </div>
            </div>
            <style jsx global>{`
                .mobile-menu-tools .dialog-text-span {
                    display: inline !important;
                }
            `}</style>
        </header>
    );
}
