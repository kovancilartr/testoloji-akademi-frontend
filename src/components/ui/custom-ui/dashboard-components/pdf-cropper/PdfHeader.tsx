import React from "react";
import {
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    ChevronDown,
    Crop as CropIcon,
    Expand,
    FileText,
    Settings2,
    X,
    ZoomIn,
    ZoomOut,
    Plus,
    Check
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadedPdf } from "@/types/pdf-cropper";
import { PdfGuideModal } from "./PdfGuideModal";

interface PdfHeaderProps {
    activePdf: LoadedPdf | null;
    pdfs: LoadedPdf[];
    activePdfIndex: number | null;
    setActivePdfIndex: (index: number) => void;
    setCurrentPage: (page: number) => void;
    scale: number;
    setScale: React.Dispatch<React.SetStateAction<number>>;
    handleFitToWidth: () => void;
    showSettings: boolean;
    setShowSettings: (show: boolean) => void;
    setIsOpen: (open: boolean) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onMagicScan?: () => void;
    isScanning?: boolean;
    isMagicMode?: boolean;
}

export function PdfHeader({
    activePdf,
    pdfs,
    activePdfIndex,
    setActivePdfIndex,
    setCurrentPage,
    scale,
    setScale,
    handleFitToWidth,
    showSettings,
    setShowSettings,
    setIsOpen,
    fileInputRef,
    onMagicScan,
    isScanning,
    isMagicMode
}: PdfHeaderProps) {
    return (
        <div className="h-14 sm:h-16 px-3 sm:px-8 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 z-10 gap-2">
            <div className="flex items-center gap-1.5 sm:gap-6 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                    <div className="p-1.5 sm:p-2 bg-brand-500 rounded-lg sm:rounded-xl shadow-lg shadow-brand-500/20 shrink-0">
                        <CropIcon className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="hidden xs:block truncate">
                        <DialogTitle className="text-[9px] sm:text-sm font-black uppercase tracking-widest whitespace-nowrap">
                            Kırpma
                        </DialogTitle>
                    </div>
                    <PdfGuideModal />
                </div>

                <div className="h-6 sm:h-8 w-px bg-gray-100 hidden sm:block" />

                <div className="flex items-center gap-1.5 min-w-0">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 sm:h-10 rounded-xl px-1.5 sm:px-4 flex items-center gap-1 sm:gap-3 bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all min-w-0">
                                <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-brand-500 shrink-0" />
                                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-tight max-w-[40px] xs:max-w-[70px] sm:max-w-[150px] truncate">
                                    {activePdf ? activePdf.file.name : "Seç"}
                                </span>
                                <ChevronDown className="h-3 w-3 text-gray-400 shrink-0" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[250px] rounded-2xl p-2 shadow-2xl border-gray-100 z-[200]">
                            {pdfs.map((pdf, idx) => (
                                <DropdownMenuItem
                                    key={pdf.id}
                                    onClick={() => {
                                        setActivePdfIndex(idx);
                                        setCurrentPage(1);
                                    }}
                                    className={`rounded-xl p-3 cursor-pointer flex items-center justify-between mb-1 ${activePdfIndex === idx ? 'bg-brand-50 text-brand-600' : 'hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`p-1.5 rounded-lg ${activePdfIndex === idx ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            <FileText className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase truncate">{pdf.file.name}</span>
                                    </div>
                                    {activePdfIndex === idx && <Check className="h-3.5 w-3.5" />}
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuItem
                                onClick={() => fileInputRef.current?.click()}
                                className="rounded-xl p-3 cursor-pointer flex items-center gap-3 text-brand-600 hover:bg-brand-50 font-black uppercase text-[10px]"
                            >
                                <Plus className="h-4 w-4" /> Yeni PDF Ekle
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {activePdf && (
                        <div className="flex items-center gap-2">

                            <div className="hidden sm:flex items-center bg-gray-50 rounded-xl px-0.5 sm:px-2 border border-gray-100 h-8 sm:h-10 shrink-0">
                                <Button
                                    variant="ghost"
                                    className="h-6 sm:h-8 px-1 sm:px-2 rounded-lg gap-1 text-brand-600 hover:bg-brand-100/50 hover:text-brand-700 transition-all font-black text-[8px] sm:text-[9px] uppercase hidden sm:flex"
                                    onClick={handleFitToWidth}
                                >
                                    <Expand className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
                                    <span className="hidden lg:inline">SIĞDIR</span>
                                </Button>
                                <div className="h-4 w-px bg-gray-200 mx-1 hidden sm:block" />
                                <Button variant="ghost" size="icon" className="h-6 sm:h-8 w-6 sm:w-8 rounded-lg" onClick={() => setScale(s => Math.max(0.25, s - 0.25))}>
                                    <ZoomOut className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-gray-500" />
                                </Button>
                                <span className="text-[8px] sm:text-[10px] font-black w-7 sm:w-12 text-center text-gray-600 shrink-0">%{Math.round(scale * 100)}</span>
                                <Button variant="ghost" size="icon" className="h-6 sm:h-8 w-6 sm:w-8 rounded-lg" onClick={() => setScale(s => Math.min(5, s + 0.25))}>
                                    <ZoomIn className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-gray-500" />
                                </Button>
                            </div>

                            {/* Magic Scan Button */}
                            <Button
                                onClick={onMagicScan}
                                disabled={isScanning}
                                className={`hidden sm:flex h-8 sm:h-10 px-3 sm:px-4 rounded-xl items-center gap-2 transition-all shrink-0 ${isScanning
                                    ? 'bg-amber-100 text-amber-600 border-amber-200 animate-pulse'
                                    : isMagicMode
                                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse'
                                        : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02]'
                                    }`}
                            >
                                {isScanning ? (
                                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : isMagicMode ? (
                                    <X className="h-4 w-4" />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scissors"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4 8.12 15.88" /><path d="M14.47 14.48 20 20" /><path d="M8.12 8.12 12 12" /></svg>
                                )}
                                <span className="hidden lg:inline text-[10px] font-black uppercase tracking-widest leading-none">
                                    {isScanning ? 'TARANIYOR...' : isMagicMode ? 'MODU KAPAT' : 'SİHİRLİ MAKAS'}
                                </span>
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <Button
                    variant="ghost" size="icon"
                    className={`h-9 sm:h-10 w-9 sm:w-10 rounded-xl transition-all ${showSettings ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}
                    onClick={() => setShowSettings(!showSettings)}
                >
                    <Settings2 className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                </Button>
                <Button
                    variant="ghost" size="icon"
                    className="h-9 sm:h-10 w-9 sm:w-10 rounded-xl bg-gray-50 text-gray-400 border border-gray-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100"
                    onClick={() => setIsOpen(false)}
                >
                    <X className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                </Button>
            </div>
        </div>
    );
}
