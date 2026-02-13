"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import {
    BrainCircuit, History, Activity, MessageSquare,
    Loader2, Calendar, ChevronDown, ChevronUp,
    ChevronLeft, ChevronRight, MessageCircle, ArrowLeft
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

const HistoryRow = ({ chat }: { chat: any }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { theme } = useTheme();

    // Theme mapping for Tailwind
    const color = theme === "black" ? "gray" : theme;
    const isGray = theme === "black";

    return (
        <div className="border-b border-gray-50 last:border-0">
            <div
                className={cn(
                    "grid grid-cols-12 gap-4 px-4 py-4 items-center cursor-pointer hover:bg-gray-50/50 transition-all group",
                    isExpanded && `bg-${color}-50/30`
                )}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="col-span-3">
                    <span className={cn(
                        "text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider",
                        `text-${color}-600 bg-${color}-50`,
                        isGray && "text-gray-900 bg-gray-100"
                    )}>
                        {format(new Date(chat.createdAt), "HH:mm | d MMM", { locale: tr })}
                    </span>
                </div>
                <div className="col-span-8">
                    <p className={cn(
                        "text-sm font-bold text-gray-700 truncate transition-colors",
                        `group-hover:text-${color}-700`,
                        isGray && "group-hover:text-black"
                    )}>
                        {chat.query}
                    </p>
                </div>
                <div className="col-span-1 flex justify-end">
                    <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                        isExpanded
                            ? (isGray ? "bg-gray-900 text-white shadow-lg shadow-gray-200" : `bg-${color}-600 text-white shadow-lg shadow-${color}-200`)
                            : `bg-gray-50 text-gray-400 group-hover:bg-${color}-100 group-hover:text-${color}-600`,
                        !isExpanded && isGray && "group-hover:bg-gray-200 group-hover:text-gray-900"
                    )}>
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="px-4 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
                        <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 bg-gray-50 rounded-lg">
                                    <MessageCircle className="w-4 h-4 text-gray-400" />
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Öğrenci Sorgusu</p>
                            </div>
                            <p className="text-sm font-bold text-gray-800 italic leading-relaxed pl-1">
                                "{chat.query}"
                            </p>
                        </div>
                        <div className={cn(
                            "p-5 rounded-3xl border shadow-sm hover:shadow-md transition-shadow",
                            `bg-${color}-50/30 border-${color}-100/50`,
                            isGray && "bg-gray-50 border-gray-200"
                        )}>
                            <div className="flex items-center gap-2 mb-3">
                                <div className={cn(
                                    "p-1.5 rounded-lg",
                                    `bg-${color}-100`,
                                    isGray && "bg-gray-200"
                                )}>
                                    <BrainCircuit className={cn(
                                        "w-4 h-4",
                                        `text-${color}-600`,
                                        isGray && "text-gray-900"
                                    )} />
                                </div>
                                <p className={cn(
                                    "text-[10px] font-black uppercase tracking-widest",
                                    `text-${color}-600`,
                                    isGray && "text-gray-900"
                                )}>AI Koç Yanıtı</p>
                            </div>
                            <div className="text-sm font-medium text-gray-700 leading-relaxed whitespace-pre-wrap pl-1">
                                {chat.response}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function UserAiStatsPage() {
    const params = useParams();
    const router = useRouter();
    const { theme } = useTheme();
    const userId = params.userId as string;
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    // Theme mapping
    const color = theme === "black" ? "gray" : theme;
    const isGray = theme === "black";

    // Fetch user details to show name
    const { data: userData } = useQuery({
        queryKey: ["user-detail", userId],
        queryFn: async () => {
            const response = await api.get(`/users/${userId}`);
            return response.data.data;
        },
    });

    const { data, isLoading } = useQuery({
        queryKey: ["user-ai-stats", userId],
        queryFn: async () => {
            const response = await api.get(`/coaching/${userId}/stats`);
            return response.data.data;
        },
    });

    const paginatedHistory = data?.history
        ? data.history.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        : [];

    const totalPages = data?.history ? Math.ceil(data.history.length / pageSize) : 0;

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-20 gap-4 bg-gray-50/50">
                <Loader2 className={cn(
                    "w-12 h-12 animate-spin",
                    `text-${color}-600`,
                    isGray && "text-gray-900"
                )} />
                <p className="text-sm font-black text-gray-500 uppercase tracking-widest animate-pulse">Analiz Verileri Hazırlanıyor...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-gray-50/50 overflow-y-auto custom-scrollbar">
            {/* Header Area */}
            <div className="bg-white border-b border-gray-200 px-8 py-6 relative overflow-hidden shrink-0">
                <div className={cn(
                    "absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl",
                    `bg-${color}-50`,
                    isGray && "bg-gray-100"
                )} />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-50 rounded-full -ml-24 -mb-24 opacity-50 blur-3xl" />

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-2xl border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all group"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-gray-900" />
                        </Button>
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl ring-4",
                                isGray ? "bg-gray-900 shadow-gray-200 ring-gray-50" : `bg-${color}-600 shadow-${color}-200 ring-${color}-50`
                            )}>
                                <BrainCircuit className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight">AI Kullanım Analizi</h1>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <Badge variant="outline" className={cn(
                                        "font-bold uppercase text-[9px] tracking-widest px-2.5",
                                        isGray ? "bg-gray-50 text-gray-900 border-gray-200" : `bg-${color}-50 text-${color}-700 border-${color}-100`
                                    )}>
                                        Öğrenci Detayı
                                    </Badge>
                                    <span className="text-gray-400 font-medium">/</span>
                                    <span className="text-sm font-black text-gray-600 uppercase tracking-wide">{userData?.name || userData?.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <div className="max-w-6xl mx-auto p-8 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className={cn(
                            "p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all duration-300",
                            `hover:border-${color}-100`
                        )}>
                            <div className={cn(
                                "w-16 h-16 rounded-[24px] flex items-center justify-center group-hover:scale-110 transition-transform",
                                isGray ? "bg-gray-100 text-gray-900" : `bg-${color}-50 text-${color}-600`
                            )}>
                                <MessageSquare className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Toplam İstem</p>
                                <p className={cn(
                                    "text-4xl font-black text-gray-900 transition-colors",
                                    `group-hover:text-${color}-600`,
                                    isGray && "group-hover:text-black"
                                )}>{data?.totalPrompts || 0}</p>
                            </div>
                        </div>
                        <div className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
                            <div className="w-16 h-16 rounded-[24px] bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                <Activity className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Haftalık Aktivite</p>
                                <p className="text-4xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">
                                    {data?.dailyUsage?.reduce((acc: number, d: any) => acc + d.count, 0) || 0}
                                </p>
                            </div>
                        </div>
                        <div className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:border-emerald-100 transition-all duration-300">
                            <div className="w-16 h-16 rounded-[24px] bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                <History className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Son Etkileşim</p>
                                <p className="text-sm font-black text-gray-900 uppercase">
                                    {data?.history?.[0] ? format(new Date(data.history[0].createdAt), "d MMMM", { locale: tr }) : "-"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Daily Summary Sidebar */}
                        <div className="lg:col-span-4 space-y-4">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Günlük Kullanım Özeti</h3>
                            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                                {data?.dailyUsage?.length > 0 ? data.dailyUsage.map((day: any) => (
                                    <div key={day.date} className="flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700">
                                                {format(new Date(day.date), "d MMMM yyyy", { locale: tr })}
                                            </span>
                                        </div>
                                        <Badge className={cn(
                                            "border-none px-3 font-black text-[10px] rounded-lg",
                                            isGray ? "bg-gray-200 text-gray-900 hover:bg-gray-300" : `bg-${color}-100 text-${color}-700 hover:bg-${color}-200`
                                        )}>
                                            {day.count} Mesaj
                                        </Badge>
                                    </div>
                                )) : (
                                    <div className="p-12 text-center">
                                        <p className="text-sm text-gray-400 font-bold italic">Kayıt bulunamadı.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* History Table Column */}
                        <div className="lg:col-span-8 space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Genişletilmiş Konuşma Geçmişi</h3>
                                {totalPages > 1 && (
                                    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-2xl border border-gray-100 shadow-sm">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{currentPage} / {totalPages}</span>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={cn(
                                                    "h-7 w-7 rounded-lg transition-colors disabled:opacity-30",
                                                    isGray ? "hover:bg-gray-100 hover:text-black" : `hover:bg-${color}-50 hover:text-${color}-600`
                                                )}
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={cn(
                                                    "h-7 w-7 rounded-lg transition-colors disabled:opacity-30",
                                                    isGray ? "hover:bg-gray-100 hover:text-black" : `hover:bg-${color}-50 hover:text-${color}-600`
                                                )}
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden min-h-[400px]">
                                {/* Table Header */}
                                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/80 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <div className="col-span-3">Zaman Damgası</div>
                                    <div className="col-span-8">Soru / İstem İçeriği</div>
                                    <div className="col-span-1 text-right">Eylem</div>
                                </div>

                                {/* Table Body */}
                                <div className="divide-y divide-gray-50">
                                    {paginatedHistory.length > 0 ? paginatedHistory.map((chat: any) => (
                                        <HistoryRow key={chat.id} chat={chat} />
                                    )) : (
                                        <div className="flex flex-col items-center justify-center p-24 gap-4">
                                            <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center">
                                                <MessageCircle className="w-8 h-8 text-gray-200" />
                                            </div>
                                            <p className="text-sm text-gray-400 font-bold italic">Henüz bir konuşma geçmişi bulunmuyor.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
