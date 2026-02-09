import React from "react";
import { Button } from "@/components/ui/button";
import {
    Maximize2,
    FileText,
    Plus,
    X,
    ZoomIn,
    ZoomOut
} from "lucide-react";
import { LoadedPdf } from "@/types/pdf-cropper";

interface PdfSettingsSidebarProps {
    autoFocus: boolean;
    setAutoFocus: (val: boolean) => void;
    renderQuality: number;
    setRenderQuality: (val: number) => void;
    pdfs: LoadedPdf[];
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClose?: () => void;
    scale?: number;
    setScale?: React.Dispatch<React.SetStateAction<number>>;
}

export function PdfSettingsSidebar({
    autoFocus,
    setAutoFocus,
    renderQuality,
    setRenderQuality,
    pdfs,
    fileInputRef,
    onFileChange,
    onClose,
    scale = 1,
    setScale
}: PdfSettingsSidebarProps) {
    return (
        <div className="w-full sm:w-80 h-full bg-white border-l border-gray-100 p-6 sm:p-8 flex flex-col gap-6 sm:gap-8 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between">
                <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-gray-900">Araç Ayarları</h3>
                <Button
                    variant="ghost" size="icon"
                    className="sm:hidden h-8 w-8 rounded-lg text-gray-400"
                    onClick={onClose}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="space-y-4 sm:space-y-6">

                {/* Auto Focus (Visible when accessed via mobile settings) - Akıllı Odak (Mıknatıs Etkisi) */}
                <div
                    onClick={() => setAutoFocus(!autoFocus)}
                    className={`p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 transition-all cursor-pointer flex items-center gap-3 sm:gap-4 ${autoFocus ? 'bg-brand-500 border-brand-500 text-white shadow-xl shadow-brand-500/20' : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-brand-200'}`}
                >
                    <div className={`p-2 sm:p-2.5 rounded-xl ${autoFocus ? 'bg-white/20 text-white' : 'bg-white text-gray-400'}`}>
                        <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">Akıllı Odak</p>
                        <p className={`text-[8px] sm:text-[9px] font-bold ${autoFocus ? 'text-white/80' : 'text-gray-400'}`}>Mıknatıs Etkisi</p>
                    </div>
                    {autoFocus && <div className="h-2 w-2 rounded-full bg-white animate-pulse" />}
                </div>

                {/* Zoom Controls (Visible when accessed via mobile settings) - Görünüm Ölçeği (25% - 500%) */}
                {setScale && (
                    <div className="p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] bg-gray-50 border-2 border-gray-100 text-gray-500 space-y-3 sm:space-y-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2 sm:p-2.5 rounded-xl bg-white shadow-sm text-brand-500">
                                <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">Görünüm Ölçeği</p>
                            </div>
                            <span className="text-[10px] font-black">{Math.round(scale * 100)}%</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm w-full">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg hover:bg-gray-100 shrink-0"
                                onClick={() => setScale(s => Math.max(0.25, s - 0.25))}
                            >
                                <ZoomOut className="h-4 w-4 text-gray-500" />
                            </Button>
                            <input
                                type="range"
                                min="25"
                                max="500"
                                step="25"
                                value={scale * 100}
                                onChange={(e) => setScale(parseInt(e.target.value) / 100)}
                                className="flex-1 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-500 min-w-0"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg hover:bg-gray-100 shrink-0"
                                onClick={() => setScale(s => Math.min(5, s + 0.25))}
                            >
                                <ZoomIn className="h-4 w-4 text-gray-500" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Render Quality (Visible when accessed via mobile settings) - Render Kalitesi (Düşük, Yüksek, HD+) */}
                <div className="p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] bg-gray-50 border-2 border-gray-100 text-gray-500 space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2 sm:p-2.5 rounded-xl bg-white shadow-sm text-brand-500">
                            <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">Render Kalitesi</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1 bg-gray-200/50 p-1 rounded-xl">
                        {[
                            { id: 1, label: 'DÜŞÜK' },
                            { id: 2, label: 'YÜKSEK' },
                            { id: 3, label: 'HD+' }
                        ].map((q) => (
                            <button
                                key={q.id}
                                onClick={() => setRenderQuality(q.id)}
                                className={`py-1.5 sm:py-2 rounded-lg text-[8px] font-black transition-all ${renderQuality === q.id
                                    ? 'bg-white text-brand-600 shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-white/30'
                                    }`}
                            >
                                {q.label}
                            </button>
                        ))}
                    </div>
                    <p className="text-[8px] font-bold text-gray-400 text-center uppercase tracking-tighter">
                        {renderQuality === 1 ? "Hızlı render, standart netlik" : renderQuality === 2 ? "Daha keskin metinler ve çizgiler" : "Maksimum detay ve baskı kalitesi"}
                    </p>
                </div>
            </div>

            <div className="mt-auto pt-6 sm:pt-8 border-t border-gray-50 space-y-3 sm:space-y-4">
                <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">
                    {pdfs.length} Aktif PDF Dokümanı
                </p>
                <Button
                    variant="outline"
                    className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] uppercase gap-2 sm:gap-3 border-2 border-gray-100 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-600 transition-all font-black"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Plus className="h-4 w-4" /> YENİ PDF EKLE
                </Button>
            </div>
        </div>
    );
}
