"use client";

import { Eye, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ImagePreviewDialogProps {
    imageUrl: string | null;
    onClose: () => void;
}

export const ImagePreviewDialog = ({ imageUrl, onClose }: ImagePreviewDialogProps) => {
    return (
        <Dialog open={!!imageUrl} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[95vw] sm:max-w-[85vw] lg:max-w-fit bg-white/80 backdrop-blur-2xl border-white/40 p-0 overflow-hidden rounded-[3rem] shadow-2xl border-none outline-none transition-all duration-500 [&>button]:hidden">
                <DialogHeader className="sr-only">
                    <DialogTitle>Soru Önizleme</DialogTitle>
                    <DialogDescription>Seçili sorunun büyük boyuttaki görseli.</DialogDescription>
                </DialogHeader>

                {imageUrl && (
                    <div className="relative flex flex-col group max-h-[92vh]">
                        {/* Premium Modal Header */}
                        <div className="h-16 px-8 flex items-center justify-between z-20 bg-white/40 border-b border-white/20 backdrop-blur-md shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                                    <Eye className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-tight">Soru Detayı</h3>
                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none">Tam Ekran Görünüm</span>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="h-10 w-10 rounded-2xl bg-white/50 hover:bg-white text-gray-400 hover:text-red-500 transition-all shadow-sm ring-1 ring-black/5"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Image Container */}
                        <div className="flex-1 bg-gray-50/50 flex items-center justify-center p-8 sm:p-12 relative overflow-auto custom-scrollbar">
                            <div className="absolute inset-0 opacity-10 pointer-events-none"
                                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #f97316 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                            <div className="relative flex items-center justify-center">
                                <img
                                    src={imageUrl}
                                    className="max-w-[85vw] max-h-[65vh] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-xl animate-in zoom-in-95 duration-300"
                                />
                            </div>
                        </div>

                        {/* Bottom Status Bar */}
                        <div className="bg-white/40 backdrop-blur-md px-8 py-3.5 flex items-center justify-center gap-5 border-t border-white/20 shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Canlı Önizleme Aktif</span>
                            </div>
                            <div className="w-px h-3 bg-gray-200" />
                            <Button
                                onClick={onClose}
                                variant="ghost"
                                className="h-auto p-0 font-black text-[10px] uppercase text-brand-500 hover:text-brand-600 bg-transparent flex items-center gap-1.5"
                            >
                                GERİ DÖN <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
