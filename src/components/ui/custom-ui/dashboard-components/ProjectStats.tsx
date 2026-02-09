"use client";

import { Folder, BookOpen, Calendar } from "lucide-react";
import { PROJECT_LIMITS } from "@/config/limits";
import { Role } from "@/types/auth";

interface ProjectStatsProps {
    projects: any[];
    userRole: Role;
}

export const ProjectStats = ({ projects, userRole }: ProjectStatsProps) => {
    const totalQuestions = projects.reduce((acc: number, p: any) => acc + (p._count?.questions || 0), 0);
    const activeDate = new Date().toLocaleDateString("tr-TR", { day: 'numeric', month: 'long' });
    const projectLimit = PROJECT_LIMITS[userRole];

    const stats = [
        {
            label: "Toplam Klasör",
            value: `${projects.length} / ${projectLimit === 1000 ? '∞' : projectLimit}`,
            icon: Folder,
            color: "text-brand-600 bg-brand-50"
        },
        {
            label: "Soru Sayısı",
            value: totalQuestions,
            icon: BookOpen,
            color: "text-blue-600 bg-blue-50"
        },
        {
            label: "Aktif Tarih",
            value: activeDate,
            icon: Calendar,
            color: "text-green-600 bg-green-50"
        }
    ];

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-1 shadow-sm flex flex-row items-stretch lg:divide-x divide-gray-50 overflow-x-auto custom-scrollbar-hide">
            {stats.map((stat, i) => (
                <div key={i} className="flex-1 min-w-[140px] flex items-center justify-center gap-3 py-3 px-4 hover:bg-gray-50/50 transition-colors first:rounded-l-xl last:rounded-r-xl border-r last:border-r-0 lg:border-r-0">
                    <div className={`h-8 w-8 rounded-lg ${stat.color} flex items-center justify-center shrink-0`}>
                        <stat.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                        <div className="text-[11px] sm:text-sm font-black text-gray-900 leading-none mb-1 truncate">{stat.value}</div>
                        <div className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.1em] text-gray-400 truncate">{stat.label}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};
