
"use client";

import { useAssignments, useSubmitAssignment, useUndoSubmitAssignment } from "@/hooks/use-assignments";
import { FullPageLoader } from "@/components/ui/custom-ui/FullPageLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, CheckCircle, Clock, ExternalLink, Sparkles, ArrowRight, AlertCircle, ClipboardCheck, BookMarked, Play, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { useThemeColors } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { VideoPlayer } from "@/components/ui/custom-ui/dashboard-components/student/course-viewer/VideoPlayer";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function StudentAssignmentsPage() {
    const { data: assignments, isLoading } = useAssignments();
    const router = useRouter();
    const colors = useThemeColors();
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
    const [isPlayerOpen, setIsPlayerOpen] = useState(false);

    const submitAssignment = useSubmitAssignment();
    const undoSubmit = useUndoSubmitAssignment();

    const handleCompleteAssignment = async (id: string) => {
        try {
            await submitAssignment.mutateAsync({ id });
            setIsPlayerOpen(false);
            setSelectedAssignmentId(null);
            setSelectedVideoUrl(null);
        } catch (error) {
            console.error("Ödev tamamlanırken hata oluştu:", error);
        }
    };

    const handleUndoCompleteAssignment = async (id: string) => {
        try {
            await undoSubmit.mutateAsync(id);
            setIsPlayerOpen(false);
            setSelectedAssignmentId(null);
            setSelectedVideoUrl(null);
        } catch (error) {
            console.error("Ödev iptal edilirken hata oluştu:", error);
        }
    };

    if (isLoading) return <FullPageLoader message="Ödevler yükleniyor..." />;

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("tr-TR", {
            day: 'numeric', month: 'long'
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200 font-bold"><CheckCircle className="w-3 h-3 mr-1" /> Tamamlandı</Badge>;
            case "IN_PROGRESS":
                return <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200 font-bold"><Clock className="w-3 h-3 mr-1" /> Devam Ediyor</Badge>;
            case "OVERDUE":
                return <Badge className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200 font-bold"><AlertCircle className="w-3 h-3 mr-1" /> Gecikmiş</Badge>;
            default:
                return <Badge className={cn("font-bold", colors.bg, colors.text, colors.border)}><Sparkles className="w-3 h-3 mr-1" /> Yapılacak</Badge>;
        }
    };

    const getTypeConfig = (type: string) => {
        const isTest = type === "TEST";

        if (isTest) {
            // Kurs testi için tema rengini kullan
            return {
                icon: ClipboardCheck,
                label: "KURS TESTİ",
                badgeBg: colors.bg,
                badgeText: colors.text,
                badgeBorder: colors.border,
            };
        } else {
            // Öğretmenin atadığı ödev için mor renk
            return {
                icon: BookMarked,
                label: "ÖDEV",
                badgeBg: "bg-purple-50",
                badgeText: "text-purple-700",
                badgeBorder: "border-purple-200",
            };
        }
    };

    const completedCount = assignments?.filter(a => a.status === 'COMPLETED').length || 0;
    const totalCount = assignments?.length || 0;
    const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div className="flex-1 p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-50/50 overflow-y-auto h-full">
            {/* Header with Stats */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                        <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg", colors.gradient, colors.shadow)}>
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        Ödevlerim
                    </h1>
                    <p className="text-gray-500 mt-2 text-base">
                        Öğretmenin sana atadığı ödevleri buradan takip edebilirsin.
                    </p>
                </div>

                {/* Progress Card */}
                {totalCount > 0 && (
                    <div className={cn("bg-gradient-to-br from-gray-50 via-white to-gray-50/30 rounded-3xl p-6 border shadow-sm", colors.border)}>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">İlerleme Durumu</p>
                                <p className="text-2xl font-black text-gray-900 mt-1">{completedCount} / {totalCount} Tamamlandı</p>
                            </div>
                            <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg", colors.gradient, colors.shadow)}>
                                <span className="text-2xl font-black text-white">{completionPercent}%</span>
                            </div>
                        </div>
                        <Progress value={completionPercent} className="h-3" />
                    </div>
                )}
            </div>

            {assignments?.length === 0 ? (
                <div className="text-center py-24 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 rounded-3xl border-2 border-dashed border-emerald-200">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Harika İş Çıkarıyorsun!</h3>
                    <p className="text-gray-500 text-lg">Şu an bekleyen ödevin yok.</p>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b-2">
                                    <TableHead className="font-black text-gray-900 uppercase text-xs tracking-wider">Tip</TableHead>
                                    <TableHead className="font-black text-gray-900 uppercase text-xs tracking-wider">Ödev Adı</TableHead>
                                    <TableHead className="font-black text-gray-900 uppercase text-xs tracking-wider">Açıklama</TableHead>
                                    <TableHead className="font-black text-gray-900 uppercase text-xs tracking-wider">Son Tarih</TableHead>
                                    <TableHead className="font-black text-gray-900 uppercase text-xs tracking-wider">Durum</TableHead>
                                    <TableHead className="font-black text-gray-900 uppercase text-xs tracking-wider text-right">İşlem</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignments?.map((assignment) => {
                                    const typeConfig = getTypeConfig(assignment.type);
                                    const Icon = typeConfig.icon;

                                    return (
                                        <TableRow key={assignment.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("p-2 rounded-xl", typeConfig.badgeBg)}>
                                                        <Icon className={cn("w-4 h-4", typeConfig.badgeText)} />
                                                    </div>
                                                    <Badge className={cn("text-[9px] font-black uppercase tracking-wider", typeConfig.badgeBg, typeConfig.badgeText, typeConfig.badgeBorder)}>
                                                        {typeConfig.label}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="font-bold text-gray-900">{assignment.title}</div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="text-sm text-gray-600 max-w-xs line-clamp-2">
                                                    {assignment.description || (assignment.project ? `📚 ${assignment.project.name}` : "Açıklama yok.")}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="font-semibold">{formatDate(assignment.dueDate)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                {getStatusBadge(assignment.status)}
                                            </TableCell>
                                            <TableCell className="py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 text-right">
                                                    {assignment.externalUrl && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className={cn(
                                                                "font-bold cursor-pointer hover:bg-slate-50 border-slate-200",
                                                                assignment.status === 'COMPLETED' && "bg-slate-50 border-emerald-200 text-emerald-600"
                                                            )}
                                                            onClick={() => {
                                                                setSelectedAssignmentId(assignment.id);
                                                                setSelectedVideoUrl(assignment.externalUrl || null);
                                                                setIsPlayerOpen(true);
                                                            }}
                                                        >
                                                            {assignment.status === 'COMPLETED' ? (
                                                                <><CheckCircle className="w-4 h-4 mr-2" /> İzlendi</>
                                                            ) : (
                                                                <><Play className="w-4 h-4 mr-2 text-orange-500" /> İzle</>
                                                            )}
                                                        </Button>
                                                    )}

                                                    {assignment.externalUrl && assignment.status === 'COMPLETED' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="font-bold text-slate-400 hover:text-red-500 hover:bg-red-50"
                                                            onClick={() => handleUndoCompleteAssignment(assignment.id)}
                                                            disabled={undoSubmit.isPending}
                                                            title="İzlendi işaretini kaldır"
                                                        >
                                                            {undoSubmit.isPending ? (
                                                                <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                                                            ) : (
                                                                <RotateCcw className="w-4 h-4 mr-2" />
                                                            )}
                                                            Geri Al
                                                        </Button>
                                                    )}
                                                    {assignment.type === 'TEST' && (
                                                        <Button
                                                            size="sm"
                                                            className={cn("bg-gradient-to-r shadow-lg font-bold group/btn text-white transition-all", colors.gradient, colors.buttonHover, colors.shadow)}
                                                            onClick={() => router.push(`/dashboard/student/exam/${assignment.id}`)}
                                                            disabled={assignment.status === 'COMPLETED'}
                                                        >
                                                            {assignment.status === 'COMPLETED' ? (
                                                                <>
                                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                                    Tamamlandı
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Testi Başlat
                                                                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                                                </>
                                                            )}
                                                        </Button>
                                                    )}
                                                    {assignment.type !== 'TEST' && !assignment.externalUrl && (
                                                        <Button size="sm" variant="secondary" className="font-bold">
                                                            Detaylar
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4 pb-20">
                        {assignments?.map((assignment) => {
                            const typeConfig = getTypeConfig(assignment.type);
                            const Icon = typeConfig.icon;

                            return (
                                <div key={assignment.id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("p-2.5 rounded-2xl shrink-0", typeConfig.badgeBg)}>
                                                <Icon className={cn("w-5 h-5", typeConfig.badgeText)} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 text-sm leading-tight mb-1">{assignment.title}</h4>
                                                <Badge className={cn("text-[9px] font-black uppercase tracking-wider px-1.5 py-0 h-5", typeConfig.badgeBg, typeConfig.badgeText, typeConfig.badgeBorder)}>
                                                    {typeConfig.label}
                                                </Badge>
                                            </div>
                                        </div>
                                        {getStatusBadge(assignment.status)}
                                    </div>

                                    <div className="text-xs text-slate-500 font-medium leading-relaxed">
                                        {assignment.description || (assignment.project ? `📚 ${assignment.project.name}` : "Açıklama yok.")}
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{formatDate(assignment.dueDate)}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {assignment.externalUrl && (
                                                <>
                                                    {assignment.status === 'COMPLETED' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
                                                            onClick={() => handleUndoCompleteAssignment(assignment.id)}
                                                            disabled={undoSubmit.isPending}
                                                        >
                                                            {undoSubmit.isPending ? (
                                                                <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                                                            ) : (
                                                                <RotateCcw className="w-4 h-4" />
                                                            )}
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        className={cn(
                                                            "font-bold rounded-xl h-9 text-xs px-4",
                                                            assignment.status === 'COMPLETED'
                                                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"
                                                                : "bg-slate-900 text-white hover:bg-slate-800"
                                                        )}
                                                        onClick={() => {
                                                            setSelectedAssignmentId(assignment.id);
                                                            setSelectedVideoUrl(assignment.externalUrl || null);
                                                            setIsPlayerOpen(true);
                                                        }}
                                                    >
                                                        {assignment.status === 'COMPLETED' ? (
                                                            <><CheckCircle className="w-3.5 h-3.5 mr-2" /> İzlendi</>
                                                        ) : (
                                                            <><Play className="w-3.5 h-3.5 mr-2 text-orange-500" /> İzle</>
                                                        )}
                                                    </Button>
                                                </>
                                            )}

                                            {assignment.type === 'TEST' && (
                                                <Button
                                                    size="sm"
                                                    className={cn("bg-gradient-to-r shadow-lg font-bold text-xs h-9 rounded-xl px-4", colors.gradient, colors.buttonHover, colors.shadow)}
                                                    onClick={() => router.push(`/dashboard/student/exam/${assignment.id}`)}
                                                    disabled={assignment.status === 'COMPLETED'}
                                                >
                                                    {assignment.status === 'COMPLETED' ? "Tamamlandı" : "Başla"}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Video Player Modal */}
            <Dialog open={isPlayerOpen} onOpenChange={(open) => {
                setIsPlayerOpen(open);
                if (!open) {
                    setSelectedAssignmentId(null);
                    setSelectedVideoUrl(null);
                }
            }}>
                <DialogContent className="!max-w-5xl p-0 overflow-hidden bg-black border-none rounded-[2rem] shadow-2xl">
                    <DialogHeader className="hidden p-6 bg-white border-b absolute top-0 left-0 right-0 z-50 opacity-0">
                        <DialogTitle className="text-xl font-black text-slate-900">Ödev Videosu</DialogTitle>
                    </DialogHeader>
                    <div className="relative group">
                        <div className="aspect-video w-full mt-0">
                            {selectedVideoUrl && (
                                <VideoPlayer url={selectedVideoUrl} />
                            )}
                        </div>

                        {/* Action Buttons Overlay (Bottom bar inside modal) */}
                        {selectedAssignmentId && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-4">
                                {assignments?.find(a => a.id === selectedAssignmentId)?.status !== 'COMPLETED' ? (
                                    <Button
                                        className="h-12 cursor-pointer px-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black shadow-2xl shadow-orange-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-4"
                                        onClick={() => handleCompleteAssignment(selectedAssignmentId)}
                                        disabled={submitAssignment.isPending}
                                    >
                                        {submitAssignment.isPending ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <CheckCircle className="w-5 h-5" />
                                        )}
                                        VİDEOYU İZLEDİM - BİTİR
                                    </Button>
                                ) : (
                                    <Button
                                        className="h-12 cursor-pointer px-12 rounded-2xl bg-slate-800 hover:bg-red-600 text-white font-black shadow-2xl shadow-black/40 flex items-center gap-3 animate-in slide-in-from-bottom-4 transition-all"
                                        onClick={() => handleUndoCompleteAssignment(selectedAssignmentId)}
                                        disabled={undoSubmit.isPending}
                                    >
                                        {undoSubmit.isPending ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <RotateCcw className="w-5 h-5" />
                                        )}
                                        İZLENMEDİ YAP - GERİ AL
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
