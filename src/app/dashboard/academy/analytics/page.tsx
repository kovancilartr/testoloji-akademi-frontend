"use client";

import { useTeacherAnalytics } from "@/hooks/use-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    TrendingUp,
    Users,
    BarChart3,
    ChevronRight,
    ArrowUpRight,
    Search,
    Filter
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Cell
} from "recharts";
import { Input } from "@/components/ui/input";

import { RoleProtect } from "@/components/providers/RoleProtect";
import { Role } from "@/types/auth";

export default function AcademyAnalyticsPage() {
    const { data: analytics, isLoading } = useTeacherAnalytics();
    const router = useRouter();

    if (isLoading) return <div className="p-20 text-center font-black text-slate-400 animate-pulse">Sınıf verileri analiz ediliyor...</div>;

    const COLORS = ['#4f46e5', '#f97316', '#10b981', '#6366f1', '#f43f5e'];

    return (
        <RoleProtect allowedRoles={[Role.TEACHER, Role.ADMIN]}>
            <div className="flex-1 p-8 space-y-10 bg-slate-50/50 min-h-screen overflow-y-auto custom-scrollbar">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <TrendingUp className="w-10 h-10 text-indigo-600" />
                            Akademi Performans Merkezi
                        </h1>
                        <p className="text-slate-500 font-medium text-lg">
                            Sınıfınızın genel başarı durumu, öne çıkan öğrenciler ve gelişim istatistikleri.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stats */}
                    <Card className="border-none shadow-lg bg-indigo-600 text-white rounded-[2rem] p-6 relative overflow-hidden transition-all hover:shadow-xl">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl" />
                        <h4 className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-4">Sınıf Ortalaması</h4>
                        <div className="flex items-end gap-2 mb-1">
                            <span className="text-4xl font-black italic">%{analytics?.averageClassGrade ?? 0}</span>
                            <TrendingUp className="w-6 h-6 mb-1 text-indigo-300" />
                        </div>
                    </Card>

                    <Card className="border-none shadow-lg bg-white rounded-[2rem] p-6 relative overflow-hidden group transition-all hover:shadow-xl">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Aktif Öğrenci Sayısı</h4>
                        <div className="flex items-end gap-2 mb-1">
                            <span className="text-4xl font-black italic text-slate-900">{analytics?.totalStudents ?? 0}</span>
                            <Users className="w-6 h-6 mb-1 text-indigo-600" />
                        </div>
                    </Card>

                    <Card className="border-none shadow-lg bg-slate-900 text-white rounded-[2rem] p-6 relative overflow-hidden transition-all hover:shadow-xl">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Genel Durum</h4>
                        <div className="mt-2 space-y-1.5">
                            <Badge className="bg-emerald-500 text-white border-none font-black px-2.5 py-0.5 text-[9px]">YÜKSELİŞTE</Badge>
                            <p className="text-[11px] font-medium text-slate-400 leading-tight">
                                Sınıf başarısı geçen haftaya göre %12 artış gösterdi.
                            </p>
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Class Performance Chart */}
                    <Card className="lg:col-span-2 border-none shadow-2xl bg-white rounded-[3rem] p-10 overflow-hidden">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Öğrenci Başarı Dağılımı</h3>
                                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Sınav puanı ortalamaları</p>
                            </div>
                            <BarChart3 className="w-8 h-8 text-indigo-600" />
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics?.studentData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', padding: '20px' }}
                                        cursor={{ fill: '#f8fafc' }}
                                    />
                                    <Bar dataKey="avgGrade" radius={[12, 12, 12, 12]} barSize={40}>
                                        {analytics?.studentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Top Students List */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-black text-slate-900 flex items-center justify-between px-2">
                            Detaylı Liste
                            <div className="flex gap-2">
                                <Button size="icon" variant="ghost" className="rounded-xl"><Search className="w-4 h-4" /></Button>
                                <Button size="icon" variant="ghost" className="rounded-xl"><Filter className="w-4 h-4" /></Button>
                            </div>
                        </h3>
                        <div className="space-y-4">
                            {analytics?.studentData.map((s, idx) => (
                                <Card
                                    key={s.id}
                                    className="border-none shadow-lg bg-white rounded-3xl p-5 hover:ring-2 hover:ring-indigo-100 transition-all cursor-pointer group"
                                    onClick={() => router.push(`/dashboard/academy/students/${s.id}`)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-900 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                {s.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 text-sm group-hover:text-indigo-600 transition-colors uppercase">{s.name}</p>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                        <span className="text-[10px] font-black text-slate-500">{s.totalCorrect}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                                        <span className="text-[10px] font-black text-slate-500">{s.totalWrong}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full">
                                                        <span className="text-[9px] font-black text-slate-600">NET: {s.avgNet}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-indigo-600 mb-1">
                                                <span className="text-xs font-black">%{s.avgGrade}</span>
                                                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </div>
                                            <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-100">İNCELE</Badge>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </RoleProtect>
    );
}
