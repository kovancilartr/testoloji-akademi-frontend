"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { StudioHeader } from "./StudioHeader";
import { StudioStatusRibbon } from "./StudioStatusRibbon";
import { MobilePdfPreview } from "./MobilePdfPreview";

interface StudioPanelProps {
    project: any;
    questions: any[];
    userRole?: string;
    isPreviewOpen: boolean;
    setIsPreviewOpen: (open: boolean) => void;
    isPdfLoading: boolean;
    handleDownloadPDF: () => void;
}

// Optimized wrapper to stop the 3x render loop from leaking into the PDF engine
export const StudioPanel = React.memo(({
    project,
    questions,
    userRole,
    isPreviewOpen,
    setIsPreviewOpen,
    isPdfLoading,
    handleDownloadPDF
}: StudioPanelProps) => {
    // 1. Create a stable state for the PDF engine
    const [stableQuestions, setStableQuestions] = useState(questions);
    const [isSyncing, setIsSyncing] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // 2. Track real content changes (Deep compare equivalent)
    const contentSignature = useMemo(() => {
        return JSON.stringify({
            qCount: questions.length,
            qIds: questions.map(q => q.id),
            qSpacing: questions.map(q => q.bottomSpacing),
            qDifficulty: questions.map(q => q.difficulty),
            qAnswers: questions.map(q => q.correctAnswer),
            settings: project?.settings
        });
    }, [questions, project?.settings]);

    // 3. Only update the stable state after user activity settles (Debounce)
    useEffect(() => {
        setIsSyncing(true);
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            setStableQuestions(questions);
            setIsSyncing(false);
        }, 500); // Wait 500ms of absolute silence

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [contentSignature]);

    return (
        <div className="flex-1 h-full bg-gray-50/50 p-3 lg:p-4 flex flex-col overflow-hidden">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl h-full flex flex-col overflow-hidden relative border-brand-100/20">
                <StudioHeader
                    projectId={project.id}
                    project={project}
                    questions={questions}
                    userRole={userRole}
                    isPreviewOpen={isPreviewOpen}
                    setIsPreviewOpen={setIsPreviewOpen}
                    isPdfLoading={isPdfLoading}
                    handleDownloadPDF={handleDownloadPDF}
                />

                <div className="flex-1 bg-gray-50 overflow-hidden relative group/viewer">
                    {project && questions.length > 0 ? (
                        <div className={`w-full h-full transition-all duration-500 ${isSyncing ? 'opacity-40 blur-[4px] scale-[0.98]' : 'opacity-100 blur-0 scale-100'}`}>
                            <MobilePdfPreview
                                questions={stableQuestions}
                                projectName={project.name}
                                settings={project.settings}
                                userRole={userRole}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-white">
                            <Loader2 className="h-8 w-8 text-brand-200 animate-spin" />
                            <p className="mt-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">Döküman Hazırlanıyor</p>
                        </div>
                    )}

                    {isSyncing && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-brand-100 shadow-2xl animate-in fade-in zoom-in slide-in-from-top-4 duration-300">
                            <RefreshCw className="h-3 w-3 text-brand-500 animate-spin" />
                            <span className="text-[9px] font-black text-brand-600 uppercase tracking-widest">Veriler Senkronize Ediliyor...</span>
                        </div>
                    )}
                </div>

                <StudioStatusRibbon />
            </div>
        </div>
    );
});
