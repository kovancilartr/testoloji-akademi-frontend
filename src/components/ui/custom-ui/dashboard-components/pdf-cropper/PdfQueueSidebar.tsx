import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Layers,
    FileUp,
    Loader2,
    Plus,
    Trash2
} from "lucide-react";
import { PendingQuestion } from "@/types/pdf-cropper";

interface PdfQueueSidebarProps {
    pendingQuestions: PendingQuestion[];
    setPendingQuestions: React.Dispatch<React.SetStateAction<PendingQuestion[]>>;
    uploading: boolean;
    handleBatchUpload: () => void;
}

export function PdfQueueSidebar({
    pendingQuestions,
    setPendingQuestions,
    uploading,
    handleBatchUpload
}: PdfQueueSidebarProps) {
    return (
        <div className="w-full sm:w-80 sm:border-r border-gray-100 flex flex-col bg-gray-50/30 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-brand-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Soru Kuyruğu</span>
                    </div>
                    <Badge className="bg-brand-500 text-white font-black rounded-lg border-none">
                        {pendingQuestions.length}
                    </Badge>
                </div>

                <Button
                    disabled={pendingQuestions.length === 0 || uploading}
                    onClick={handleBatchUpload}
                    className="w-full h-11 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-black text-[10px] uppercase gap-2 shadow-xl shadow-brand-500/20 transition-all active:scale-95 disabled:bg-gray-200 disabled:shadow-none"
                >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
                    {uploading ? "Yükleniyor..." : "Seçilenleri Yükle"}
                </Button>
            </div>

            <div className="flex-1 min-h-0 h-full overflow-y-auto p-4 custom-scrollbar">
                <div className="space-y-3">
                    {pendingQuestions.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                                <Plus className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-[9px] font-black uppercase text-gray-500">Henüz soru seçilmedi</p>
                        </div>
                    ) : (
                        pendingQuestions.map((q, idx) => (
                            <div key={q.id} className="group relative bg-white border border-gray-100 rounded-2xl p-2 pr-10 shadow-sm hover:border-brand-200 transition-all animate-in slide-in-from-left duration-300">
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 rounded-lg bg-gray-50 overflow-hidden flex items-center justify-center border border-gray-100">
                                        <img src={q.previewUrl} className="max-w-full max-h-full object-contain" alt="Preview" />
                                    </div>
                                    <div className="flex flex-col justify-center gap-1.5">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Soru #{idx + 1}</span>
                                        <span className="text-[10px] font-black text-gray-900 truncate max-w-[120px] uppercase">P:{q.page} - {q.pdfName}</span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50"
                                    onClick={() => setPendingQuestions(prev => prev.filter(item => item.id !== q.id))}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
