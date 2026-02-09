"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Settings, Globe } from "lucide-react";

interface CourseHeaderProps {
    course: {
        title: string;
        isPublished: boolean;
    };
    onBack: () => void;
    onOpenSettings: () => void;
    onOpenPublish: () => void;
}

export function CourseHeader({ course, onBack, onOpenSettings, onOpenPublish }: CourseHeaderProps) {
    return (
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 md:px-8 py-4 transition-all group">
            <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors shrink-0"
                        onClick={onBack}
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                    </Button>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 pointer-events-none">
                            <Badge className="text-[9px] h-4 font-black bg-orange-500/10 text-orange-600 border-none px-1.5 uppercase leading-none">Müfredat Paneli</Badge>
                            {course.isPublished ? (
                                <Badge className="text-[9px] h-4 font-black bg-emerald-500/10 text-emerald-600 border-none px-1.5 uppercase leading-none">YAYINDA</Badge>
                            ) : (
                                <Badge className="text-[9px] h-4 font-black bg-slate-200 text-slate-500 border-none px-1.5 uppercase leading-none">TASLAK</Badge>
                            )}
                        </div>
                        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight truncate group-hover:text-orange-500 transition-colors">
                            {course.title}
                        </h1>
                    </div>
                </div>

                <div className="flex gap-2 shrink-0">
                    <Button
                        variant="outline"
                        size="icon"
                        className="md:hidden rounded-xl border-slate-200"
                        onClick={onOpenSettings}
                    >
                        <Settings className="w-4 h-4 text-slate-600" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden md:flex font-bold h-10 border-slate-200 rounded-xl hover:bg-slate-50 transition-all hover:border-slate-300"
                        onClick={onOpenSettings}
                    >
                        <Settings className="w-4 h-4 mr-2 text-slate-500" /> Ayarlar
                    </Button>
                    <Button
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 px-4 md:px-6 shadow-lg shadow-slate-200 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                        onClick={onOpenPublish}
                    >
                        <Globe className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Yayınla & Paylaş</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
