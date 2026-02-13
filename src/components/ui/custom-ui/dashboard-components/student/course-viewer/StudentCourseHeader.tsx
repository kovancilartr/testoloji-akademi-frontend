"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentCourseHeaderProps {
    course: any;
    activeContent: any;
    isSidebarOpen: boolean;
    isCinemaMode: boolean;
    onToggleSidebar: () => void;
    onBack: () => void;
}

export function StudentCourseHeader({
    course,
    activeContent,
    isSidebarOpen,
    isCinemaMode,
    onToggleSidebar,
    onBack
}: StudentCourseHeaderProps) {
    return (
        <header className="h-16 md:h-20 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shadow-sm z-50">
            <div className="flex items-center gap-4 md:gap-6 min-w-0">
                <Button
                    variant="ghost"
                    className="text-slate-500 hover:text-orange-500 gap-2 p-2 h-10 rounded-xl transition-all cursor-pointer"
                    onClick={onBack}
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="hidden md:inline font-bold text-sm">Geri</span>
                </Button>
                <div className="h-8 w-px bg-slate-200 hidden md:block" />
                <div className="min-w-0">
                    <h1 className="text-slate-900 font-black text-sm md:text-xl tracking-tight truncate leading-tight">
                        {course.title}
                    </h1>
                    <div className="flex items-center gap-2 mt-0.5">
                        <Badge className="bg-orange-500/10 text-orange-600 border-none font-black text-[9px] px-1.5 py-0 uppercase tracking-widest">
                            {activeContent?.type || 'EĞİTİM'}
                        </Badge>
                        <span className="text-slate-400 text-[10px] font-bold hidden md:inline">Eğitmen: {course.instructor?.name}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {!isCinemaMode && (
                    <Button
                        variant="outline"
                        size="icon"
                        className={cn("cursor-pointer flex rounded-xl border-slate-200 transition-all", isSidebarOpen && "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200")}
                        onClick={onToggleSidebar}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </header>
    );
}
