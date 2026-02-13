"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useStudentStats } from "@/hooks/use-users";
import { useAssignments } from "@/hooks/use-assignments";
import { useStudentAnalytics, useAiAnalysis } from "@/hooks/use-analytics";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    BookOpen,
    CalendarDays,
    CheckCircle,
    Star,
    Sparkles,
    Clock,
    Target,
    BookMarked,
    FileText,
    BarChart3,
    Zap,
    TrendingUp,
    Award,
    Flame,
    ChevronRight,
    ChevronLeft,
    Play,
    GraduationCap,
    ListChecks,
    ExternalLink,
    Calendar,
    Bot,
    CheckCircle2,
    XCircle,
    Info,
    Lightbulb
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useThemeColors } from "@/contexts/ThemeContext";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { AiAnalysisModal } from "@/components/analytics/AiAnalysisModal";

export default function StudentDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const { data: stats, isLoading } = useStudentStats();
    const { data: assignments, isLoading: assignmentsLoading } = useAssignments();
    const { data: analytics, isLoading: analyticsLoading } = useStudentAnalytics();
    const colors = useThemeColors();

    const upcomingAssignments = assignments?.filter((a: any) => a.status === 'PENDING').slice(0, 4) || [];
    const completedAssignments = assignments?.filter((a: any) => a.status === 'COMPLETED').slice(0, 3) || [];
    const completionPercentage = Math.min(((stats?.completed ?? 0) / Math.max((stats?.pending ?? 0) + (stats?.completed ?? 0), 1)) * 100, 100);

    // Exam results state
    const [selectedExam, setSelectedExam] = useState<any>(null);
    const [examPage, setExamPage] = useState(1);
    const examItemsPerPage = 5;

    // AI Analysis state
    const [aiAnalysisModal, setAiAnalysisModal] = useState(false);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
    const [aiAnalysisTitle, setAiAnalysisTitle] = useState("");
    const { data: aiAnalysisContent, isLoading: aiAnalysisLoading } = useAiAnalysis(
        aiAnalysisModal ? selectedAssignmentId : null
    );
    const openAiAnalysis = (assignmentId: string, title: string) => {
        setSelectedAssignmentId(assignmentId);
        setAiAnalysisTitle(title);
        setAiAnalysisModal(true);
    };

    // Greeting based on time
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Günaydın" : hour < 18 ? "İyi günler" : "İyi akşamlar";

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 min-h-full">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-white border-b border-slate-100">
                {/* Decorative Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
                    <div className="absolute top-10 left-1/3 w-64 h-64 bg-blue-500/3 rounded-full blur-3xl" />
                </div>

                <div className="relative px-6 md:px-10 pt-8 pb-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Öğrenci Paneli</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                {greeting}, <span className="bg-linear-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">{user?.name?.split(' ')[0] || 'Öğrenci'}</span>! 👋
                            </h1>
                            <p className="text-slate-500 font-medium text-base max-w-lg">
                                Bugün kendini geliştirmek için harika bir gün. Hadi başlayalım!
                            </p>
                        </div>
                        <div className="flex gap-3 w-full lg:w-auto">
                            <Button
                                onClick={() => router.push("/dashboard/student/analytics")}
                                variant="outline"
                                className="cursor-pointer h-12 px-5 rounded-xl font-bold border-slate-200 hover:bg-slate-50 text-slate-700 flex-1 lg:flex-none"
                            >
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Performansım
                            </Button>
                            <Button
                                onClick={() => router.push("/dashboard/student/assignments")}
                                className={cn("cursor-pointer shadow-lg h-12 px-6 font-black text-sm transition-all hover:scale-105 active:scale-95 group rounded-xl text-white flex-1 lg:flex-none", colors.buttonBg, colors.buttonHover, colors.shadow)}
                            >
                                Ödevlerime Git
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 md:px-10 py-8 space-y-8">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {isLoading ? (
                        [1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-28 rounded-2xl" />
                        ))
                    ) : (
                        <>
                            {/* Bekleyen Ödevler */}
                            <div
                                className="bg-white rounded-2xl border border-slate-100 p-5 cursor-pointer group hover:shadow-lg hover:border-orange-100 transition-all duration-300"
                                onClick={() => router.push("/dashboard/student/assignments")}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                                        <Clock className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                                </div>
                                <p className="text-2xl font-black text-slate-900">{stats?.pending ?? 0}</p>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Bekleyen Ödev</p>
                            </div>

                            {/* Kayıtlı Kurslar */}
                            <div
                                className="bg-white rounded-2xl border border-slate-100 p-5 cursor-pointer group hover:shadow-lg hover:border-blue-100 transition-all duration-300"
                                onClick={() => router.push("/dashboard/student/library")}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                        <BookOpen className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                </div>
                                <p className="text-2xl font-black text-slate-900">{stats?.courses ?? 0}</p>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Kayıtlı Kurs</p>
                            </div>

                            {/* Tamamlanan */}
                            <div
                                className="bg-white rounded-2xl border border-slate-100 p-5 cursor-pointer group hover:shadow-lg hover:border-emerald-100 transition-all duration-300"
                                onClick={() => router.push("/dashboard/student/assignments")}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                                </div>
                                <p className="text-2xl font-black text-slate-900">{stats?.completed ?? 0}</p>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Tamamlanan</p>
                            </div>

                            {/* Başarı Oranı */}
                            <div className="bg-white rounded-2xl border border-slate-100 p-5 group hover:shadow-lg hover:border-purple-100 transition-all duration-300">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                        <Target className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <div className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                                        <TrendingUp className="w-3 h-3 inline mr-0.5" />
                                        İyi
                                    </div>
                                </div>
                                <p className="text-2xl font-black text-slate-900">{completionPercentage.toFixed(0)}%</p>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Başarı Oranı</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Quick Actions Strip */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-orange-500" />
                        <h3 className="text-lg font-black text-slate-900">Hızlı Erişim</h3>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <Link href="/dashboard/student/assignments" className="group">
                            <div className={cn("relative overflow-hidden rounded-2xl p-5 h-full transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl", "bg-linear-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20")}>
                                <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-white/10 rounded-full blur-md" />
                                <div className="absolute top-3 right-3 w-8 h-8 bg-white/10 rounded-full blur-sm" />
                                <div className="relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-black text-sm mb-1">Ödev Takibi</h4>
                                    <p className="text-[11px] text-white/70 leading-relaxed font-medium">Testleri çöz, bildirim al</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/dashboard/student/schedule" className="group">
                            <div className="relative overflow-hidden rounded-2xl p-5 bg-white border border-slate-100 h-full transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg group-hover:border-purple-200">
                                <div className="relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3 group-hover:bg-purple-100 transition-colors">
                                        <CalendarDays className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <h4 className="font-black text-sm text-slate-900 mb-1">Çalışma Takvimi</h4>
                                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Haftalık programını gör</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/dashboard/student/library" className="group">
                            <div className="relative overflow-hidden rounded-2xl p-5 bg-white border border-slate-100 h-full transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg group-hover:border-blue-200">
                                <div className="relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                                        <BookMarked className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h4 className="font-black text-sm text-slate-900 mb-1">Kurs Kütüphanesi</h4>
                                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Eğitim içeriklerine eriş</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/dashboard/student/analytics" className="group">
                            <div className="relative overflow-hidden rounded-2xl p-5 bg-white border border-slate-100 h-full transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg group-hover:border-emerald-200">
                                <div className="relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3 group-hover:bg-emerald-100 transition-colors">
                                        <BarChart3 className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <h4 className="font-black text-sm text-slate-900 mb-1">Performans</h4>
                                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Gelişimini takip et</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Main Content: 2-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Left Column: Assignments */}
                    <div className="lg:col-span-3 space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ListChecks className="w-5 h-5 text-slate-400" />
                                <h3 className="text-lg font-black text-slate-900">Yaklaşan Ödevler</h3>
                            </div>
                            <Link href="/dashboard/student/assignments" className="text-[11px] font-bold text-orange-500 hover:text-orange-600 uppercase tracking-wider flex items-center gap-1 group">
                                Tümünü Gör
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {assignmentsLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
                            </div>
                        ) : upcomingAssignments.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-slate-300" />
                                </div>
                                <h4 className="font-black text-slate-900 mb-1">Henüz ödev atanmadı</h4>
                                <p className="text-sm text-slate-400 font-medium mb-5 max-w-xs mx-auto">Öğretmenin yeni bir ödev atadığında burada görünecektir.</p>
                                <Button
                                    variant="outline"
                                    className="cursor-pointer rounded-xl font-bold border-slate-200 hover:bg-white text-slate-600"
                                    onClick={() => router.push("/dashboard/student/assignments")}
                                >
                                    Ödevler Sayfasına Git
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {upcomingAssignments.map((assignment: any) => (
                                    <div
                                        key={assignment.id}
                                        className="bg-white rounded-xl border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all duration-300 cursor-pointer group"
                                        onClick={() => router.push(
                                            assignment.type === 'TEST'
                                                ? `/dashboard/student/exam/${assignment.id}`
                                                : '/dashboard/student/assignments'
                                        )}
                                    >
                                        <div className="p-4 flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 group-hover:bg-orange-100 transition-colors">
                                                <FileText className="w-5 h-5 text-orange-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm text-slate-900 truncate">{assignment.title}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                                                        <CalendarDays className="w-3 h-3" />
                                                        {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }) : 'Süresiz'}
                                                    </span>
                                                    {assignment.type && (
                                                        <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full uppercase">{assignment.type}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="sm" className="cursor-pointer font-bold text-xs text-orange-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg h-9 px-3 group-hover:bg-orange-50">
                                                    Çöz <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Son Tamamlananlar */}
                        {completedAssignments.length > 0 && (
                            <div className="space-y-3 mt-6">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    <h4 className="text-sm font-bold text-slate-500">Son Tamamlananlar</h4>
                                </div>
                                {completedAssignments.map((assignment: any) => (
                                    <div key={assignment.id} className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-700 truncate">{assignment.title}</p>
                                        </div>
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">Tamamlandı</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Progress & Motivation */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Progress Card */}
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h4 className="font-black text-slate-900 text-sm">Haftalık İlerleme</h4>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bu Hafta</span>
                                </div>

                                {/* Circular ish Progress */}
                                <div className="flex items-center gap-6 mb-5">
                                    <div className="relative w-20 h-20 shrink-0">
                                        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                                            <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="none" className="text-slate-100" />
                                            <circle
                                                cx="40" cy="40" r="34"
                                                stroke="currentColor" strokeWidth="6" fill="none"
                                                className="text-orange-500"
                                                strokeDasharray={`${2 * Math.PI * 34}`}
                                                strokeDashoffset={`${2 * Math.PI * 34 * (1 - completionPercentage / 100)}`}
                                                strokeLinecap="round"
                                                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-lg font-black text-slate-900">{completionPercentage.toFixed(0)}%</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-sm font-bold text-slate-900">{stats?.completed ?? 0} ödev tamamlandı</p>
                                        <p className="text-xs text-slate-400 font-medium">{stats?.pending ?? 0} ödev bekliyor</p>
                                    </div>
                                </div>

                                {/* Mini Stats */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-50 rounded-xl p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Kurs</span>
                                        </div>
                                        <p className="text-lg font-black text-slate-900">{stats?.courses ?? 0}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Award className="w-3.5 h-3.5 text-amber-500" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Puan</span>
                                        </div>
                                        <p className="text-lg font-black text-slate-900">{stats?.completed ?? 0 * 10}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Motivation Card */}
                        <div className={cn("rounded-2xl overflow-hidden relative", colors.bg)}>
                            <div className="p-6 relative z-10">
                                <div className={cn("w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4")}>
                                    <Flame className={cn("w-6 h-6", colors.text)} />
                                </div>
                                <h4 className="text-base font-black text-slate-900 mb-1">
                                    {completionPercentage >= 80 ? "Muhteşem Gidiyorsun! 🔥" :
                                        completionPercentage >= 50 ? "Harika İlerliyorsun! ⭐" :
                                            completionPercentage >= 20 ? "İyi Başlangıç! 💪" :
                                                "Haydi Başla! 🚀"}
                                </h4>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    {completionPercentage >= 80
                                        ? "Neredeyse tüm ödevlerini tamamladın. Böyle devam et!"
                                        : "Düzenli çalışma ile hedeflerine ulaşabilirsin. Her gün biraz daha ileri!"}
                                </p>
                            </div>
                        </div>

                        {/* Quick Link to Library */}
                        <Link href="/dashboard/student/library" className="block group">
                            <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors shrink-0">
                                    <Play className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-black text-sm text-slate-900">Kaldığın Yerden Devam Et</h4>
                                    <p className="text-[11px] text-slate-400 font-medium">Kurs kütüphanesine git</p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Sınav Sonuç Detayları */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-emerald-500" />
                            <h3 className="text-lg font-black text-slate-900">Son Sınav Sonuçları</h3>
                        </div>
                        <Link href="/dashboard/student/analytics" className="text-[11px] font-bold text-orange-500 hover:text-orange-600 uppercase tracking-wider flex items-center gap-1 group">
                            Tüm Analiz
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {analyticsLoading ? (
                        <Skeleton className="h-48 rounded-2xl" />
                    ) : !analytics || analytics.scoreHistory.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                                <Target className="w-8 h-8 text-slate-300" />
                            </div>
                            <h4 className="font-black text-slate-900 mb-1">Henüz sınav sonucu yok</h4>
                            <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto">İlk sınavını tamamladığında sonuçların burada görünecek.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            {/* Desktop Table */}
                            <div className="hidden md:block">
                                <Table>
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow className="hover:bg-transparent border-slate-100">
                                            <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 pl-6 h-12">Sınav Adı</TableHead>
                                            <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Tarih</TableHead>
                                            <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 text-center">D / Y / N</TableHead>
                                            <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 text-center">Başarı</TableHead>
                                            <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 text-right pr-6">İşlem</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {analytics.scoreHistory.slice((examPage - 1) * examItemsPerPage, examPage * examItemsPerPage).map((exam) => (
                                            <TableRow
                                                key={exam.id}
                                                className="hover:bg-slate-50/50 transition-all group cursor-pointer border-slate-50"
                                                onClick={() => setSelectedExam(exam)}
                                            >
                                                <TableCell className="pl-6 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all border border-slate-100">
                                                            <Calendar className="w-4 h-4" />
                                                        </div>
                                                        <span className="font-bold text-sm text-slate-900">{exam.title}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-[11px] font-medium text-slate-500">
                                                        {new Date(exam.date).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long' })}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span className="text-xs font-black text-emerald-600">{exam.correctCount}</span>
                                                        <span className="text-slate-300">/</span>
                                                        <span className="text-xs font-black text-rose-500">{exam.wrongCount}</span>
                                                        <span className="text-slate-300">/</span>
                                                        <span className="text-xs font-black text-indigo-600">{exam.netCount}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="inline-flex bg-slate-900 text-white px-2.5 py-1 rounded-lg shadow-sm">
                                                        <span className="text-xs font-black">%{exam.grade}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {exam.hasAiAnalysis && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    openAiAnalysis(exam.id, exam.title);
                                                                }}
                                                                className="cursor-pointer font-bold text-[10px] uppercase text-indigo-600 hover:bg-indigo-50 rounded-lg px-2 h-7"
                                                            >
                                                                <Bot className="w-3 h-3 mr-1" />
                                                                AI
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="cursor-pointer font-bold text-[10px] uppercase text-emerald-600 hover:bg-emerald-50 rounded-lg px-2 h-7"
                                                        >
                                                            Detay
                                                            <ArrowRight className="w-3 h-3 ml-1" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden divide-y divide-slate-100">
                                {analytics.scoreHistory.slice((examPage - 1) * examItemsPerPage, examPage * examItemsPerPage).map((exam) => (
                                    <div
                                        key={exam.id}
                                        className="p-4 active:bg-slate-50 transition-colors cursor-pointer"
                                        onClick={() => setSelectedExam(exam)}
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
                                                    <Calendar className="w-4 h-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-sm text-slate-900 truncate">{exam.title}</p>
                                                    <p className="text-[10px] font-medium text-slate-400">
                                                        {new Date(exam.date).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="inline-flex bg-slate-900 text-white px-2 py-0.5 rounded-lg shrink-0">
                                                <span className="text-xs font-black">%{exam.grade}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 pl-11">
                                            <span className="text-[10px] font-bold"><span className="text-emerald-600">{exam.correctCount}D</span></span>
                                            <span className="text-[10px] font-bold"><span className="text-rose-500">{exam.wrongCount}Y</span></span>
                                            <span className="text-[10px] font-bold"><span className="text-indigo-600">{exam.netCount}N</span></span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {analytics.scoreHistory.length > examItemsPerPage && (
                                <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                    <p className="text-[10px] font-bold text-slate-400">
                                        {(examPage - 1) * examItemsPerPage + 1}-{Math.min(examPage * examItemsPerPage, analytics.scoreHistory.length)} / {analytics.scoreHistory.length}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={examPage === 1}
                                            onClick={() => setExamPage(prev => prev - 1)}
                                            className="cursor-pointer h-7 w-7 p-0 rounded-lg border-slate-200 disabled:opacity-30"
                                        >
                                            <ChevronLeft className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={examPage >= Math.ceil(analytics.scoreHistory.length / examItemsPerPage)}
                                            onClick={() => setExamPage(prev => prev + 1)}
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
            </div>

            {/* Exam Detail Modal */}
            <Dialog open={!!selectedExam} onOpenChange={() => setSelectedExam(null)}>
                <DialogContent className="max-w-full sm:max-w-[80vw] lg:max-w-[1200px] h-screen sm:h-[92vh] flex flex-col p-0 overflow-hidden rounded-none sm:rounded-[2.5rem] border-none shadow-2xl bg-white">
                    <DialogHeader className="p-4 md:p-8 pb-4 md:pb-6 border-b border-slate-100 shrink-0 bg-white z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                        <BarChart3 className="w-6 h-6" />
                                    </div>
                                    <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight">{selectedExam?.title}</DialogTitle>
                                </div>
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] ml-13">Soru Bazlı Analiz ve Optik Raporu</p>
                            </div>
                            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                <div className="px-6 py-2 text-center border-r border-slate-200">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">DOĞRU</p>
                                    <p className="text-xl font-black text-emerald-600 leading-none">{selectedExam?.correctCount}</p>
                                </div>
                                <div className="px-6 py-2 text-center border-r border-slate-200">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">YANLIŞ</p>
                                    <p className="text-xl font-black text-rose-500 leading-none">{selectedExam?.wrongCount}</p>
                                </div>
                                <div className="px-6 py-2 text-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">NET</p>
                                    <p className="text-xl font-black text-indigo-600 leading-none">{selectedExam?.netCount}</p>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 custom-scrollbar">
                        <div className="grid grid-cols-1 gap-6">
                            {[...(selectedExam?.questions || [])].sort((a: any, b: any) => a.order - b.order).map((q: any, idx: number) => {
                                const isCorrect = q.studentAnswer === q.correctAnswer;
                                const choices = ['A', 'B', 'C', 'D', 'E'];
                                return (
                                    <div key={q.id} className="flex flex-col lg:flex-row gap-8 bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200/60 hover:shadow-xl transition-all group relative overflow-hidden">
                                        <div className={cn(
                                            "absolute top-0 left-0 w-1.5 h-full transition-colors",
                                            !q.studentAnswer ? "bg-amber-400" : (isCorrect ? "bg-emerald-500" : "bg-rose-500")
                                        )} />
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Badge className="bg-slate-900 text-white font-black px-3 py-1 rounded-full text-[10px]">SORU {idx + 1}</Badge>
                                                {!q.studentAnswer ? (
                                                    <span className="text-amber-600 font-bold text-[11px] bg-amber-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                                                        <Info className="w-3.5 h-3.5" /> Boş
                                                    </span>
                                                ) : isCorrect ? (
                                                    <span className="text-emerald-600 font-bold text-[11px] bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Doğru
                                                    </span>
                                                ) : (
                                                    <span className="text-rose-500 font-bold text-[11px] bg-rose-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                                                        <XCircle className="w-3.5 h-3.5" /> Hatalı
                                                    </span>
                                                )}
                                            </div>
                                            <div className="relative aspect-video max-h-[250px] w-full rounded-xl overflow-hidden border border-slate-100 bg-white">
                                                <Image src={q.imageUrl} alt={`Soru ${idx + 1}`} fill className="object-contain p-3 group-hover:scale-105 transition-transform" />
                                            </div>
                                        </div>
                                        <div className="lg:w-72 shrink-0 space-y-4">
                                            <div className="bg-slate-50 rounded-[1.8rem] p-5 border border-slate-200">
                                                <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Optik Rapor</h5>
                                                <div className="flex items-center justify-between gap-1 mb-4">
                                                    {choices.map(choice => {
                                                        const isStudentChoice = q.studentAnswer === choice;
                                                        const isCorrectChoice = q.correctAnswer === choice;
                                                        return (
                                                            <div key={choice} className={cn(
                                                                "w-9 h-9 rounded-full flex items-center justify-center font-black text-xs transition-all border-2",
                                                                isStudentChoice && isCorrectChoice ? "bg-emerald-500 border-emerald-500 text-white shadow-md scale-105" :
                                                                    isStudentChoice && !isCorrectChoice ? "bg-rose-500 border-rose-500 text-white shadow-md scale-105" :
                                                                        !isStudentChoice && isCorrectChoice ? "bg-white border-emerald-500 text-emerald-600" :
                                                                            "bg-white border-slate-200 text-slate-400"
                                                            )}>{choice}</div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                                    <div className="flex justify-between items-center text-[10px] font-bold">
                                                        <span className="text-slate-400">CEVABIN:</span>
                                                        <span className={cn("px-1.5 py-0.5 rounded", isCorrect ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50")}>
                                                            {q.studentAnswer || 'BOŞ'}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-[10px] font-bold border-t border-slate-50 pt-1">
                                                        <span className="text-slate-400">DOĞRU:</span>
                                                        <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{q.correctAnswer}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-5 rounded-[1.8rem] bg-slate-900 text-white relative overflow-hidden shadow-lg">
                                                <Lightbulb className="absolute -bottom-3 -right-3 w-20 h-20 opacity-10" />
                                                <div className="relative z-10">
                                                    <h5 className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1.5">YAPAY ZEKA ANALİZİ</h5>
                                                    <p className="text-[10px] font-bold italic leading-relaxed text-slate-300">
                                                        {!q.studentAnswer ? "Boş bıraktığın sorular birikmesin." : isCorrect ? "Konu mantığını çok iyi kavramışsın!" : "Hatalı soruyu tekrar çözmeyi dene."}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* AI Analysis Modal */}
            <AiAnalysisModal
                open={aiAnalysisModal}
                onOpenChange={setAiAnalysisModal}
                title={aiAnalysisTitle}
                content={aiAnalysisContent ?? null}
                loading={aiAnalysisLoading}
            />
        </div>
    );
}
