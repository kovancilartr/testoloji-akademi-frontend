"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useStudentStats } from "@/hooks/use-users";
import { useAssignments } from "@/hooks/use-assignments";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    BookOpen,
    CalendarDays,
    CheckCircle,
    Star,
    Sparkles,
    GraduationCap,
    Clock,
    TrendingUp,
    Target,
    Award,
    BookMarked,
    FileText,
    BarChart3
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useThemeColors } from "@/contexts/ThemeContext";

export default function StudentDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const { data: stats, isLoading } = useStudentStats();
    const { data: assignments, isLoading: assignmentsLoading } = useAssignments();
    const colors = useThemeColors();

    const upcomingAssignments = assignments?.filter(a => a.status === 'PENDING').slice(0, 3) || [];

    const statCards = [
        {
            title: "Bekleyen Ödevler",
            value: stats?.pending ?? 0,
            icon: Clock,
            description: "Çözmen gereken testler",
            link: "/dashboard/student/assignments"
        },
        {
            title: "Kayıtlı Kurslar",
            value: stats?.courses ?? 0,
            icon: BookOpen,
            description: "Dahil olduğun eğitimler",
            link: "/dashboard/student/library"
        },
        {
            title: "Tamamlanan Ödevler",
            value: stats?.completed ?? 0,
            icon: CheckCircle,
            description: "Başarıyla bitirdiklerin",
            link: "/dashboard/student/assignments"
        }
    ];

    const quickActions = [
        {
            title: "Ödev Takibi",
            description: "Öğretmenin tarafından atanan testleri çöz, anında geri bildirim al.",
            icon: Sparkles,
            link: "/dashboard/student/assignments",
            gradient: true
        },
        {
            title: "Çalışma Takvimi",
            description: "Haftalık programını incele, derslerine zamanında hazırlan.",
            icon: CalendarDays,
            link: "/dashboard/student/schedule",
            iconBg: "bg-purple-50",
            iconColor: "text-purple-600"
        },
        {
            title: "Kurs Kütüphanesi",
            description: "Kayıtlı olduğun kursları incele ve eğitim içeriklerine eriş.",
            icon: BookMarked,
            link: "/dashboard/student/library",
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600"
        },
        {
            title: "Performans Analizi",
            description: "Gelişimini takip et, güçlü ve zayıf yönlerini keşfet.",
            icon: BarChart3,
            link: "/dashboard/student/analytics",
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600"
        }
    ];

    const completionPercentage = Math.min(((stats?.completed ?? 0) / 5) * 100, 100);

    return (
        <div className="flex-1 p-8 overflow-y-auto space-y-8 custom-scrollbar bg-gradient-to-br from-gray-50 via-white to-gray-50/50 min-h-full">
            {/* Hoşgeldiniz Bölümü */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Merhaba, {user?.name?.split(' ')[0] || 'Öğrenci'}!
                        <span className="animate-bounce">🎒</span>
                    </h1>
                    <p className="text-gray-500 font-medium text-lg">
                        Testoloji ile bugün hangi dersine odaklanmak istersin?
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => router.push("/dashboard/student/analytics")}
                        variant="outline"
                        className="h-12 px-6 rounded-xl font-bold border-gray-200 hover:bg-white"
                    >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Performansım
                    </Button>
                    <Button
                        onClick={() => router.push("/dashboard/student/assignments")}
                        className={cn("shadow-xl h-12 px-8 font-black text-base transition-all hover:scale-105 active:scale-95 group rounded-xl text-white", colors.buttonBg, colors.buttonHover, colors.shadow)}
                    >
                        Ödevlerime Git
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* İstatistikler Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {isLoading ? (
                    [1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32 rounded-2xl" />
                    ))
                ) : (
                    statCards.map((card, idx) => (
                        <Card
                            key={idx}
                            className="border-gray-100 shadow-sm bg-white hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group cursor-pointer"
                            onClick={() => router.push(card.link)}
                        >
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={cn("p-3 rounded-xl transition-colors duration-300", colors.iconBg)}>
                                        <card.icon className={cn("w-6 h-6", colors.text)} />
                                    </div>
                                    <div className="flex items-center gap-1 text-emerald-500 font-bold text-[10px] bg-emerald-50 px-2 py-1 rounded-lg">
                                        AKADEMİ
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-3xl font-black text-gray-900 group-hover:scale-105 transition-transform origin-left">{card.value}</p>
                                    <h3 className="text-gray-400 font-bold text-[11px] uppercase tracking-wider">{card.title}</h3>
                                    <p className="text-[10px] text-gray-400 font-medium mt-1">{card.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Hızlı İşlemler */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-gray-900">Öğrenci Paneli Araçları</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {quickActions.map((action, idx) => (
                        <Link key={idx} href={action.link} className="group">
                            <div className={cn(
                                "p-6 rounded-2xl shadow-lg group-hover:scale-[1.02] transition-all relative overflow-hidden h-full",
                                action.gradient
                                    ? cn("bg-gradient-to-br text-white", colors.gradient, colors.shadow)
                                    : "bg-white border border-gray-100 shadow-sm"
                            )}>
                                <action.icon className={cn(
                                    "absolute -bottom-4 -right-4 w-24 h-24 opacity-10 group-hover:rotate-12 transition-transform",
                                    !action.gradient && "text-gray-200"
                                )} />
                                <div className="relative z-10">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                                        action.gradient
                                            ? "bg-white/20 backdrop-blur-md text-white"
                                            : cn(action.iconBg, action.iconColor)
                                    )}>
                                        <action.icon className="w-6 h-6" />
                                    </div>
                                    <h4 className={cn(
                                        "text-lg font-black mb-2",
                                        action.gradient ? "text-white" : "text-gray-900"
                                    )}>{action.title}</h4>
                                    <p className={cn(
                                        "text-xs font-medium leading-relaxed line-clamp-2",
                                        action.gradient ? "text-white/80" : "text-gray-500"
                                    )}>
                                        {action.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Alt Bölüm: Son Aktiviteler & Gelişim Durumu */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Son Ödevler */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-2xl font-black text-gray-900">Yaklaşan Ödevler</h3>
                    <div className="space-y-3">
                        {assignmentsLoading ? (
                            <Skeleton className="h-40 rounded-xl" />
                        ) : upcomingAssignments.length === 0 ? (
                            <Card className="border-gray-100 shadow-sm rounded-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colors.iconBg)}>
                                            <FileText className={cn("w-6 h-6", colors.text)} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900">Henüz ödev yok</h4>
                                            <p className="text-sm text-gray-500">Öğretmenin yeni ödev atadığında burada görünecek</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full rounded-xl font-bold border-gray-200 hover:bg-white"
                                        onClick={() => router.push("/dashboard/student/assignments")}
                                    >
                                        Ödevler Sayfasına Git
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {upcomingAssignments.map((assignment: any) => (
                                    <Card
                                        key={assignment.id}
                                        className="border-gray-50 shadow-sm rounded-xl hover:shadow-md transition-all cursor-pointer group"
                                        onClick={() => router.push(
                                            assignment.type === 'TEST'
                                                ? `/dashboard/student/exam/${assignment.id}`
                                                : '/dashboard/student/assignments'
                                        )}
                                    >
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors")}>
                                                <FileText className={cn("w-5 h-5 text-gray-400 group-hover:text-brand-500")} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 truncate">{assignment.title}</h4>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <CalendarDays className="w-3 h-3" />
                                                    {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }) : 'Süresiz'}
                                                </p>
                                            </div>
                                            <Button variant="ghost" size="sm" className="font-bold group-hover:text-brand-600">
                                                Çöz <ArrowRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Gelişim Durumu */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-black text-gray-900">Gelişim Durumu</h3>
                    <Card className={cn("border-none rounded-2xl overflow-hidden relative shadow-sm", colors.bg, colors.border)}>
                        <div className="p-6 relative z-10">
                            <div className={cn("w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6", colors.text)}>
                                <Star className={cn("w-8 h-8", colors.text, `fill-current`)} />
                            </div>
                            <h4 className="text-xl font-black text-gray-900 mb-2">Harika Gidiyorsun!</h4>
                            <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6">
                                Bu hafta {stats?.completed ?? 0} ödevi başarıyla tamamladın. Çalışmaya devam et!
                            </p>
                            <div className="space-y-4">
                                <div className={cn("flex justify-between items-center text-xs font-bold uppercase tracking-widest", colors.text)}>
                                    <span>Haftalık Hedef</span>
                                    <span>{completionPercentage.toFixed(0)}%</span>
                                </div>
                                <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-1000", colors.buttonBg)}
                                        style={{ width: `${completionPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
