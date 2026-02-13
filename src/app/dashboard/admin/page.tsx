
"use client";

import {
    Users,
    BookOpen,
    FileText,
    TrendingUp,
    ShieldCheck,
    UserCheck,
    LayoutDashboard,
    Bot,
    GraduationCap,
    ClipboardCheck,
    Clock,
    CheckCircle2,
    Settings,
    ArrowRight,
    Activity,
    BookOpenCheck,
    Crown,
    Sparkles,
    ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { useUserStats } from "@/hooks/use-users";

export default function AdminDashboardPage() {
    const { data: stats, isLoading } = useUserStats();

    if (isLoading) {
        return (
            <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-96 max-w-full" />
                </div>
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 rounded-2xl" />
                    ))}
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-[300px] rounded-2xl" />
                    <Skeleton className="h-[300px] rounded-2xl" />
                    <Skeleton className="h-[300px] rounded-2xl" />
                </div>
            </div>
        );
    }

    const primaryCards = [
        {
            title: "Toplam Kullanıcı",
            value: stats?.totalUsers || 0,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
            iconBg: "bg-blue-100",
            border: "border-blue-100",
            href: "/dashboard/admin/users",
        },
        {
            title: "Toplam Proje",
            value: stats?.totalProjects || 0,
            icon: FileText,
            color: "text-orange-600",
            bg: "bg-orange-50",
            iconBg: "bg-orange-100",
            border: "border-orange-100",
            href: "/dashboard/projects",
        },
        {
            title: "Soru Bankası",
            value: stats?.totalQuestions || 0,
            icon: ShieldCheck,
            color: "text-purple-600",
            bg: "bg-purple-50",
            iconBg: "bg-purple-100",
            border: "border-purple-100",
        },
        {
            title: "Aktif Kurslar",
            value: stats?.totalCourses || 0,
            icon: BookOpen,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            iconBg: "bg-emerald-100",
            border: "border-emerald-100",
            href: "/dashboard/admin/courses",
        },
    ];

    const secondaryCards = [
        {
            title: "Toplam Ödev",
            value: stats?.totalAssignments || 0,
            icon: ClipboardCheck,
            sub: `${stats?.completedAssignments || 0} tamamlandı`,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
        },
        {
            title: "Bekleyen Ödev",
            value: stats?.pendingAssignments || 0,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
        {
            title: "AI Koçluk",
            value: stats?.totalCoachingSessions || 0,
            icon: Bot,
            sub: "toplam oturum",
            color: "text-violet-600",
            bg: "bg-violet-50",
        },
        {
            title: "Kurs Kaydı",
            value: stats?.totalEnrollments || 0,
            icon: BookOpenCheck,
            color: "text-teal-600",
            bg: "bg-teal-50",
        },
    ];

    const tierColors: Record<string, { bg: string; text: string; label: string; icon: any }> = {
        FREE: { bg: "bg-gray-100", text: "text-gray-600", label: "Ücretsiz", icon: Users },
        BRONZ: { bg: "bg-orange-100", text: "text-orange-700", label: "Bronz", icon: GraduationCap },
        GUMUS: { bg: "bg-slate-100", text: "text-slate-700", label: "Gümüş", icon: Sparkles },
        ALTIN: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Altın", icon: Crown },
    };

    const roleLabels: Record<string, string> = {
        ADMIN: "Yönetici",
        TEACHER: "Eğitmen",
        STUDENT: "Öğrenci",
    };

    const roleColors: Record<string, string> = {
        ADMIN: "bg-red-500",
        TEACHER: "bg-blue-500",
        STUDENT: "bg-emerald-500",
    };

    const completionRate = stats?.totalAssignments
        ? Math.round(((stats.completedAssignments || 0) / stats.totalAssignments) * 100)
        : 0;

    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-2xl flex items-center justify-center border border-orange-50 shadow-sm">
                            <LayoutDashboard className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                        </div>
                        Sistem Özeti
                    </h1>
                    <p className="text-gray-500 font-medium text-sm md:text-base ml-1">
                        Platformun genel durumu ve kullanım istatistikleri
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
                        <Activity className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider">
                            {stats?.activeUsersLast7Days || 0} Aktif (7 gün)
                        </span>
                    </div>
                </div>
            </div>

            {/* Primary Stats Cards */}
            <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
                {primaryCards.map((card, idx) => (
                    <Card
                        key={idx}
                        className={cn(
                            "border shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group cursor-pointer",
                            card.border
                        )}
                    >
                        {card.href ? (
                            <Link href={card.href}>
                                <CardContent className="p-4 md:p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={cn("p-2 md:p-2.5 rounded-xl", card.iconBg)}>
                                            <card.icon className={cn("w-4 h-4 md:w-5 md:h-5", card.color)} />
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
                                    </div>
                                    <p className="text-2xl md:text-3xl font-black text-gray-900">{card.value.toLocaleString()}</p>
                                    <p className="text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{card.title}</p>
                                </CardContent>
                            </Link>
                        ) : (
                            <CardContent className="p-4 md:p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className={cn("p-2 md:p-2.5 rounded-xl", card.iconBg)}>
                                        <card.icon className={cn("w-4 h-4 md:w-5 md:h-5", card.color)} />
                                    </div>
                                </div>
                                <p className="text-2xl md:text-3xl font-black text-gray-900">{card.value.toLocaleString()}</p>
                                <p className="text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{card.title}</p>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>

            {/* Secondary Stats - Compact */}
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                {secondaryCards.map((card, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "flex items-center gap-3 p-3 md:p-4 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all"
                        )}
                    >
                        <div className={cn("p-2 rounded-xl shrink-0", card.bg)}>
                            <card.icon className={cn("w-4 h-4", card.color)} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-lg md:text-xl font-black text-gray-900 leading-tight">{card.value.toLocaleString()}</p>
                            <p className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-wider truncate">{card.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Roles Distribution */}
                <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white lg:col-span-1">
                    <CardHeader className="border-b border-gray-50 p-4 md:p-6">
                        <CardTitle className="text-base md:text-lg font-black flex items-center gap-2">
                            <UserCheck className="w-5 h-5 text-orange-500" />
                            Rol Dağılımı
                        </CardTitle>
                        <CardDescription className="text-xs font-bold text-gray-400">Kullanıcı rolleri</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 space-y-4">
                        {stats?.usersByRole.map((item, idx) => {
                            const percentage = (item._count / (stats.totalUsers || 1)) * 100;
                            return (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-2.5 h-2.5 rounded-full", roleColors[item.role] || "bg-gray-400")} />
                                            <span className="text-gray-700">{roleLabels[item.role] || item.role}</span>
                                        </div>
                                        <span className="text-gray-900 tabular-nums">{item._count} <span className="text-gray-400 text-xs">({Math.round(percentage)}%)</span></span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full rounded-full transition-all duration-1000 ease-out", roleColors[item.role] || "bg-gray-400")}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        {/* Ödev Tamamlanma */}
                        <div className="mt-6 pt-4 border-t border-gray-50">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Ödev Tamamlanma</span>
                                <span className="text-sm font-black text-gray-900">{completionRate}%</span>
                            </div>
                            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-linear-to-r from-emerald-400 to-teal-500 transition-all duration-1000"
                                    style={{ width: `${completionRate}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tier Distribution */}
                <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white lg:col-span-1">
                    <CardHeader className="border-b border-gray-50 p-4 md:p-6">
                        <CardTitle className="text-base md:text-lg font-black flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-blue-500" />
                            Paket Dağılımı
                        </CardTitle>
                        <CardDescription className="text-xs font-bold text-gray-400">Abonelik paketleri</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 space-y-3">
                        {stats?.usersByTier.map((item, idx) => {
                            const percentage = (item._count / (stats.totalUsers || 1)) * 100;
                            const tierInfo = tierColors[item.tier] || { bg: "bg-gray-100", text: "text-gray-700", label: item.tier, icon: Users };
                            const TierIcon = tierInfo.icon;
                            return (
                                <div
                                    key={idx}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-xl border transition-all",
                                        tierInfo.bg, "border-transparent"
                                    )}
                                >
                                    <div className="w-9 h-9 rounded-lg bg-white/80 flex items-center justify-center shadow-sm shrink-0">
                                        <TierIcon className={cn("w-4 h-4", tierInfo.text)} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className={cn("text-sm font-black", tierInfo.text)}>{tierInfo.label}</span>
                                            <span className="text-sm font-black text-gray-900 tabular-nums">{item._count}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/60 rounded-full overflow-hidden mt-1.5">
                                            <div
                                                className={cn("h-full rounded-full transition-all duration-1000")}
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: item.tier === "ALTIN" ? "#eab308"
                                                        : item.tier === "GUMUS" ? "#64748b"
                                                            : item.tier === "BRONZ" ? "#f97316"
                                                                : "#9ca3af"
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Yeni Kayıtlar Bilgisi */}
                        <div className="mt-4 p-3 rounded-xl bg-linear-to-br from-indigo-50 to-blue-50 border border-indigo-100">
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="w-4 h-4 text-indigo-500" />
                                <span className="text-[11px] font-black text-indigo-600 uppercase tracking-wider">Son 30 Gün</span>
                            </div>
                            <p className="text-xl font-black text-indigo-900">{stats?.newUsersLast30Days || 0} <span className="text-sm font-bold text-indigo-400">yeni kayıt</span></p>
                        </div>
                    </CardContent>
                </Card>

                {/* Son Kullanıcılar */}
                <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white lg:col-span-1">
                    <CardHeader className="border-b border-gray-50 p-4 md:p-6 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base md:text-lg font-black flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-amber-500" />
                                Son Kayıtlar
                            </CardTitle>
                            <CardDescription className="text-xs font-bold text-gray-400">En yeni kullanıcılar</CardDescription>
                        </div>
                        <Link href="/dashboard/admin/users">
                            <Button variant="ghost" size="sm" className="text-xs font-bold text-gray-400 hover:text-orange-600 gap-1 rounded-xl">
                                Tümü <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-50">
                            {stats?.latestUsers.map((user) => (
                                <div key={user.id} className="flex items-center gap-3 p-3 md:p-4 hover:bg-gray-50/50 transition-colors">
                                    <Avatar className="w-9 h-9 shrink-0 border border-gray-100">
                                        <AvatarFallback className={cn(
                                            "font-bold text-sm",
                                            user.role === "ADMIN" ? "bg-red-100 text-red-600"
                                                : user.role === "TEACHER" ? "bg-blue-100 text-blue-600"
                                                    : "bg-orange-100 text-orange-600"
                                        )}>
                                            {user.name?.charAt(0) || "?"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                        <p className="text-[10px] text-gray-400 font-medium truncate">{user.email}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md",
                                            tierColors[user.tier]?.bg || "bg-gray-100",
                                            tierColors[user.tier]?.text || "text-gray-600"
                                        )}>
                                            {tierColors[user.tier]?.label || user.tier}
                                        </span>
                                        <span className="text-[9px] text-gray-400 font-medium">
                                            {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true, locale: tr })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Access Links */}
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
                <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Settings className="w-5 h-5 text-slate-400" />
                        <h3 className="font-black text-sm uppercase tracking-wider text-slate-300">Hızlı Erişim</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: "Kullanıcılar", href: "/dashboard/admin/users", icon: Users, desc: "Yönet" },
                            { label: "Kurslar", href: "/dashboard/admin/courses", icon: BookOpen, desc: "Düzenle" },
                            { label: "Projeler", href: "/dashboard/projects", icon: FileText, desc: "İncele" },
                            { label: "Ayarlar", href: "/dashboard/admin/settings", icon: Settings, desc: "Yapılandır" },
                        ].map((link) => (
                            <Link key={link.href} href={link.href}>
                                <div className="group p-3 md:p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
                                    <link.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors mb-2" />
                                    <p className="text-sm font-black text-white">{link.label}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{link.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* System Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                <div className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Servis</p>
                        <p className="text-sm font-black text-gray-900">Gemini AI Aktif</p>
                    </div>
                </div>
                <div className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shrink-0">
                        <ShieldCheck className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Güvenlik</p>
                        <p className="text-sm font-black text-gray-900">AES-256 Devrede</p>
                    </div>
                </div>
                <div className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center border border-orange-100 shrink-0">
                        <Settings className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Versiyon</p>
                        <p className="text-sm font-black text-gray-900">v2.4 Core</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
