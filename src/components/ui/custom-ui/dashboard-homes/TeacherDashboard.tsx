"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTeacherStats } from "@/hooks/use-users";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    FolderOpen,
    BookOpen,
    Users,
    Calendar,
    Sparkles,
    ChevronRight,
    TrendingUp,
    ArrowRight,
    Clock,
    Target,
    Award,
    BarChart3,
    BookMarked,
    CalendarDays,
    FileText,
    GraduationCap
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeacherAnalytics } from "@/hooks/use-analytics";
import { cn } from "@/lib/utils";
import { useThemeColors } from "@/contexts/ThemeContext";

export default function TeacherDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const { data: stats, isLoading } = useTeacherStats();
    const { data: teacherAnalytics } = useTeacherAnalytics();
    const colors = useThemeColors();

    const statCards = [
        {
            title: "Toplam Proje",
            value: stats?.totalProjects ?? 0,
            icon: FolderOpen,
            description: "Oluşturduğunuz testler",
            link: "/dashboard/projects"
        },
        {
            title: "Aktif Öğrenciler",
            value: stats?.totalStudents ?? 0,
            icon: Users,
            description: "Sınıfınızdaki öğrenciler",
            link: "/dashboard/academy/students"
        },
        {
            title: "Sistem Kursları",
            value: stats?.totalCourses ?? 0,
            icon: BookOpen,
            description: "Yayınladığınız kurslar",
            link: "/dashboard/academy/courses"
        },
        {
            title: "Bekleyen Ödevler",
            value: stats?.totalAssignments ?? 0,
            icon: Calendar,
            description: "Kontrol edilecekler",
            link: "/dashboard/academy/assignments"
        }
    ];

    const quickActions = [
        {
            title: "Soru Bankası",
            description: "PDF üzerinden soruları saniyeler içinde kırpın ve sınıflarınıza ödev olarak atayın.",
            icon: Sparkles,
            link: "/dashboard/projects",
            gradient: true
        },
        {
            title: "Öğrenci Yönetimi",
            description: "Öğrencilerinizin ödev takibini yapın ve gelişim raporlarını anlık olarak izleyin.",
            icon: Users,
            link: "/dashboard/academy/students",
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600"
        },
        {
            title: "Ders Programı",
            description: "Öğrencileriniz için haftalık çalışma programı oluşturun ve takip edin.",
            icon: CalendarDays,
            link: "/dashboard/academy/schedule",
            iconBg: "bg-purple-50",
            iconColor: "text-purple-600"
        },
        {
            title: "Kurs Yönetimi",
            description: "Eğitim içeriklerinizi düzenleyin ve öğrencilerinizle paylaşın.",
            icon: BookMarked,
            link: "/dashboard/academy/courses",
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600"
        }
    ];

    const recentActivities = [
        {
            title: "Son Eklenen Öğrenci",
            value: "Bugün 2 yeni öğrenci",
            icon: Users,
            time: "2 saat önce"
        },
        {
            title: "Tamamlanan Ödevler",
            value: "5 ödev tamamlandı",
            icon: FileText,
            time: "4 saat önce"
        },
        {
            title: "Yeni Kurs",
            value: "TYT Matematik eklendi",
            icon: BookOpen,
            time: "1 gün önce"
        }
    ];

    return (
        <div className="flex-1 p-8 overflow-y-auto space-y-8 custom-scrollbar bg-gradient-to-br from-gray-50 via-white to-gray-50/50 min-h-full">
            {/* Hoşgeldiniz Bölümü */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Merhaba, {user?.name?.split(' ')[0] || 'Öğretmenim'}!
                        <span className="animate-bounce">👋</span>
                    </h1>
                    <p className="text-gray-500 font-medium text-lg">
                        Testoloji ile bugün öğrencilerinize neler hazırlayacaksınız?
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => router.push("/dashboard/academy/analytics")}
                        variant="outline"
                        className="h-12 px-6 rounded-xl font-bold border-gray-200 hover:bg-white"
                    >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analizler
                    </Button>
                    <Button
                        onClick={() => router.push("/dashboard/projects")}
                        className={cn("shadow-xl h-12 px-8 font-black text-base transition-all hover:scale-105 active:scale-95 group rounded-xl text-white", colors.buttonBg, colors.buttonHover, colors.shadow)}
                    >
                        <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                        Yeni Test Oluştur
                    </Button>
                </div>
            </div>

            {/* İstatistikler Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {isLoading ? (
                    [1, 2, 3, 4].map((i) => (
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
                                        <TrendingUp className="w-3 h-3" />
                                        AKTİF
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
                    <h3 className="text-2xl font-black text-gray-900">Hızlı İşlemler</h3>
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

            {/* Alt Bölüm: Son Aktiviteler & Hesap Özeti */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Son Aktiviteler */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-2xl font-black text-gray-900">Son Aktiviteler</h3>
                    <div className="space-y-3">
                        {recentActivities.map((activity, idx) => (
                            <Card key={idx} className="border-gray-100 shadow-sm hover:shadow-md transition-all rounded-xl">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors.iconBg)}>
                                        <activity.icon className={cn("w-5 h-5", colors.text)} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 text-sm">{activity.title}</h4>
                                        <p className="text-xs text-gray-500">{activity.value}</p>
                                    </div>
                                    <div className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {activity.time}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        className="w-full rounded-xl font-bold border-gray-200 hover:bg-white"
                        onClick={() => router.push("/dashboard/academy/analytics")}
                    >
                        Tüm Aktiviteleri Gör
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>

                {/* Hesap Özeti */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-black text-gray-900">Hesap Özeti</h3>
                    <Card className="border-none bg-gray-900 rounded-2xl overflow-hidden relative shadow-xl">
                        <div className={cn("absolute top-0 right-0 w-48 h-48 blur-[80px] opacity-20 -mr-20 -mt-20 rounded-full", colors.gradient)}></div>
                        <CardHeader className="p-6 pb-0 relative z-10">
                            <Badge className={cn("w-fit text-white border-0 font-black text-[10px] px-3 py-1 rounded-full mb-4", colors.buttonBg, `hover:${colors.buttonBg}`)}>
                                {user?.tier || "BRONZ"} PAKET
                            </Badge>
                            <CardTitle className="text-white text-2xl font-black">Testoloji Plus</CardTitle>
                            <CardDescription className="text-gray-400 font-medium mt-2">
                                Paket limitleriniz ve aktif özellikleriniz burada gösterilir.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-4 relative z-10">
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400 font-bold tracking-tight">Proje Limiti</span>
                                    <span className="text-white font-black">{stats?.totalProjects ?? 0} / Sınırsız</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className={cn("h-full rounded-full", colors.buttonBg)} style={{ width: '30%' }}></div>
                                </div>
                            </div>
                            <Button className="w-full h-11 rounded-xl bg-white text-gray-900 hover:bg-gray-100 font-black tracking-tight transition-all active:scale-95">
                                Paketi Yükselt
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
