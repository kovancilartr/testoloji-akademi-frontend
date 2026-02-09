"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    FunctionSquare
} from "lucide-react";
import { useQuestionEditor } from "@/hooks/useQuestionEditor";
import { EditorHeader } from "./question-editor/EditorHeader";
import { EditorSidebar } from "./question-editor/EditorSidebar";
import { EditorPreview } from "./question-editor/EditorPreview";
import { EditorFloatingActions } from "./question-editor/EditorFloatingActions";
import { EditorGuideModal } from "./question-editor/EditorGuideModal";

interface QuestionEditorDialogProps {
    projectId: string;
    onQuestionAdded?: (question: any) => void;
    onBeforeOpen?: () => boolean;
    onClose?: () => void;
}

export default function QuestionEditorDialog({ projectId, onQuestionAdded, onBeforeOpen, onClose }: QuestionEditorDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const [activeView, setActiveView] = useState<'editor' | 'preview'>('editor');

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open && onClose) onClose();
    };

    const handleOpenClick = (e: React.MouseEvent) => {
        if (onBeforeOpen) {
            const allowed = onBeforeOpen();
            if (!allowed) return;
        }
        setIsOpen(true);
    };
    const {
        content, setContent,
        currentAns, setCurrentAns,
        currentDiff, setCurrentDiff,
        uploading,
        previewRef,
        insertMath,
        handleUpload
    } = useQuestionEditor(projectId, onQuestionAdded);

    const handleClose = () => {
        setIsOpen(false);
        if (onClose) onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <Button
                variant="outline"
                onClick={handleOpenClick}
                className="cursor-pointer border-brand-200 text-brand-600 hover:bg-brand-50 rounded-xl h-10 px-4 font-black text-xs gap-2"
            >
                <FunctionSquare className="h-4 w-4" />
                Soru Editörü (Beta)
            </Button>
            <DialogPortal>
                <DialogOverlay className="z-[150]" />
                <DialogContent className="!max-w-[100vw] w-full sm:w-[1400px] h-full sm:h-[90vh] p-0 overflow-hidden border-none shadow-2xl rounded-none sm:rounded-[2.5rem] bg-white flex flex-col z-[150]">

                    <EditorHeader
                        onClose={handleClose}
                        guideModal={<EditorGuideModal />}
                    />

                    <div className="flex-1 flex overflow-hidden relative pb-16 lg:pb-0">
                        <div className={`flex-1 ${activeView === 'editor' ? 'flex' : 'hidden lg:flex'} h-full lg:max-w-[500px]`}>
                            <EditorSidebar
                                content={content}
                                setContent={setContent}
                                insertMath={insertMath}
                            />
                        </div>

                        <div className={`flex-1 bg-gray-100/50 flex flex-col overflow-hidden relative ${activeView === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
                            <EditorPreview
                                content={content}
                                previewRef={previewRef}
                            />

                            <EditorFloatingActions
                                content={content}
                                currentAns={currentAns}
                                setCurrentAns={setCurrentAns}
                                currentDiff={currentDiff}
                                setCurrentDiff={setCurrentDiff}
                                uploading={uploading}
                                handleUpload={() => handleUpload(handleClose)}
                            />
                        </div>

                        {/* Mobile View Switcher */}
                        <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-[280px]">
                            <div className="bg-gray-900/90 backdrop-blur-xl border border-white/10 p-1 rounded-2xl shadow-2xl flex items-center gap-1">
                                <button
                                    onClick={() => setActiveView('editor')}
                                    className={`flex-1 h-9 rounded-xl flex items-center justify-center gap-2 transition-all ${activeView === 'editor' ? 'bg-brand-500 text-white shadow-lg' : 'text-gray-400'}`}
                                >
                                    <span className="text-[9px] font-black uppercase tracking-widest">Editör</span>
                                </button>
                                <button
                                    onClick={() => setActiveView('preview')}
                                    className={`flex-1 h-9 rounded-xl flex items-center justify-center gap-2 transition-all ${activeView === 'preview' ? 'bg-brand-500 text-white shadow-lg' : 'text-gray-400'}`}
                                >
                                    <span className="text-[9px] font-black uppercase tracking-widest">Önizleme</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
