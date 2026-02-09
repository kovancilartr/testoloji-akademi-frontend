"use client";

import { useStudent, useUpdateStudent } from "@/hooks/use-students";
import { FullPageLoader } from "@/components/ui/custom-ui/FullPageLoader";
import { use, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChevronLeft, GraduationCap, Calendar, BarChart3, ListChecks,
    ArrowUpRight, TrendingUp, Clock, FileText, AlertCircle, Edit2, Check, X, PlusCircle, MessageCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentAnalyticsView } from "@/components/analytics/StudentAnalyticsView";
import { cn } from "@/lib/utils";
import { useThemeColors } from "@/contexts/ThemeContext";
import { ContactStudentDialog } from "@/components/ui/custom-ui/dashboard-components/ContactStudentDialog";

import { RoleProtect } from "@/components/providers/RoleProtect";
import { Role } from "@/types/auth";

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: student, isLoading } = useStudent(id);
    const updateStudent = useUpdateStudent();
    const router = useRouter();
    const colors = useThemeColors();

    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [notes, setNotes] = useState("");
    const [isContactOpen, setIsContactOpen] = useState(false);

    useEffect(() => {
        if (student?.notes) setNotes(student.notes);
    }, [student]);

    if (isLoading) return <FullPageLoader message="Öğrenci verileri analiz ediliyor..." />;
    if (!student) return <div className="p-10 text-center">Öğrenci bulunamadı.</div>;

    const completedAssignments = student.assignments?.filter(a => a.status === 'COMPLETED') || [];
    const averageGrade = completedAssignments.length > 0
        ? completedAssignments.reduce((acc, curr) => acc + (curr.grade || 0), 0) / completedAssignments.length
        : 0;

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("tr-TR", {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    const handleSaveNotes = async () => {
        try {
            await updateStudent.mutateAsync({
                id: student.id,
                data: { notes }
            });
            setIsEditingNotes(false);
            toast.success("Koçluk notu güncellendi.");
        } catch (error) {
            toast.error("Not güncellenirken bir hata oluştu.");
        }
    };

    return (
        <RoleProtect allowedRoles={[Role.TEACHER, Role.ADMIN]}>
            <div className="flex-1 p-8 space-y-8 bg-gray-50/50 min-h-screen overflow-y-auto custom-scrollbar">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                            className="bg-white shadow-sm hover:shadow-md transition-all rounded-xl border border-gray-100 shrink-0"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight">{student.name}</h1>
                                <Badge className={cn("font-black px-3 py-1 text-[10px] rounded-full uppercase tracking-widest", colors.bg, colors.text, colors.border)}>ÖĞRENCİ</Badge>
                            </div>
                            <p className="text-gray-500 flex items-center gap-2 mt-1 font-medium">
                                <GraduationCap className={cn("w-4 h-4", colors.text)} /> {student.gradeLevel || "Sınıf Belirtilmemiş"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="font-bold text-slate-600 border-gray-200 hover:bg-white hover:border-slate-300 rounded-xl px-5 h-11 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                            onClick={() => setIsContactOpen(true)}
                        >
                            <MessageCircle className="w-4 h-4 text-slate-400" />
                            İletişime Geç
                        </Button>
                        <Button
                            className={cn("text-white font-bold px-6 h-11 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2 border-none cursor-pointer", colors.buttonBg, colors.buttonHover, colors.shadow)}
                            onClick={() => router.push('/dashboard/academy/assignments')}
                        >
                            <PlusCircle className="w-4 h-4" />
                            Ödev Ata
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-8">
                    <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl border border-gray-200/60 inline-flex shadow-sm">
                        <TabsList className="bg-transparent h-10 gap-1.5 p-0">
                            <TabsTrigger
                                value="overview"
                                className="rounded-xl px-10 font-bold text-[11px] uppercase tracking-wider data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-md transition-all flex items-center gap-2.5 h-full border-none outline-none"
                            >
                                <BarChart3 className="w-4 h-4" />
                                Genel Bakış
                            </TabsTrigger>
                            <TabsTrigger
                                value="analytics"
                                className="rounded-xl px-10 font-bold text-[11px] uppercase tracking-wider data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-md transition-all flex items-center gap-2.5 h-full border-none outline-none"
                            >
                                <TrendingUp className="w-4 h-4" />
                                Detaylı Analiz
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Card className="border-none shadow-sm bg-indigo-600 text-white overflow-hidden relative group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-12 h-12" />
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-indigo-100 text-sm font-medium">Başarı Ortalaması</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-black">%{averageGrade.toFixed(0)}</div>
                                    <div className="flex items-center gap-1 text-indigo-200 mt-2">
                                        Son {completedAssignments.slice(0, 5).length} teste göre
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm bg-white">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-gray-500 text-sm font-medium">Tamamlanan Ödevler</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-black text-gray-900">{completedAssignments.length}</div>
                                    <div className="h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
                                        <div
                                            className="h-full bg-green-500"
                                            style={{ width: `${(completedAssignments.length / Math.max(student.assignments?.length || 1, 1)) * 100}%` }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm bg-white">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-gray-500 text-sm font-medium">Toplam Atanan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-black text-gray-900">{student.assignments?.length || 0}</div>
                                    <p className="text-xs text-gray-400 mt-2">Bu dönem başından beri</p>
                                </CardContent>
                            </Card>

                            <Card className={cn(`border-none shadow-sm border-l-4 transition-all bg-white`, colors.border, isEditingNotes ? `md:col-span-1 ring-2 ${colors.bg}` : '')}>
                                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                                    <CardTitle className={cn("text-sm font-bold flex items-center gap-2", colors.text)}>
                                        <AlertCircle className="w-4 h-4" /> Koçluk Notu
                                    </CardTitle>
                                    {!isEditingNotes ? (
                                        <Button variant="ghost" size="icon" className={cn("h-6 w-6", colors.text)} onClick={() => setIsEditingNotes(true)}>
                                            <Edit2 className="w-3 h-3" />
                                        </Button>
                                    ) : (
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-green-600" onClick={handleSaveNotes} disabled={updateStudent.isPending}>
                                                <Check className="w-3 h-3" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-red-600" onClick={() => { setIsEditingNotes(false); setNotes(student.notes || ""); }}>
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    {isEditingNotes ? (
                                        <Textarea
                                            className="text-sm min-h-[80px] bg-white border-orange-200 focus-visible:ring-orange-500"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            autoFocus
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-600 line-clamp-3">
                                            {student.notes || "Henüz koçluk notu girilmemiş."}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Assignment History */}
                            <div className="lg:col-span-2 space-y-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <ListChecks className={cn("w-5 h-5", colors.text)} />
                                    Ödev ve Test Geçmişi
                                </h2>

                                <div className="space-y-4">
                                    {student.assignments?.map(assignment => (
                                        <Card key={assignment.id} className="border-none shadow-sm hover:ring-2 hover:ring-orange-200 transition-all group overflow-hidden bg-white">
                                            <CardContent className="p-0">
                                                <div className="flex items-stretch">
                                                    <div className={`w-2 ${assignment.status === 'COMPLETED' ? 'bg-green-500' : 'bg-gray-200'}`} />
                                                    <div className="flex-1 p-6 flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className={cn("w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-gray-100", colors.text)}>
                                                                {assignment.type === 'TEST' ? <FileText className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                                                            </div>
                                                            <div>
                                                                <h3 className={cn("font-bold text-gray-900 transition-colors", `group-hover:${colors.text}`)}>{assignment.title}</h3>
                                                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1 font-medium">
                                                                    <Calendar className="w-3 h-3" /> {formatDate(assignment.createdAt)}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-8">
                                                            {assignment.status === 'COMPLETED' ? (
                                                                <div className="text-right">
                                                                    <div className="text-sm font-black text-green-600">%{assignment.grade?.toFixed(0)}</div>
                                                                    <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200 font-bold px-2 py-0">
                                                                        BAŞARILI
                                                                    </Badge>
                                                                </div>
                                                            ) : (
                                                                <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200 font-bold px-2 py-0">
                                                                    BEKLİYOR
                                                                </Badge>
                                                            )}

                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className={cn("font-bold", colors.hover, colors.text)}
                                                                onClick={() => {
                                                                    if (assignment.type === 'TEST') {
                                                                        router.push(`/dashboard/student/exam/${assignment.id}`);
                                                                    }
                                                                }}
                                                            >
                                                                <ArrowUpRight className="w-4 h-4 mr-1" />
                                                                {assignment.status === 'COMPLETED' ? 'İncele' : 'Detay'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Quick Stats Sidebar */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-blue-500" />
                                    Özet Analiz
                                </h2>
                                <Card className="border-none shadow-sm p-6 space-y-6 bg-white rounded-2xl">
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-gray-700">Test Performansı</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1 font-bold">
                                                <span>Doğru Oranı</span>
                                                <span className="text-gray-900">%{averageGrade.toFixed(0)}</span>
                                            </div>
                                            <Progress value={averageGrade} className="h-3 bg-gray-100" />
                                        </div>
                                    </div>
                                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-blue-700 leading-relaxed font-medium mt-4">
                                        <p className="flex items-center gap-2 mb-2 font-black uppercase tracking-widest text-[10px]">
                                            <TrendingUp className="w-3 h-3" /> Quick Insight
                                        </p>
                                        Öğrenci son sınavında başarısını artırdı. Detaylı analiz sekmesinden AI önerilerini görebilirsin.
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="analytics" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <StudentAnalyticsView studentId={student.id} />
                    </TabsContent>
                </Tabs>
                {/* Contact Dialog */}
                <ContactStudentDialog
                    isOpen={isContactOpen}
                    onOpenChange={setIsContactOpen}
                    studentName={student.name}
                    studentPhone={student.phone}
                />
            </div>
        </RoleProtect>
    );
}
