"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { pdf } from "@react-pdf/renderer";
import { DropResult } from "@hello-pangea/dnd";

// UI Components
import { PDFDocument } from "@/components/pdf/PDFTemplate";
import { FullPageLoader } from "@/components/ui/custom-ui/FullPageLoader";

// Modular Dashboard Components
import { DashboardHeader } from "@/components/ui/custom-ui/dashboard-components/DashboardHeader";
import { UpgradeModal } from "@/components/ui/custom-ui/dashboard-components/UpgradeModal";
import ImageUploadDialog from "@/components/ui/custom-ui/dashboard-components/ImageUploadDialog";
import PdfCropperDialog from "@/components/ui/custom-ui/dashboard-components/PdfCropperDialog";
import QuestionEditorDialog from "@/components/ui/custom-ui/dashboard-components/QuestionEditorDialog";

// Modular Project Components
import { QuestionListSection } from "@/components/ui/custom-ui/dashboard-components/project/QuestionListSection";
import { StudioPanel } from "@/components/ui/custom-ui/dashboard-components/project/StudioPanel";
import { ImagePreviewDialog } from "@/components/ui/custom-ui/dashboard-components/project/ImagePreviewDialog";

// Hooks & Utils
import { useProject, useProjectStats } from "@/hooks/use-projects";
import { useUpdateQuestionDetail, useDeleteQuestion, useReorderQuestions, useUploadQuestion } from "@/hooks/use-questions";
import { useAuth } from "@/contexts/AuthContext";
import { QUESTION_LIMITS, GUEST_LIMITS } from "@/config/limits";
import { Role, SubscriptionTier } from "@/types/auth";
import { optimizeImage } from "@/lib/image-optimization";

const IMAGE_BASE_URL = "http://localhost:4000";

const getImageUrl = (url: string) => {
    if (!url) return "";
    // Base64 images (guest mode)
    if (url.startsWith('data:')) return url;
    // Full URLs
    if (url.startsWith('http')) return url;
    // Relative URLs (backend)
    return `${IMAGE_BASE_URL}${url}`;
};

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;
    const { user } = useAuth();
    const { totalQuestions } = useProjectStats();

    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const { data: project, isLoading: isProjectLoading, error } = useProject(projectId);

    const updateQuestionMutation = useUpdateQuestionDetail();
    const deleteQuestionMutation = useDeleteQuestion();
    const reorderMutation = useReorderQuestions();
    const uploadMutation = useUploadQuestion();

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const [isPdfLoading, setIsPdfLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const questions = project?.questions || [];

    useEffect(() => {
        if (error) {
            toast.error("Proje bulunamadı.");
            router.push("/dashboard");
        }
    }, [error, router]);

    useEffect(() => {
        if (isPreviewOpen) {
            setIsPdfLoading(true);
            const timer = setTimeout(() => {
                setIsPdfLoading(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [isPreviewOpen]);

    const checkQuestionLimit = () => {
        const isGuest = !user;
        const limit = isGuest ? GUEST_LIMITS.questions : (QUESTION_LIMITS[user.tier] || 0);
        const currentCount = questions.length;

        if (currentCount >= limit) {
            setIsUpgradeModalOpen(true);
            return false;
        }
        return true;
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!checkQuestionLimit()) {
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        try {
            const optimizedFile = await optimizeImage(file);
            uploadMutation.mutate({ projectId, file: optimizedFile }, {
                onSuccess: () => {
                    if (fileInputRef.current) fileInputRef.current.value = "";
                }
            });
        } catch (error) {
            uploadMutation.mutate({ projectId, file }, {
                onSuccess: () => {
                    if (fileInputRef.current) fileInputRef.current.value = "";
                }
            });
        }
    };

    const handleDeleteQuestion = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        deleteQuestionMutation.mutate({ id, projectId });
    };

    const handleUpdateQuestionSpacing = (id: string, spacing: number) => {
        updateQuestionMutation.mutate({ id, data: { bottomSpacing: spacing }, projectId });
    };

    const handleUpdateQuestionDetail = (id: string, data: { difficulty?: number, correctAnswer?: string }) => {
        updateQuestionMutation.mutate({ id, data, projectId });
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(questions);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const questionIds = items.map((q: any) => q.id);
        reorderMutation.mutate({ projectId, questionIds });
    };

    const handleDownloadPDF = async () => {
        if (!project || questions.length === 0) {
            toast.error("İndirilecek soru yok.");
            return;
        }

        try {
            const blob = await pdf(<PDFDocument questions={questions} projectName={project.name} settings={project.settings} userRole={user?.role} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${project.name}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error(error);
            toast.error("PDF oluşturulamadı.");
        }
    };

    const [activeView, setActiveView] = useState<'questions' | 'studio'>('questions');

    if (isProjectLoading) return <FullPageLoader message="Proje Hazırlanıyor" />;
    if (!project) return null;

    return (
        <div className="flex-1 flex flex-col h-full bg-gray-50/50 overflow-hidden relative">
            <DashboardHeader
                editorActions={{
                    imageUploadDialog: <ImageUploadDialog projectId={projectId} onBeforeOpen={checkQuestionLimit} />,
                    pdfCropper: (
                        <PdfCropperDialog
                            projectId={projectId}
                            onBeforeOpen={() => {
                                const allowed = checkQuestionLimit();
                                if (allowed) setIsDialogOpen(true);
                                return allowed;
                            }}
                            onClose={() => setIsDialogOpen(false)}
                        />
                    ),
                    questionEditor: (
                        <QuestionEditorDialog
                            projectId={project.id}
                            onBeforeOpen={() => {
                                const allowed = checkQuestionLimit();
                                if (allowed) setIsDialogOpen(true);
                                return allowed;
                            }}
                            onClose={() => setIsDialogOpen(false)}
                        />
                    )
                }}
            />

            {/* Hidden File Input for Header Button */}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />

            <main className="flex-1 overflow-hidden bg-white relative">
                <div className="flex h-full w-full">
                    <div className={`flex-1 h-full min-w-0 ${activeView === 'questions' ? 'block' : 'hidden lg:block'}`}>
                        <QuestionListSection
                            questions={questions}
                            onDragEnd={onDragEnd}
                            getImageUrl={getImageUrl}
                            onImagePreview={setSelectedImageUrl}
                            onUpdateSpacing={handleUpdateQuestionSpacing}
                            onUpdateDetail={handleUpdateQuestionDetail}
                            onDelete={handleDeleteQuestion}
                        />
                    </div>

                    <div className={`flex-1 h-full min-w-0 ${activeView === 'studio' ? 'block' : 'hidden lg:block'}`}>
                        <StudioPanel
                            project={project}
                            questions={questions}
                            userRole={user?.role}
                            isPreviewOpen={isPreviewOpen}
                            setIsPreviewOpen={setIsPreviewOpen}
                            isPdfLoading={isPdfLoading}
                            handleDownloadPDF={handleDownloadPDF}
                        />
                    </div>
                </div>

                {!isDialogOpen && (
                    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[50] px-4 w-full max-w-[300px] animate-in slide-in-from-bottom-5 duration-500">
                        <div className="bg-gray-900/90 backdrop-blur-xl border border-white/10 p-1.5 rounded-[1.5rem] shadow-2xl flex items-center gap-1">
                            <button
                                onClick={() => setActiveView('questions')}
                                className={`flex-1 h-11 rounded-2xl flex items-center justify-center gap-2 transition-all ${activeView === 'questions' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-gray-400 hover:text-white'}`}
                            >
                                <span className="text-[10px] font-black uppercase tracking-widest">Soru Listesi</span>
                            </button>
                            <button
                                onClick={() => setActiveView('studio')}
                                className={`flex-1 h-11 rounded-2xl flex items-center justify-center gap-2 transition-all ${activeView === 'studio' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-gray-400 hover:text-white'}`}
                            >
                                <span className="text-[10px] font-black uppercase tracking-widest">Studio</span>
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <ImagePreviewDialog
                imageUrl={selectedImageUrl}
                onClose={() => setSelectedImageUrl(null)}
            />

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onOpenChange={setIsUpgradeModalOpen}
                title={!user ? "Misafir Soru Limitine Ulaşıldı" : "Soru Limitine Ulaşıldı"}
                description={
                    !user
                        ? `Misafir kullanıcılar en fazla ${GUEST_LIMITS.questions} soru ekleyebilir. Daha fazla soru için ücretsiz üye olun!`
                        : `Mevcut paketinizle toplamda en fazla ${QUESTION_LIMITS[user.tier] || 0} soru yükleyebilirsiniz.`
                }
                currentRole={user?.tier || SubscriptionTier.BRONZ}
            />
        </div>
    );
}
