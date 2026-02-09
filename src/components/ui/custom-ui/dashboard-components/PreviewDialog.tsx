"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Maximize2, Eye, FileDown, FileText, Loader2 } from "lucide-react";
import { Question } from "@/types/question";
import { Project } from "@/types/project";
import { MobilePdfPreview } from "./project/MobilePdfPreview";

interface PreviewDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    isPdfLoading: boolean;
    questions: Question[];
    project: Project;
    handleDownloadPDF: () => void;
    userRole?: string;
}

export function PreviewDialog({
    isOpen,
    onOpenChange,
    isPdfLoading,
    questions,
    project,
    handleDownloadPDF,
    userRole
}: PreviewDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="border-brand-200 text-brand-600 hover:bg-brand-50 rounded-xl h-9 sm:h-10 px-3 sm:px-4 font-black text-[10px] sm:text-xs gap-2 flex"
                >
                    <Maximize2 className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                    <span className="hidden xs:inline">Canlı</span> Önizleme
                </Button>
            </DialogTrigger>
            <DialogContent className="!max-w-[95vw] sm:!max-w-[60vw] w-full h-[92vh] p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-white">
                <div className="flex flex-col h-full">
                    <div className="h-14 px-4 sm:px-6 border-b border-gray-100 flex items-center justify-between bg-white">
                        <DialogTitle className="text-[10px] sm:text-sm font-black uppercase tracking-widest flex items-center gap-2 sm:gap-3">
                            <div className="p-1 sm:p-1.5 bg-brand-500 rounded-lg shadow-lg shadow-brand-500/20">
                                <Eye className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-white" />
                            </div>
                            Döküman Önizleme
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            Hazırlanan dökümanın canlı sayfa mizanpajı ve dizgi görünümü.
                        </DialogDescription>
                        <Button
                            onClick={handleDownloadPDF}
                            className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-3 sm:px-4 h-8 sm:h-9 font-black text-[9px] sm:text-xs gap-2 shadow-lg shadow-brand-500/20"
                        >
                            <FileDown className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                            <span className="hidden xs:inline">Dökümanı İndir</span>
                            <span className="xs:hidden">İndir</span>
                        </Button>
                    </div>
                    <div className="flex-1 bg-gray-100 relative">
                        {isPdfLoading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-20">
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FileText className="h-6 w-6 text-brand-500 animate-pulse" />
                                    </div>
                                </div>
                                <p className="mt-6 text-sm font-black text-gray-900 uppercase tracking-widest animate-pulse">
                                    Döküman Hazırlanıyor...
                                </p>
                                <p className="mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                    Mizanpaj ve mizanpaj hesaplanıyor
                                </p>
                            </div>
                        ) : (
                            <div className="w-full h-full bg-white">
                                <MobilePdfPreview
                                    questions={questions}
                                    projectName={project.name}
                                    settings={project.settings}
                                    userRole={userRole}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
