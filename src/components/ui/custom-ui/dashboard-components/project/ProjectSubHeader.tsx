"use client";

import { Layout as LayoutIcon, Sparkles } from "lucide-react";

interface ProjectSubHeaderProps {
    questionCount: number;
}

export const ProjectSubHeader = ({ questionCount }: ProjectSubHeaderProps) => {
    return (
        <div className="flex items-center justify-between px-1 sm:px-2">
            <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-brand-50 rounded-xl sm:rounded-2xl border border-brand-100 shadow-inner">
                    <LayoutIcon className="h-4 w-4 sm:h-5 sm:w-5 text-brand-500" />
                </div>
                <div>
                    <h2 className="text-sm sm:text-base lg:text-lg font-black text-gray-900 uppercase tracking-tight">Dizgiye Dahil Sorular</h2>
                    <p className="hidden sm:block text-xs text-gray-400 font-medium tracking-tight mt-0.5">Sıralamayı sürükleyerek değiştirebilirsin</p>
                </div>
            </div>
            <div className="bg-brand-500/5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border border-brand-500/10 text-[9px] sm:text-[11px] font-black text-brand-600 uppercase tracking-widest flex items-center gap-1.5 sm:gap-2">
                <Sparkles className="h-3 w-3" />
                {questionCount} <span className="hidden xs:inline">SORU</span>
            </div>
        </div>
    );
};
