"use client";

import { StudentAnalyticsView } from "@/components/analytics/StudentAnalyticsView";
import { BarChart3, Info } from "lucide-react";

export default function StudentAnalyticsPage() {
    return (
        <div className="flex-1 p-8 space-y-10 bg-slate-50/50 min-h-screen overflow-y-auto custom-scrollbar">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-2">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-xl shadow-orange-500/10 flex items-center justify-center border border-orange-100">
                            <BarChart3 className="w-8 h-8 text-orange-500" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Akademik Gelişim Raporu</h1>
                            <p className="text-slate-500 font-medium text-lg mt-1">Sınav performansın ve gelişim önerilerin.</p>
                        </div>
                    </div>
                </div>

                <div className="xl:max-w-md w-full bg-white/40 backdrop-blur-sm border border-white rounded-[2rem] p-5 shadow-sm hover:shadow-md transition-all group shrink-0">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Info className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-black text-slate-900 text-sm">Nasıl Okumalıyım?</h4>
                            <p className="text-slate-500 text-[11px] font-bold leading-relaxed">
                                Veriler, çözdüğün son testlere ve izlediğin eğitim videolarına göre anlık hesaplanır.
                                <span className="text-indigo-600 ml-1">AI Önerileri</span> kısmını takip etmeyi unutma!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <StudentAnalyticsView />
        </div>
    );
}
