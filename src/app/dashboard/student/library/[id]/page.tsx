"use client";

import { use, useState, useEffect, useMemo } from "react";
import { useMyCourse, useUpdateProgress, useStartTest } from "@/hooks/use-courses";
import { FullPageLoader } from "@/components/ui/custom-ui/FullPageLoader";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Custom Components
import { StudentCourseHeader } from "@/components/ui/custom-ui/dashboard-components/student/course-viewer/StudentCourseHeader";
import { CourseSidebar } from "@/components/ui/custom-ui/dashboard-components/student/course-viewer/CourseSidebar";
import { ActiveContentPlayer } from "@/components/ui/custom-ui/dashboard-components/student/course-viewer/ActiveContentPlayer";

import {
    Dialog,
    DialogContent,
    DialogDescription,
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

export default function StudentCourseViewerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: course, isLoading } = useMyCourse(id);
    const updateProgress = useUpdateProgress();
    const { mutateAsync: startTest, isPending: isStartingTest } = useStartTest();
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialContentId = searchParams.get("contentId");

    const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
    const [expandedModules, setExpandedModules] = useState<string[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isCinemaMode, setIsCinemaMode] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    // Get all contents in a flat list for navigation
    const allContents = useMemo(() => {
        if (!course) return [];
        return course.modules.flatMap((m: any) => m.contents);
    }, [course]);

    const activeContent = useMemo(() => {
        if (!selectedContentId) return allContents[0];
        return allContents.find((c: any) => c.id === selectedContentId);
    }, [selectedContentId, allContents]);

    const activeIndex = useMemo(() => {
        return allContents.findIndex((c: any) => c.id === activeContent?.id);
    }, [allContents, activeContent]);

    const stats = useMemo(() => {
        if (!allContents.length) return { completed: 0, total: 0, percent: 0 };
        const completed = allContents.filter((c: any) => c.progress && c.progress[0]?.status === 'COMPLETED').length;
        return {
            completed,
            total: allContents.length,
            percent: Math.round((completed / allContents.length) * 100)
        };
    }, [allContents]);

    const isCompleted = useMemo(() => {
        return activeContent?.progress && activeContent.progress[0]?.status === 'COMPLETED';
    }, [activeContent]);

    useEffect(() => {
        if (course && allContents.length > 0) {
            // Sadece başlangıçta veya URL'deki ID (initialContentId) değiştiğinde tetiklenir.
            // Eğer URL'de bir ID varsa ona git, yoksa ve halihazırda bir seçim yoksa ilk derse git.
            const targetId = initialContentId || selectedContentId || allContents[0]?.id;

            if (targetId && targetId !== selectedContentId) {
                setSelectedContentId(targetId);

                // Bu içeriği barındıran modülü bul ve yan menüde aç
                const parentModule = course.modules.find((m: any) =>
                    m.contents.some((c: any) => c.id === targetId)
                );

                if (parentModule && !expandedModules.includes(parentModule.id)) {
                    setExpandedModules([parentModule.id]);
                }
            }
        }
    }, [course, initialContentId]); // selectedContentId bağımlılığı kaldırıldı, manuel seçimler korunacak.

    // Auto-mark as IN_PROGRESS when starting
    useEffect(() => {
        if (activeContent && (!activeContent.progress || activeContent.progress.length === 0 || activeContent.progress[0]?.status === 'NOT_STARTED')) {
            updateProgress.mutate({ courseId: id, contentId: activeContent.id, status: 'IN_PROGRESS' });
        }
    }, [activeContent?.id]);

    const handleMarkAsCompleted = (contentId: string) => {
        // Optimistic: Update immediately
        updateProgress.mutate({ courseId: id, contentId, status: 'COMPLETED' });
        toast.success("Tebrikler, bu dersi tamamladın!");
        nextContent();
    };

    const handleUndoCompletion = (contentId: string) => {
        // Optimistic: Update immediately
        updateProgress.mutate({ courseId: id, contentId, status: 'IN_PROGRESS' });
        toast.success("Ders tamamlanmadı olarak işaretlendi.");
    };

    const handleStartExam = async () => {
        if (!activeContent) return;
        try {
            const data = await startTest({ courseId: id, contentId: activeContent.id });
            router.push(`/dashboard/student/exam/${data.assignmentId}?courseId=${id}`);
        } catch (error) {
            toast.error("Sınav başlatılamadı.");
        }
    };

    const handleOpenReviewModal = () => {
        setIsReviewModalOpen(true);
    };

    const handleReviewExam = (assignmentId?: string) => {
        setIsReviewModalOpen(false);
        const targetId = typeof assignmentId === 'string' ? assignmentId : activeContent?.assignment?.id;
        if (!targetId) return;
        router.push(`/dashboard/student/exam/${targetId}?courseId=${id}&mode=review`);
    };

    const nextContent = () => {
        const idx = allContents.findIndex((c: any) => c.id === activeContent?.id);
        if (idx < allContents.length - 1) setSelectedContentId(allContents[idx + 1].id);
    };

    const prevContent = () => {
        const idx = allContents.findIndex((c: any) => c.id === activeContent?.id);
        if (idx > 0) setSelectedContentId(allContents[idx - 1].id);
    };

    const attemptsList = activeContent?.assignment?.attempts && activeContent.assignment.attempts.length > 0
        ? activeContent.assignment.attempts
        : (activeContent?.assignment ? [activeContent.assignment] : []);

    const filteredAttempts = attemptsList.filter((a: any) => a.status === 'COMPLETED');

    if (isLoading) return <FullPageLoader message="Müfredat hazırlanıyor..." />;
    if (!course) return <div className="p-10 text-center">Kurs bulunamadı.</div>;

    return (
        <div className="fixed inset-0 z-100 bg-[#f8fafc] flex flex-col font-sans overflow-hidden">
            {/* Testoloji Branded Header */}
            <StudentCourseHeader
                course={course}
                activeContent={activeContent}
                isSidebarOpen={isSidebarOpen}
                isCinemaMode={isCinemaMode}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                onBack={() => router.push('/dashboard/student/library')}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden relative">
                <CourseSidebar
                    course={course}
                    allContents={allContents}
                    expandedModules={expandedModules}
                    onToggleModule={(moduleId) => setExpandedModules(prev => prev.includes(moduleId) ? [] : [moduleId])}
                    selectedContentId={selectedContentId}
                    onSelectContent={(contentId) => {
                        setSelectedContentId(contentId);
                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    isSidebarOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    isCinemaMode={isCinemaMode}
                    stats={stats}
                />

                <ActiveContentPlayer
                    activeContent={activeContent}
                    isCinemaMode={isCinemaMode}
                    onToggleCinemaMode={() => setIsCinemaMode(!isCinemaMode)}
                    onStartExam={handleStartExam}
                    onReviewExam={handleOpenReviewModal}
                    isStartingTest={isStartingTest}
                    onNext={nextContent}
                    onPrev={prevContent}
                    onComplete={handleMarkAsCompleted}
                    onUndoComplete={handleUndoCompletion}
                    isCompleting={updateProgress.isPending}
                    hasPrev={activeIndex > 0}
                    hasNext={activeIndex < allContents.length - 1}
                    isCompleted={!!isCompleted}
                    courseFinished={stats.percent === 100}
                />
            </div>

            {/* Review History Modal */}
            <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">{activeContent?.title || 'Sınav'} - Geçmiş Sonuçlar</DialogTitle>
                        <DialogDescription>
                            Bu sınav ("{activeContent?.title}") için yaptığınız tüm denemelerin detaylı sonuçları aşağıdadır.
                        </DialogDescription>
                    </DialogHeader>

                    {filteredAttempts.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tarih</TableHead>
                                    <TableHead className="text-center text-emerald-600 font-bold">Doğru</TableHead>
                                    <TableHead className="text-center text-red-600 font-bold">Yanlış</TableHead>
                                    <TableHead className="text-center font-bold">Net</TableHead>
                                    <TableHead className="text-center">Puan</TableHead>
                                    <TableHead className="text-center">Durum</TableHead>
                                    <TableHead className="text-right">İşlem</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAttempts.map((attempt: any) => (
                                    <TableRow key={attempt.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{new Date(attempt.createdAt || new Date()).toLocaleDateString('tr-TR')}</span>
                                                <span className="text-xs text-slate-400">{new Date(attempt.createdAt || new Date()).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center font-bold text-emerald-600">
                                            {attempt.correct !== undefined ? attempt.correct : '-'}
                                        </TableCell>
                                        <TableCell className="text-center font-bold text-red-600">
                                            {attempt.incorrect !== undefined ? attempt.incorrect : '-'}
                                        </TableCell>
                                        <TableCell className="text-center font-bold text-slate-900">
                                            {attempt.net !== undefined ? Number(attempt.net).toFixed(2) : '-'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={attempt.grade !== null && attempt.grade >= 50 ? "default" : "destructive"} className="font-bold">
                                                {attempt.grade !== null ? attempt.grade : '...'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className="opacity-70">{attempt.status === 'COMPLETED' ? 'Tamamlandı' : 'Devam Ediyor'}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleReviewExam(attempt.id)}
                                            >
                                                İncele
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="py-8 text-center text-slate-500">
                            Henüz tamamlanmış sınav geçmişi bulunmamaktadır.
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&display=swap');
                
                body {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    -webkit-font-smoothing: antialiased;
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
}
