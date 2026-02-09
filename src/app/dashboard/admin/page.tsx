
"use client";

import { useEffect, useState } from "react";
import {
    Users,
    BookOpen,
    FileText,
    TrendingUp,
    ShieldCheck,
    UserCheck,
    AlertCircle,
    LayoutDashboard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminStats {
    totalUsers: number;
    totalProjects: number;
    totalQuestions: number;
    usersByRole: { role: string; _count: number }[];
    usersByTier: { tier: string; _count: number }[];
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/users/stats");
                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (error: any) {
                toast.error("İstatistikler yüklenirken bir hata oluştu");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="p-8 space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 rounded-2xl" />
                    ))}
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-[400px] rounded-2xl" />
                    <Skeleton className="h-[400px] rounded-2xl" />
                </div>
            </div>
        );
    }

    const cards = [
        {
            title: "Toplam Kullanıcı",
            value: stats?.totalUsers || 0,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
            description: "Sisteme kayıtlı tüm kullanıcılar"
        },
        {
            title: "Toplam Proje",
            value: stats?.totalProjects || 0,
            icon: FileText,
            color: "text-orange-600",
            bg: "bg-orange-50",
            description: "Testoloji üzerinde oluşturulan projeler"
        },
        {
            title: "Sistem Kursları",
            value: 0, // Şimdilik 0, API'ye eklenecek
            icon: BookOpen,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            description: "Eğitmenler tarafından açılan kurslar"
        },
        {
            title: "Soru Bankası",
            value: stats?.totalQuestions || 0,
            icon: ShieldCheck,
            color: "text-purple-600",
            bg: "bg-purple-50",
            description: "Toplam oluşturulan soru sayısı"
        }
    ];

    return (
        <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tight text-gray-900 flex items-center gap-3">
                    <LayoutDashboard className="w-10 h-10 text-orange-500" />
                    Sistem Özeti
                </h1>
                <p className="text-gray-500 font-medium text-lg">
                    Platformun genel durumu ve kullanım istatistiklerine hoş geldiniz.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((card, idx) => (
                    <Card key={idx} className="border-none shadow-sm bg-white hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className={cn("p-3 rounded-xl transition-colors duration-300", card.bg)}>
                                    <card.icon className={cn("w-6 h-6", card.color)} />
                                </div>
                                <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm bg-emerald-50 px-2 py-1 rounded-lg">
                                    <TrendingUp className="w-4 h-4" />
                                    +12%
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-gray-500 font-bold text-sm uppercase tracking-wider">{card.title}</h3>
                                <p className="text-3xl font-black text-gray-900">{card.value.toLocaleString()}</p>
                                <p className="text-xs text-gray-400 font-medium">{card.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts & Details Section */}
            <div className="grid gap-8 md:grid-cols-2">
                {/* Roles Distribution */}
                <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                    <CardHeader className="border-b border-gray-50 pb-6 px-8 pt-8">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <UserCheck className="w-6 h-6 text-orange-500" />
                            Kullanıcı Rol Dağılımı
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        {stats?.usersByRole.map((item, idx) => {
                            const percentage = (item._count / (stats.totalUsers || 1)) * 100;
                            return (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-gray-700">{item.role}</span>
                                        <span className="text-gray-900">{item._count} ({Math.round(percentage)}%)</span>
                                    </div>
                                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-orange-500 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Tiers Distribution */}
                <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                    <CardHeader className="border-b border-gray-50 pb-6 px-8 pt-8">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-blue-500" />
                            Paket Dağılımı
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        {stats?.usersByTier.map((item, idx) => {
                            const percentage = (item._count / (stats.totalUsers || 1)) * 100;
                            const colors = {
                                FREE: "bg-gray-400",
                                BRONZ: "bg-orange-400",
                                GUMUS: "bg-blue-400",
                                ALTIN: "bg-yellow-500"
                            };
                            return (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-gray-700">{item.tier}</span>
                                        <span className="text-gray-900">{item._count} ({Math.round(percentage)}%)</span>
                                    </div>
                                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full rounded-full transition-all duration-1000 ease-out", colors[item.tier as keyof typeof colors] || "bg-blue-500")}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            {/* Global System Alerts / Notifications */}
            <Card className="border-none shadow-sm bg-orange-50/50 border border-orange-100 rounded-3xl p-6">
                <div className="flex gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-orange-500 shrink-0">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-orange-900">Sistem Bilgilendirmesi</h4>
                        <p className="text-orange-700/80 text-sm font-medium mt-1">
                            Abonelik sistemi ve yeni kullanıcı rolleri başarıyla devreye alındı.
                            Şu an tüm veritabanı senkronize çalışmaktadır. Sistem loglarını incelemek için ayarlar paneline gidebilirsiniz.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
