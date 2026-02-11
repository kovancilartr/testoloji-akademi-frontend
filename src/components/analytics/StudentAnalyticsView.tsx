"use client";

import { useStudentAnalytics } from "@/hooks/use-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    TrendingUp,
    BookOpen,
    Target,
    Lightbulb,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Info,
    Calendar,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    ArrowRight
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import Image from "next/image";

interface StudentAnalyticsViewProps {
    studentId?: string;
}

export function StudentAnalyticsView({ studentId }: StudentAnalyticsViewProps) {
    const { data: analytics, isLoading } = useStudentAnalytics(studentId);
    const [selectedExam, setSelectedExam] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    if (isLoading) return <div className="h-40 flex items-center justify-center font-bold text-slate-400 animate-pulse">Analiz verileri yükleniyor...</div>;
    if (!analytics) return <div className="p-8 text-center text-slate-400">Analiz verisi bulunamadı.</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-16 h-16" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-indigo-100 text-xs font-black uppercase tracking-widest">Başarı Ortalaması</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-black italic">%{analytics.avgScore}</div>
                        <p className="text-indigo-200 text-[10px] mt-2 font-bold uppercase tracking-tight">Toplam {analytics.totalExams} sınav üzerinden</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-white overflow-hidden relative">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-slate-400 text-xs font-black uppercase tracking-widest">Toplam İçerik Tamamlama</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {analytics.courseProgress.length > 0 ? (
                            <div className="space-y-4">
                                <div className="text-4xl font-black text-slate-900 leading-none">
                                    %{Math.round(analytics.courseProgress.reduce((acc, c) => acc + c.percent, 0) / analytics.courseProgress.length)}
                                </div>
                                <div className="space-y-2">
                                    <Progress value={analytics.courseProgress[0].percent} className="h-2 bg-slate-100" />
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight line-clamp-1">
                                        Son Çalışılan: {analytics.courseProgress[0].title}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm font-medium">Henüz bir kursa kayıt olunmamış.</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-white overflow-hidden relative">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-slate-400 text-xs font-black uppercase tracking-widest">Sınav Gelişimi</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="h-24 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics.scoreHistory}>
                                    <defs>
                                        <linearGradient id="colorGrade" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="grade" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorGrade)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Progress Chart */}
                <Card className="lg:col-span-2 border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
                    <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between space-y-0 text-slate-900">
                        <div>
                            <CardTitle className="text-xl font-black tracking-tight">Sınav Analiz Grafiği</CardTitle>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Son sınavlar ve başarı grafiği</p>
                        </div>
                        <BarChart3 className="w-6 h-6 text-orange-500" />
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analytics.scoreHistory}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                        tickFormatter={(val: string) => new Date(val).toLocaleDateString("tr-TR", { day: 'numeric', month: 'short' })}
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                                        labelStyle={{ fontWeight: 900, marginBottom: '4px', fontSize: '12px' }}
                                        itemStyle={{ fontWeight: 700, fontSize: '11px', color: '#f97316' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="grade"
                                        name="Başarı %"
                                        stroke="#f97316"
                                        strokeWidth={4}
                                        dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                        animationDuration={2000}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="netCount"
                                        name="Net Skoru"
                                        stroke="#4f46e5"
                                        strokeWidth={4}
                                        dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                        animationDuration={2000}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* AI Suggestions & Insights */}
                <div className="space-y-6">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 px-2">
                        <Lightbulb className="w-6 h-6 text-yellow-500" />
                        AI Önerileri & Analiz
                    </h3>

                    <div className="space-y-4">
                        {analytics.suggestions.map((suggestion, idx) => (
                            <Card key={idx} className={cn(
                                "border-none shadow-lg transition-all hover:scale-[1.02]",
                                suggestion.type === 'SUCCESS' ? "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-100" :
                                    suggestion.type === 'WARNING' ? "bg-orange-50 text-orange-900 ring-1 ring-orange-100" :
                                        "bg-blue-50 text-blue-900 ring-1 ring-blue-100"
                            )}>
                                <CardContent className="p-5 flex gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                        suggestion.type === 'SUCCESS' ? "bg-emerald-500 text-white" :
                                            suggestion.type === 'WARNING' ? "bg-orange-500 text-white" :
                                                "bg-blue-500 text-white"
                                    )}>
                                        {suggestion.type === 'SUCCESS' ? <CheckCircle2 className="w-5 h-5" /> :
                                            suggestion.type === 'WARNING' ? <AlertTriangle className="w-5 h-5" /> :
                                                <Info className="w-5 h-5" />}
                                    </div>
                                    <div className="space-y-1">
                                        <Badge variant="outline" className={cn(
                                            "text-[9px] font-black uppercase tracking-widest border-none px-0",
                                            suggestion.type === 'SUCCESS' ? "text-emerald-600" :
                                                suggestion.type === 'WARNING' ? "text-orange-600" :
                                                    "text-blue-600"
                                        )}>
                                            {suggestion.target}
                                        </Badge>
                                        <p className="text-sm font-bold leading-snug">{suggestion.message}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="border-none shadow-2xl bg-slate-900 text-white rounded-3xl overflow-hidden p-6 relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Gelişim Notu</h4>
                        <p className="text-sm font-medium text-slate-300 italic leading-relaxed">
                            "İstikrarlı çalışma başarının anahtarıdır. Son {analytics.totalExams} sınavındaki performansın, hedeflediğin başarıya adım adım yaklaştığını gösteriyor."
                        </p>
                    </Card>
                </div>
            </div>

            {/* Course Progress Breakdown */}
            <div className="space-y-6">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 px-2">
                    <BookOpen className="w-6 h-6 text-indigo-500" />
                    Kurs Bazlı İlerleme
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {analytics.courseProgress.map(course => (
                        <Card key={course.id} className="border-none shadow-xl bg-white rounded-2xl p-6 group hover:ring-2 hover:ring-indigo-100 transition-all">
                            <div className="space-y-4">
                                <h4 className="font-black text-slate-900 text-sm line-clamp-1">{course.title}</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-2xl font-black text-indigo-600">%{course.percent}</span>
                                        <span className="text-[10px] text-slate-400 font-bold">{course.completed}/{course.total} Ders</span>
                                    </div>
                                    <Progress value={course.percent} className="h-2 bg-slate-50" color="#4f46e5" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Exam Details List */}
            <div className="space-y-6">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 px-2">
                    <Target className="w-6 h-6 text-emerald-500" />
                    Sınav Sonuç Detayları
                </h3>
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-100">
                                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 pl-8 h-14">Sınav / Deneme Adı</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Tarih</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 text-center">D / Y / N</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 text-center">Başarı</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 text-right pr-8">İşlem</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {analytics.scoreHistory.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                        Henüz bir sınav sonucu bulunmuyor.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                analytics.scoreHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((exam) => (
                                    <TableRow
                                        key={exam.id}
                                        className="hover:bg-slate-50/50 transition-all group cursor-pointer border-slate-50"
                                        onClick={() => setSelectedExam(exam)}
                                    >
                                        <TableCell className="pl-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:bg-white group-hover:text-emerald-500 transition-all border border-slate-100">
                                                    <Calendar className="w-5 h-5" />
                                                </div>
                                                <span className="font-black text-slate-900 tracking-tight">{exam.title}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                                                {new Date(exam.date).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-slate-300 uppercase">D</span>
                                                    <span className="text-sm font-black text-emerald-600">{exam.correctCount}</span>
                                                </div>
                                                <div className="w-px h-6 bg-slate-100" />
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-slate-300 uppercase">Y</span>
                                                    <span className="text-sm font-black text-rose-500">{exam.wrongCount}</span>
                                                </div>
                                                <div className="w-px h-6 bg-slate-100" />
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-slate-300 uppercase">N</span>
                                                    <span className="text-sm font-black text-indigo-600 font-mono">{exam.netCount}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="inline-flex flex-col bg-slate-900 text-white px-3 py-1.5 rounded-xl shadow-lg shadow-slate-200">
                                                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">PUAN</span>
                                                <span className="text-xs font-black italic">%{exam.grade}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="font-black text-[10px] uppercase tracking-widest text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full px-4 h-8 transition-all"
                                            >
                                                Analiz
                                                <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {analytics.scoreHistory.length > itemsPerPage && (
                        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                GÖSTERİLEN: {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, analytics.scoreHistory.length)} / TOPLAM: {analytics.scoreHistory.length}
                            </p>
                            <div className="flex items-center gap-1.5">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => prev - 1); }}
                                    className="h-9 w-9 p-0 rounded-xl border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-white hover:shadow-md transition-all cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                {Array.from({ length: Math.ceil(analytics.scoreHistory.length / itemsPerPage) }).map((_, i) => (
                                    <Button
                                        key={i}
                                        variant={currentPage === i + 1 ? "default" : "outline"}
                                        size="sm"
                                        onClick={(e) => { e.stopPropagation(); setCurrentPage(i + 1); }}
                                        className={cn(
                                            "h-9 w-9 p-0 rounded-xl font-black text-[11px] transition-all cursor-pointer shadow-sm",
                                            currentPage === i + 1 ? "bg-slate-900 text-white border-transparent scale-110 shadow-lg shadow-slate-200" : "text-slate-600 bg-white border-slate-200 hover:border-slate-300"
                                        )}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === Math.ceil(analytics.scoreHistory.length / itemsPerPage)}
                                    onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => prev + 1); }}
                                    className="h-9 w-9 p-0 rounded-xl border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-white hover:shadow-md transition-all cursor-pointer"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Exam Analysis Modal */}
            <Dialog open={!!selectedExam} onOpenChange={() => setSelectedExam(null)}>
                <DialogContent className="sm:max-w-[80vw] lg:max-w-[1200px] h-[92vh] flex flex-col p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white">
                    <DialogHeader className="p-8 pb-6 border-b border-slate-100 shrink-0 bg-white z-10">
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

                                        {/* Question Image Section */}
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
                                            <div className="relative aspect-[16/9] max-h-[250px] w-full rounded-xl overflow-hidden border border-slate-100 bg-white">
                                                <Image
                                                    src={q.imageUrl}
                                                    alt={`Soru ${idx + 1}`}
                                                    fill
                                                    className="object-contain p-3 group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                        </div>

                                        {/* Optical & Info Section */}
                                        <div className="lg:w-72 shrink-0 space-y-4">
                                            <div className="bg-slate-50 rounded-[1.8rem] p-5 border border-slate-200">
                                                <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Optik Rapor</h5>
                                                <div className="flex items-center justify-between gap-1 mb-4">
                                                    {choices.map(choice => {
                                                        const isStudentChoice = q.studentAnswer === choice;
                                                        const isCorrectChoice = q.correctAnswer === choice;

                                                        return (
                                                            <div
                                                                key={choice}
                                                                className={cn(
                                                                    "w-9 h-9 rounded-full flex items-center justify-center font-black text-xs transition-all border-2",
                                                                    isStudentChoice && isCorrectChoice ? "bg-emerald-500 border-emerald-500 text-white shadow-md scale-105" :
                                                                        isStudentChoice && !isCorrectChoice ? "bg-rose-500 border-rose-500 text-white shadow-md scale-105" :
                                                                            !isStudentChoice && isCorrectChoice ? "bg-white border-emerald-500 text-emerald-600" :
                                                                                "bg-white border-slate-200 text-slate-400"
                                                                )}
                                                            >
                                                                {choice}
                                                            </div>
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

                                            <div className="p-5 rounded-[1.8rem] bg-slate-900 text-white relative overflow-hidden group/ai shadow-lg">
                                                <Lightbulb className="absolute -bottom-3 -right-3 w-20 h-20 opacity-10 group-hover/ai:rotate-12 transition-transform duration-500" />
                                                <div className="relative z-10">
                                                    <h5 className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1.5">YAPAY ZEKA ANALİZİ</h5>
                                                    <p className="text-[10px] font-bold italic leading-relaxed text-slate-300">
                                                        {!q.studentAnswer
                                                            ? "Boş bıraktığın sorular birikmesin."
                                                            : isCorrect
                                                                ? "Konu mantığını çok iyi kavramışsın!"
                                                                : "Hatalı soruyu tekrar çözmeyi dene."}
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
        </div>
    );
}
