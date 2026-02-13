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
    ChevronLeft,
    TrendingUp,
    ArrowRight,
    ArrowUpRight,
    Clock,
    Target,
    Award,
    BarChart3,
    BookMarked,
    CalendarDays,
    FileText,
    GraduationCap,
    Flame,
    Star,
    Zap
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeacherAnalytics } from "@/hooks/use-analytics";
import { cn } from "@/lib/utils";
import { useThemeColors } from "@/contexts/ThemeContext";
import { ROLE_PROJECT_LIMITS } from "@/config/limits";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function TeacherDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const { data: stats, isLoading } = useTeacherStats();
    const { data: teacherAnalytics, isLoading: analyticsLoading } = useTeacherAnalytics();
    const colors = useThemeColors();
    const hasCoaching = user?.hasCoachingAccess;

    // Student list pagination
    const [studentPage, setStudentPage] = useState(1);
    const studentsPerPage = 5;

    // Greeting based on time
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Günaydın" : hour < 18 ? "İyi günler" : "İyi akşamlar";

    const statCards = [
        {
            title: "Toplam Proje",
            value: stats?.totalProjects ?? 0,
            icon: FolderOpen,
            description: "Oluşturduğunuz testler",
            link: "/dashboard/projects",
            color: "text-orange-500",
            bg: "bg-orange-50"
        },
        ...(hasCoaching ? [
            {
                title: "Aktif Öğrenciler",
                value: stats?.totalStudents ?? 0,
                icon: Users,
                description: "Sınıfınızdaki öğrenciler",
                link: "/dashboard/academy/students",
                color: "text-blue-500",
                bg: "bg-blue-50"
            },
            {
                title: "Sistem Kursları",
                value: stats?.totalCourses ?? 0,
                icon: BookOpen,
                description: "Yayınladığınız kurslar",
                link: "/dashboard/academy/courses",
                color: "text-emerald-500",
                bg: "bg-emerald-50"
            },
            {
                title: "Bekleyen Ödevler",
                value: stats?.totalAssignments ?? 0,
                icon: Calendar,
                description: "Kontrol edilecekler",
                link: "/dashboard/academy/assignments",
                color: "text-purple-500",
                bg: "bg-purple-50"
            }
        ] : [])
    ];

    const quickActions = [
        {
            title: "Soru Bankası",
            description: "PDF üzerinden soruları saniyeler içinde kırpın ve sınıflarınıza ödev olarak atayın.",
            icon: Sparkles,
            link: "/dashboard/projects",
            gradient: true
        },
        ...(hasCoaching ? [
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
        ] : [])
    ];

    const recentActivities = hasCoaching ? [
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
    ] : [];

    // Sorted student data (by avgGrade desc)
    const sortedStudents = teacherAnalytics?.studentData
        ? [...teacherAnalytics.studentData].sort((a, b) => b.avgGrade - a.avgGrade)
        : [];

    return (
        <div className="flex-1 p-8 overflow-y-auto space-y-8 custom-scrollbar bg-linear-to-br from-gray-50 via-white to-gray-50/50 min-h-full">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm p-8 md:p-10">
                <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-br from-orange-100 to-orange-50 rounded-full -mr-40 -mt-40 opacity-40" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-linear-to-tr from-indigo-100 to-indigo-50 rounded-full -ml-30 -mb-30 opacity-30" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{greeting}</p>
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                            {user?.name?.split(' ')[0] || 'Öğretmenim'} Öğretmenim <span className="inline-block animate-bounce">👋</span>
                        </h1>
                        <p className="text-gray-500 font-medium text-base max-w-lg">
                            Testoloji ile bugün öğrencilerinize neler hazırlayacaksınız?
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {hasCoaching && (
                            <Button
                                onClick={() => router.push("/dashboard/academy/analytics")}
                                variant="outline"
                                className="cursor-pointer h-12 px-6 rounded-xl font-bold border-gray-200 hover:bg-white"
                            >
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Analizler
                            </Button>
                        )}
                        <Button
                            onClick={() => router.push("/dashboard/projects")}
                            className={cn("cursor-pointer shadow-xl h-12 px-8 font-black text-base transition-all hover:scale-105 active:scale-95 group rounded-xl text-white", colors.buttonBg, colors.buttonHover, colors.shadow)}
                        >
                            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                            Yeni Test Oluştur
                        </Button>
                    </div>
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
                                    <div className={cn("p-3 rounded-xl transition-colors duration-300", card.bg)}>
                                        <card.icon className={cn("w-6 h-6", card.color)} />
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

            {/* Conditional Layout based on Coaching Access */}
            {hasCoaching ? (
                <>
                    {/* Hızlı İşlemler - Full Width for Coaching Users */}
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
                                            ? cn("bg-linear-to-br text-white", colors.gradient, colors.shadow)
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
                                className="cursor-pointer w-full rounded-xl font-bold border-gray-200 hover:bg-white"
                                onClick={() => router.push("/dashboard/academy/analytics")}
                            >
                                Tüm Aktiviteleri Gör
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>

                        {/* Hesap Özeti */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-black text-gray-900">Hesap Özeti</h3>
                            <div className="h-full">
                                <AccountSummaryCard user={user} stats={stats} colors={colors} />
                            </div>
                        </div>
                    </div>

                    {/* Öğrenci Performans Tablosu */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-indigo-500" />
                                <h3 className="text-lg font-black text-slate-900">Öğrenci Performans Özeti</h3>
                            </div>
                            <Link href="/dashboard/academy/analytics" className="text-[11px] font-bold text-orange-500 hover:text-orange-600 uppercase tracking-wider flex items-center gap-1 group">
                                Tüm Analiz
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {analyticsLoading ? (
                            <Skeleton className="h-48 rounded-2xl" />
                        ) : !teacherAnalytics || sortedStudents.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-slate-300" />
                                </div>
                                <h4 className="font-black text-slate-900 mb-1">Henüz öğrenci verisi yok</h4>
                                <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto">Öğrencileriniz sınav çözdükçe performans verileri burada görünecek.</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                {/* Sınıf Ortalaması Mini Header */}
                                <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                                <BarChart3 className="w-4 h-4 text-indigo-600" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sınıf Ortalaması</span>
                                                <p className="text-xl font-black text-indigo-600 leading-none">%{teacherAnalytics.averageClassGrade}</p>
                                            </div>
                                        </div>
                                        <div className="hidden sm:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
                                            <Users className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm font-bold text-slate-600">{teacherAnalytics.totalStudents} öğrenci</span>
                                        </div>
                                    </div>
                                    <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 font-black text-[9px] uppercase tracking-widest">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        Yükselişte
                                    </Badge>
                                </div>

                                {/* Desktop Table */}
                                <div className="hidden md:block">
                                    <Table>
                                        <TableHeader className="bg-slate-50/30">
                                            <TableRow className="hover:bg-transparent border-slate-100">
                                                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 pl-6 h-12 w-12">#</TableHead>
                                                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Öğrenci</TableHead>
                                                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 text-center">Kayıt</TableHead>
                                                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 text-center">D / Y</TableHead>
                                                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 text-center">Ort. Net</TableHead>
                                                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 text-center">Başarı</TableHead>
                                                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 text-right pr-6">İşlem</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sortedStudents.slice((studentPage - 1) * studentsPerPage, studentPage * studentsPerPage).map((student, idx) => {
                                                const rank = (studentPage - 1) * studentsPerPage + idx + 1;
                                                const isTop3 = rank <= 3;
                                                return (
                                                    <TableRow
                                                        key={student.id}
                                                        className="hover:bg-slate-50/50 transition-all group cursor-pointer border-slate-50"
                                                        onClick={() => router.push(`/dashboard/academy/students/${student.id}`)}
                                                    >
                                                        <TableCell className="pl-6 py-3">
                                                            {isTop3 ? (
                                                                <div className={cn(
                                                                    "w-7 h-7 rounded-full flex items-center justify-center font-black text-xs",
                                                                    rank === 1 ? "bg-amber-100 text-amber-700" :
                                                                        rank === 2 ? "bg-slate-100 text-slate-600" :
                                                                            "bg-orange-50 text-orange-600"
                                                                )}>
                                                                    {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs font-bold text-slate-400 pl-2">{rank}</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center font-black text-sm text-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition-all border border-slate-100">
                                                                    {student.name.charAt(0)}
                                                                </div>
                                                                <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">{student.name}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <span className="text-xs font-medium text-slate-500">{student.enrollmentCount} kurs</span>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <span className="text-xs font-black text-emerald-600">{student.totalCorrect}</span>
                                                                <span className="text-slate-300">/</span>
                                                                <span className="text-xs font-black text-rose-500">{student.totalWrong}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <span className="text-xs font-black text-indigo-600 font-mono">{student.avgNet}</span>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div className={cn(
                                                                "inline-flex px-2.5 py-1 rounded-lg shadow-sm",
                                                                student.avgGrade >= 80 ? "bg-emerald-600 text-white" :
                                                                    student.avgGrade >= 60 ? "bg-slate-900 text-white" :
                                                                        student.avgGrade >= 40 ? "bg-amber-500 text-white" :
                                                                            "bg-rose-500 text-white"
                                                            )}>
                                                                <span className="text-xs font-black">%{student.avgGrade}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right pr-6">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="cursor-pointer font-bold text-[10px] uppercase text-indigo-600 hover:bg-indigo-50 rounded-lg px-2 h-7"
                                                            >
                                                                İncele
                                                                <ArrowRight className="w-3 h-3 ml-1" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="md:hidden divide-y divide-slate-100">
                                    {sortedStudents.slice((studentPage - 1) * studentsPerPage, studentPage * studentsPerPage).map((student, idx) => {
                                        const rank = (studentPage - 1) * studentsPerPage + idx + 1;
                                        return (
                                            <div
                                                key={student.id}
                                                className="p-4 active:bg-slate-50 transition-colors cursor-pointer"
                                                onClick={() => router.push(`/dashboard/academy/students/${student.id}`)}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center font-black text-sm text-slate-700 border border-slate-100 shrink-0">
                                                            {rank <= 3 ? (rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉") : student.name.charAt(0)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-sm text-slate-900 truncate">{student.name}</p>
                                                            <p className="text-[10px] font-medium text-slate-400">{student.enrollmentCount} kurs kayıt</p>
                                                        </div>
                                                    </div>
                                                    <div className={cn(
                                                        "inline-flex px-2 py-0.5 rounded-lg shrink-0",
                                                        student.avgGrade >= 80 ? "bg-emerald-600 text-white" :
                                                            student.avgGrade >= 60 ? "bg-slate-900 text-white" :
                                                                "bg-amber-500 text-white"
                                                    )}>
                                                        <span className="text-xs font-black">%{student.avgGrade}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 pl-11">
                                                    <span className="text-[10px] font-bold"><span className="text-emerald-600">{student.totalCorrect}D</span></span>
                                                    <span className="text-[10px] font-bold"><span className="text-rose-500">{student.totalWrong}Y</span></span>
                                                    <span className="text-[10px] font-bold"><span className="text-indigo-600">Net: {student.avgNet}</span></span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Pagination */}
                                {sortedStudents.length > studentsPerPage && (
                                    <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                        <p className="text-[10px] font-bold text-slate-400">
                                            {(studentPage - 1) * studentsPerPage + 1}-{Math.min(studentPage * studentsPerPage, sortedStudents.length)} / {sortedStudents.length}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={studentPage === 1}
                                                onClick={() => setStudentPage(prev => prev - 1)}
                                                className="cursor-pointer h-7 w-7 p-0 rounded-lg border-slate-200 disabled:opacity-30"
                                            >
                                                <ChevronLeft className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={studentPage >= Math.ceil(sortedStudents.length / studentsPerPage)}
                                                onClick={() => setStudentPage(prev => prev + 1)}
                                                className="cursor-pointer h-7 w-7 p-0 rounded-lg border-slate-200 disabled:opacity-30"
                                            >
                                                <ChevronRight className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Hızlı İşlemler - Compact for Non-Coaching */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-gray-900">Hızlı İşlemler</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-5">
                            {quickActions.map((action, idx) => (
                                <Link key={idx} href={action.link} className="group">
                                    <div className={cn(
                                        "p-6 rounded-2xl shadow-lg group-hover:scale-[1.02] transition-all relative overflow-hidden h-full",
                                        action.gradient
                                            ? cn("bg-linear-to-br text-white", colors.gradient, colors.shadow)
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

                    {/* Hesap Özeti - Side by Side */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black text-gray-900">Hesap Özeti</h3>
                        <AccountSummaryCard user={user} stats={stats} colors={colors} />
                    </div>
                </div>
            )}
        </div>
    );
}

const AccountSummaryCard = ({ user, stats, colors }: { user: any, stats: any, colors: any }) => {
    return (
        <Card className="border-none bg-gray-900 rounded-2xl overflow-hidden relative shadow-xl h-full min-h-[500px]">
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
                        <span className="text-white font-black">{stats?.totalProjects ?? 0} / {ROLE_PROJECT_LIMITS.TEACHER}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", colors.buttonBg)} style={{ width: '30%' }}></div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="text-gray-400 text-xs font-bold mb-1">Soru Hakkı</div>
                        <div className="text-white font-black text-lg">Sınırsız</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="text-gray-400 text-xs font-bold mb-1">Yapay Zeka</div>
                        <div className="text-white font-black text-lg">Aktif</div>
                    </div>
                </div>
                <Button className="w-full h-11 rounded-xl bg-white text-gray-900 hover:bg-gray-100 font-black tracking-tight transition-all active:scale-95">
                    Paketi Yükselt
                </Button>
            </CardContent>
        </Card>
    );
};
