
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { FullPageLoader } from "@/components/ui/custom-ui/FullPageLoader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, GraduationCap } from "lucide-react";
import { ForcePasswordChangeModal } from "@/components/ui/custom-ui/auth/ForcePasswordChangeModal";
import { NotificationPopover } from "@/components/ui/custom-ui/dashboard-components/NotificationPopover";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { CoachingWarning } from "@/components/ui/custom-ui/dashboard-components/CoachingWarning";
import Link from "next/link";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { isAuthenticated, isLoading } = useAuth();

    // Project Studio sayfasında sidebar'ı gizle
    const isProjectStudio = pathname?.includes("/dashboard/project/");

    if (isLoading) {
        return <FullPageLoader />;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50/50">
            {/* Global Sidebar (Desktop) */}
            {!isProjectStudio && (
                <AppSidebar className="hidden md:flex shrink-0 z-40" />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative w-full">

                {/* Mobile Header */}
                {!isProjectStudio && (
                    <header className="md:hidden h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 shrink-0 z-30">
                        <Link href="/" className="flex items-center gap-3 overflow-hidden group">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
                                    <GraduationCap className="text-white w-5 h-5" />
                                </div>
                                <span className="font-black text-lg tracking-tight text-gray-900">TESTOLOJİ</span>
                            </div>
                        </Link>

                        <div className="flex items-center gap-2">
                            <NotificationPopover />
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-gray-500">
                                        <Menu className="w-6 h-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="p-0 w-[280px] border-r-0">
                                    <VisuallyHidden>
                                        <SheetTitle>Mobil Menü</SheetTitle>
                                    </VisuallyHidden>
                                    <AppSidebar className="w-full h-full border-none" userDropdownSide="top" />
                                </SheetContent>
                            </Sheet>
                        </div>
                    </header>
                )}

                <main className="flex-1 overflow-hidden relative flex flex-col">
                    {children}
                </main>
                <ForcePasswordChangeModal />
                <CoachingWarning />
            </div>
        </div>
    );
}
