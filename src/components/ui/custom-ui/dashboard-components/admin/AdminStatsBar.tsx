"use client";

import { Users, Folder, FileText } from "lucide-react";

interface AdminStatsBarProps {
    stats: {
        totalUsers: number;
        totalProjects: number;
        totalQuestions: number;
    } | undefined;
}

export const AdminStatsBar = ({ stats }: AdminStatsBarProps) => {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-1 shadow-sm flex flex-col sm:flex-row items-center divide-y sm:divide-y-0 sm:divide-x divide-gray-50 overflow-hidden">
            {[
                { label: "Toplam Kullanıcı", value: stats?.totalUsers || 0, icon: Users, color: "text-brand-600 bg-brand-50" },
                { label: "Toplam Proje", value: stats?.totalProjects || 0, icon: Folder, color: "text-blue-600 bg-blue-50" },
                { label: "Toplam Soru", value: stats?.totalQuestions || 0, icon: FileText, color: "text-green-600 bg-green-50" },
            ].map((stat, i) => (
                <div key={i} className="flex-1 flex items-center justify-center gap-4 py-3 px-6 hover:bg-gray-50/50 transition-colors">
                    <div className={`h-8 w-8 rounded-lg ${stat.color} flex items-center justify-center shrink-0`}>
                        <stat.icon className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="text-sm font-black text-gray-900 leading-none mb-1">{stat.value}</div>
                        <div className="text-[9px] font-black uppercase tracking-[0.1em] text-gray-400">{stat.label}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};
