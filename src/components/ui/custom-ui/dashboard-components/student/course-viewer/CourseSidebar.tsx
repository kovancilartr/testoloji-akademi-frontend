"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    ChevronDown, ChevronUp, Video, ClipboardList, BookOpen,
    CheckCircle, Circle, X
} from "lucide-react";

interface CourseSidebarProps {
    course: any;
    allContents: any[];
    expandedModules: string[];
    onToggleModule: (moduleId: string) => void;
    selectedContentId: string | null;
    onSelectContent: (contentId: string) => void;
    isSidebarOpen: boolean;
    onClose: () => void;
    isCinemaMode: boolean;
}

export function CourseSidebar({
    course,
    allContents,
    expandedModules,
    onToggleModule,
    selectedContentId,
    onSelectContent,
    isSidebarOpen,
    onClose,
    isCinemaMode
}: CourseSidebarProps) {

    const activeContent = allContents.find(c => c.id === selectedContentId);

    if (isCinemaMode) return null;

    return (
        <>
            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] animate-in fade-in duration-300"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed lg:relative inset-y-0 left-0 bg-white border-r border-slate-100 flex flex-col transition-all duration-500 ease-in-out z-[120] lg:z-40 shadow-2xl lg:shadow-none",
                isSidebarOpen ? "w-[85vw] sm:w-[350px] lg:w-[380px]" : "w-0 -translate-x-full lg:translate-x-0 overflow-hidden border-none"
            )}>
                <div className="flex flex-col h-full w-full">
                    <div className="p-6 md:p-4 bg-slate-50/50 border-b border-slate-200">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                {/* Mobile: Show Course Title */}
                                <h3 className="lg:hidden text-slate-900 font-black text-lg leading-tight">{course.title}</h3>
                                {/* Desktop: Show Generic Title */}
                                <h3 className="hidden lg:block text-slate-900 font-black text-lg tracking-tight">Ders İçeriği</h3>

                                <div className="flex items-center gap-2 flex-wrap">
                                    {activeContent && (
                                        <Badge variant="secondary" className="lg:hidden text-[10px] font-black bg-orange-100 text-orange-700 hover:bg-orange-200 border-none px-1.5 py-0 h-5">
                                            {activeContent.type}
                                        </Badge>
                                    )}
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none">
                                        {course.modules.length} BÖLÜM • {allContents.length} DERS
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="lg:hidden shrink-0 -mr-2 -mt-2" onClick={onClose}>
                                <X className="w-5 h-5 text-slate-400" />
                            </Button>
                        </div>
                    </div>

                    <ScrollArea className="flex-1 custom-scrollbar scroll-smooth">
                        <div className="p-4 space-y-3">
                            {course.modules.map((module: any, mIdx: number) => {
                                const isExpanded = expandedModules.includes(module.id);
                                const completedCount = module.contents.filter((c: any) => c.progress && c.progress[0]?.status === 'COMPLETED').length;

                                return (
                                    <div key={module.id} className="bg-slate-50/30 rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300">
                                        <button
                                            className={cn(
                                                "w-full flex items-center justify-between p-4 text-left transition-all",
                                                isExpanded ? "bg-white shadow-sm" : "hover:bg-slate-100/50"
                                            )}
                                            onClick={() => onToggleModule(module.id)}
                                        >
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs transition-all",
                                                    isExpanded ? "bg-orange-500 text-white" : "bg-slate-200 text-slate-500"
                                                )}>
                                                    {mIdx + 1}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-slate-900 font-bold text-xs md:text-sm truncate uppercase tracking-tight">{module.title}</h4>
                                                    <span className="text-[10px] font-bold text-slate-400">{completedCount}/{module.contents.length} Tamamlandı</span>
                                                </div>
                                            </div>
                                            {isExpanded ? <ChevronUp className="w-4 h-4 text-orange-500" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                        </button>

                                        {isExpanded && (
                                            <div className="p-2 space-y-1 bg-white/50">
                                                {module.contents.map((content: any) => {
                                                    const isActive = content.id === selectedContentId;
                                                    const isCompleted = content.progress && content.progress[0]?.status === 'COMPLETED';
                                                    return (
                                                        <button
                                                            key={content.id}
                                                            className={cn(
                                                                "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group",
                                                                isActive ? "bg-orange-50 text-orange-600 ring-1 ring-orange-100 shadow-sm" : "text-slate-500 hover:bg-white hover:shadow-sm"
                                                            )}
                                                            onClick={() => onSelectContent(content.id)}
                                                        >
                                                            <div className="shrink-0">
                                                                {isCompleted ? (
                                                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                                ) : isActive ? (
                                                                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                                                                ) : (
                                                                    <Circle className="w-4 h-4 text-slate-200 group-hover:text-slate-300" />
                                                                )}
                                                            </div>
                                                            <span className={cn("text-[11px] font-bold truncate leading-tight", isActive ? "text-orange-600" : "text-slate-600")}>
                                                                {content.title}
                                                            </span>
                                                            <div className="ml-auto opacity-30 group-hover:opacity-100 transition-all">
                                                                {content.type === 'VIDEO' ? <Video className="w-3 h-3" /> : content.type === 'TEST' ? <ClipboardList className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>

                    <div className="p-6 bg-slate-50 border-t border-slate-200">
                        {/* TODO: Buraya Ekleme Yapılacak */}
                    </div>
                </div>
            </div>
        </>
    );
}
