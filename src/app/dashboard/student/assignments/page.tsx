
"use client";

import { useAssignments } from "@/hooks/use-assignments";
import { FullPageLoader } from "@/components/ui/custom-ui/FullPageLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, CheckCircle, Clock, ExternalLink, Sparkles, ArrowRight, AlertCircle, ClipboardCheck, BookMarked } from "lucide-react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { useThemeColors } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
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
        <div className="flex-1 p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-50/50 min-h-full">
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
                <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
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
                                            <div className="flex items-center justify-end gap-2">
                                                {assignment.externalUrl && (
                                                    <Button variant="outline" size="sm" asChild className="font-bold">
                                                        <a href={assignment.externalUrl} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
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
            )}
        </div>
    );
}
