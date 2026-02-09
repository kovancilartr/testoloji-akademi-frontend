"use client";

import React, { useEffect, useState, useMemo } from "react";
import { PDFViewer, BlobProvider } from "@react-pdf/renderer";
import { PDFDocument } from "@/components/pdf/PDFTemplate";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Loader2, Eye } from "lucide-react";

interface MobilePdfPreviewProps {
    questions: any[];
    projectName: string;
    settings: any;
    userRole?: string;
}

// Separate component for the actual PDF Viewer to minimize re-renders
const StablePdfViewer = React.memo(({ questions, projectName, settings, userRole }: MobilePdfPreviewProps) => {
    // Stable key that only changes when the actual content REALLY changes
    const memoKey = useMemo(() => {
        const qSignature = questions.map(q => `${q.id}-${q.difficulty}-${q.correctAnswer}-${q.bottomSpacing}`).join('|');
        return `${qSignature}-${JSON.stringify(settings)}`;
    }, [questions, settings]);

    return (
        <PDFViewer key={memoKey} className="w-full h-full border-none" showToolbar={true}>
            <PDFDocument
                questions={questions}
                projectName={projectName}
                settings={settings}
                userRole={userRole}
            />
        </PDFViewer>
    );
});

export function MobilePdfPreview({
    questions,
    projectName,
    settings,
    userRole
}: MobilePdfPreviewProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const memoKey = useMemo(() => {
        const qSignature = questions.map(q => `${q.id}-${q.difficulty}-${q.correctAnswer}-${q.bottomSpacing}`).join('|');
        return `${qSignature}-${JSON.stringify(settings)}`;
    }, [questions, settings]);

    if (!isMobile) {
        return (
            <div className="w-full h-full bg-gray-50 flex flex-col">
                <StablePdfViewer
                    questions={questions}
                    projectName={projectName}
                    settings={settings}
                    userRole={userRole}
                />
            </div>
        );
    }

    return (
        <div className="w-full h-full p-4 bg-gray-50 flex items-center justify-center">
            <BlobProvider
                key={memoKey}
                document={
                    <PDFDocument
                        questions={questions}
                        projectName={projectName}
                        settings={settings}
                        userRole={userRole}
                    />
                }
            >
                {({ url, loading }) => (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="relative">
                            <div className="w-20 h-20 bg-brand-50 rounded-[2rem] flex items-center justify-center text-brand-500 shadow-inner">
                                <FileText className={`h-10 w-10 ${loading ? 'animate-pulse' : ''}`} />
                            </div>
                            {loading && (
                                <div className="absolute -bottom-2 -right-2">
                                    <Loader2 className="h-6 w-6 text-brand-500 animate-spin" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                                {loading ? "Döküman Hazırlanıyor..." : "Önizleme Hazır"}
                            </h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter leading-relaxed max-w-[200px]">
                                Mobil cihazlarda PDF'i harici ekranında görüntülemek daha performanslıdır.
                            </p>
                        </div>

                        <Button
                            disabled={loading || !url}
                            onClick={() => url && window.open(url, '_blank')}
                            className="bg-brand-500 hover:bg-brand-600 text-white rounded-2xl px-10 h-12 font-black text-xs gap-3 shadow-xl shadow-brand-500/20 transition-all active:scale-95 group"
                        >
                            <Eye className="h-4 w-4" />
                            PDF'İ AÇ
                            <ExternalLink className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </Button>
                    </div>
                )}
            </BlobProvider>
        </div>
    );
}
