"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import * as pdfjs from "pdfjs-dist";
import ReactCrop, { PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    ChevronLeft,
    ChevronRight,
    Check,
    Trash2,
    Crop as CropIcon,
    Plus,
    X,
    Wand2,
    Scan
} from "lucide-react";
import { convertToPixelCrop, convertToPercentCrop } from "react-image-crop";
import { toast } from "sonner";
import { detectQuestionBlocks } from "@/lib/opencv-utils";
import { usePdfCropper } from "@/hooks/usePdfCropper";
import { PdfHeader } from "./pdf-cropper/PdfHeader";
import { PdfQueueSidebar } from "./pdf-cropper/PdfQueueSidebar";
import { PdfActionArea } from "./pdf-cropper/PdfActionArea";
import { PdfSettingsSidebar } from "./pdf-cropper/PdfSettingsSidebar";
import { getAutoFocusedCrop, convertToPercent } from "@/lib/pdf-utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../../tooltip";

// Set PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfCropperDialogProps {
    projectId: string;
    onQuestionAdded?: (question: any) => void;
    onBeforeOpen?: () => boolean;
    onClose?: () => void;
}

export default function PdfCropperDialog({ projectId, onQuestionAdded, onBeforeOpen, onClose }: PdfCropperDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mobileView, setMobileView] = useState<'pdf' | 'queue'>('pdf');
    const [cropMode, setCropMode] = useState<'crop' | 'pan'>('crop');

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
        pdfs, setActivePdfIndex, activePdfIndex,
        currentPage, setCurrentPage,
        scale, setScale,
        loading, uploading,
        crop, setCrop,
        completedCrop, setCompletedCrop,
        pendingQuestions, setPendingQuestions,
        currentAns, setCurrentAns,
        currentDiff, setCurrentDiff,
        autoFocus, setAutoFocus,
        renderQuality, setRenderQuality,
        showSettings, setShowSettings,
        canvasRef, viewportRef,
        activePdf,
        handleFileLoad,
        handleFitToWidth,
        renderPage,
        addToQueue,
        handleBatchUpload,
        handleQuickSelect,
        applyFilter,
        setApplyFilter,
        // Magic Scan
        handleMagicScan,
        isScanning,
        detectedRects,
        setDetectedRects,
        isMagicMode,
        setIsMagicMode
    } = usePdfCropper(projectId, onQuestionAdded);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileLoad(file);
    };

    useEffect(() => {
        if (activePdf && isOpen) {
            const timer = setTimeout(() => {
                const multiplier = renderQuality === 1 ? 1 : renderQuality === 2 ? 1.5 : 2.5;
                renderPage(currentPage, scale, multiplier);
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [activePdf, currentPage, scale, renderPage, isOpen, renderQuality]);

    const onCropComplete = useCallback(async (c: PixelCrop) => {
        console.log("✂️ onCropComplete triggered. isMagicMode:", isMagicMode);

        if (!canvasRef.current) return;

        // Ignore tiny accidental crops
        if (c.width < 5 || c.height < 5) {
            setCompletedCrop(undefined);
            return;
        }

        // --- MAGIC MODE: ROI SCAN ---
        if (isMagicMode) {
            try {
                toast.loading("Bölge taranıyor...", { id: "magic-scan" });

                // Get canvas blob
                const blob = await new Promise<Blob | null>(resolve => canvasRef.current!.toBlob(resolve, 'image/png'));
                if (!blob) throw new Error("Canvas error");

                const file = new File([blob], "scan.png", { type: "image/png" });

                // Get scale factors (Canvas vs Natural)
                // canvas.width is the Actual Resolution
                // canvas.clientWidth is the Display Size
                // The crop 'c' comes in pixel units relative to Display Size (thanks to react-image-crop)
                // BUT we need to send coordinates relative to the Actual Resolution for the backend?
                // Actually wait... react-image-crop (PixelCrop) returns coords relative to the IMAGE (if configured correctly)
                // Let's look at how setCompletedCrop uses it below:
                // x: c.x * scaleX (where scaleX = canvas.width / canvas.clientWidth)
                // This means 'c' is in DISPLAY pixels. 
                // So we need to convert 'c' to ACTUAL CANVAS pixels for the backend.

                const scaleX = canvasRef.current.width / canvasRef.current.clientWidth;
                const scaleY = canvasRef.current.height / canvasRef.current.clientHeight;

                // Call Magic Scan with ROI (in Actual Pixels)
                const rects = await detectQuestionBlocks(file, {
                    x: Math.round(c.x * scaleX),
                    y: Math.round(c.y * scaleY),
                    width: Math.round(c.width * scaleX),
                    height: Math.round(c.height * scaleY)
                });

                if (rects.length > 0) {
                    setDetectedRects(rects);
                    toast.success(`${rects.length} soru bulundu!`, { id: "magic-scan" });
                } else {
                    toast.warning("Bu alanda soru bulunamadı.", { id: "magic-scan" });
                }

            } catch (error) {
                console.error("Magic ROI Error:", error);
                toast.error("Tarama hatası", { id: "magic-scan" });
            } finally {
                // Reset mode and selection but KEEP the rects
                setIsMagicMode(false);
                setCrop(undefined);
                setCompletedCrop(undefined);
            }
            return;
        }

        // --- NORMAL MODE ---
        if (autoFocus && c.width > 10 && c.height > 10) {
            const snapped = getAutoFocusedCrop(canvasRef.current, c);
            setCrop(convertToPercentCrop(snapped, canvasRef.current.clientWidth, canvasRef.current.clientHeight));

            const scaleX = canvasRef.current.width / canvasRef.current.clientWidth;
            const scaleY = canvasRef.current.height / canvasRef.current.clientHeight;
            setCompletedCrop({
                unit: 'px',
                x: snapped.x * scaleX,
                y: snapped.y * scaleY,
                width: snapped.width * scaleX,
                height: snapped.height * scaleY
            });
        } else {
            const scaleX = canvasRef.current.width / canvasRef.current.clientWidth;
            const scaleY = canvasRef.current.height / canvasRef.current.clientHeight;
            setCompletedCrop({
                unit: 'px',
                x: c.x * scaleX,
                y: c.y * scaleY,
                width: c.width * scaleX,
                height: c.height * scaleY
            });
        }
    }, [isMagicMode, activePdf, autoFocus, convertToPercentCrop, canvasRef, setCompletedCrop, toast, detectQuestionBlocks, setIsMagicMode, setCrop, getAutoFocusedCrop, setDetectedRects]);

    const handleRectClick = (rect: any, index: number) => {
        if (!canvasRef.current) return;

        // Remove from the detected list so it becomes the 'active crop'
        setDetectedRects(prev => prev.filter((_, i) => i !== index));

        const canvas = canvasRef.current;
        const scaleX = canvas.clientWidth / canvas.width;
        const scaleY = canvas.clientHeight / canvas.height;

        const displayRect = {
            unit: 'px' as const,
            x: rect.x * scaleX,
            y: rect.y * scaleY,
            width: rect.width * scaleX,
            height: rect.height * scaleY
        };

        const percentCrop = convertToPercentCrop(displayRect, canvas.clientWidth, canvas.clientHeight);
        setCrop(percentCrop);

        setCompletedCrop({
            unit: 'px',
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height
        });
    };

    const handleRemoveRect = (index: number) => {
        setDetectedRects(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter" && completedCrop && isOpen) {
                e.preventDefault();
                addToQueue();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [completedCrop, isOpen, addToQueue]);

    // Calculate popup position based on crop
    const getPopupPosition = () => {
        if (!completedCrop || !canvasRef.current || !crop) return {};

        // crop is in percent or pixel relative to the display size
        const canvas = canvasRef.current;

        // If crop is percent, convert to pixels for display positioning
        let cropX = crop.unit === '%' ? (crop.x / 100) * canvas.clientWidth : crop.x;
        let cropY = crop.unit === '%' ? (crop.y / 100) * canvas.clientHeight : crop.y;
        let cropH = crop.unit === '%' ? (crop.height / 100) * canvas.clientHeight : crop.height;
        let cropW = crop.unit === '%' ? (crop.width / 100) * canvas.clientWidth : crop.width;

        // Position below the selection
        const top = cropY + cropH + 10;
        const left = cropX + (cropW / 2);

        return {
            top: `${top}px`,
            left: `${left}px`,
            transform: 'translateX(-50%)'
        };
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <Button
                variant="outline"
                onClick={handleOpenClick}
                className="cursor-pointer border-brand-200 text-brand-600 hover:bg-brand-50 rounded-xl h-10 px-4 font-black text-xs gap-2"
            >
                <CropIcon className="h-4 w-4" />
                <span className="hidden sm:inline dialog-text-span">PDF'den Soru Seç</span>
            </Button>
            <DialogPortal>
                <DialogOverlay className="z-[150]" />
                <DialogContent className="!max-w-[100vw] w-full sm:w-[1600px] h-full sm:h-[95vh] p-0 overflow-hidden border-none shadow-2xl rounded-none sm:rounded-[2.5rem] bg-white flex flex-col z-[150]">

                    <div className="relative z-[160]">
                        <PdfHeader
                            activePdf={activePdf}
                            pdfs={pdfs}
                            activePdfIndex={activePdfIndex}
                            setActivePdfIndex={setActivePdfIndex}
                            setCurrentPage={setCurrentPage}
                            scale={scale}
                            setScale={setScale}
                            handleFitToWidth={handleFitToWidth}
                            showSettings={showSettings}
                            setShowSettings={setShowSettings}
                            setIsOpen={handleOpenChange}
                            fileInputRef={fileInputRef}
                            onMagicScan={handleMagicScan}
                            isScanning={isScanning}
                            isMagicMode={isMagicMode}
                        />
                    </div>

                    <div className="flex-1 flex overflow-hidden relative">
                        {/* Mobile View Switcher & Tools */}
                        {activePdf && !showSettings && (
                            <>
                                {/* Bottom Tool Bar (Crop/Pan/Auto/Magic) */}
                                <div className={`sm:hidden absolute bottom-18 left-2 z-[165] flex flex-col gap-2 ${mobileView === 'queue' ? 'hidden' : ''}`}>
                                    <div className="bg-white/90 backdrop-blur-xl border border-gray-200 p-1.5 rounded-xl shadow-xl flex flex-col gap-2">
                                        <button
                                            onClick={() => setCropMode('crop')}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${cropMode === 'crop' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'text-gray-400 hover:text-brand-500 hover:bg-brand-50'}`}
                                            title="Kırpma Modu"
                                        >
                                            <CropIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => setCropMode('pan')}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${cropMode === 'pan' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'text-gray-400 hover:text-brand-500 hover:bg-brand-50'}`}
                                            title="Kaydırma Modu"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M19 9l3 3-3 3M15 19l-3 3-3-3M2 12h20M12 2v20" /></svg>
                                        </button>
                                        <button
                                            onClick={handleQuickSelect}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all text-gray-400 hover:text-brand-500 hover:bg-brand-50"
                                            title="Otomatik Alan Seç"
                                        >
                                            <Scan className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={handleMagicScan}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isMagicMode || isScanning ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 animate-pulse ring-2 ring-blue-600' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'}`}
                                            title="Sihirli Makas (Magic Scan)"
                                        >
                                            <Wand2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Main View Params Switcher */}
                                {!completedCrop && (
                                    <div className={`sm:hidden absolute bottom-18 left-1/2 -translate-x-1/2 z-[165] px-4 w-full max-w-[280px] transition-all duration-300`}>
                                        <div className="bg-gray-900/95 backdrop-blur-xl border border-white/20 p-1 rounded-2xl shadow-2xl flex items-center gap-1 overflow-hidden transition-all duration-300">
                                            <button
                                                onClick={() => setMobileView('pdf')}
                                                className={`flex-1 h-10 rounded-xl flex items-center justify-center gap-2 transition-all ${mobileView === 'pdf' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'text-gray-400 hover:text-white'}`}
                                            >
                                                <span className="text-[9px] font-black uppercase tracking-widest">PDF Görünümü</span>
                                            </button>
                                            <button
                                                onClick={() => setMobileView('queue')}
                                                className={`flex-1 h-10 rounded-xl relative flex items-center justify-center gap-2 transition-all ${mobileView === 'queue' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'text-gray-400 hover:text-white'}`}
                                            >
                                                <span className="text-[9px] font-black uppercase tracking-widest">Soru Kuyruğu</span>
                                                {pendingQuestions.length > 0 && (
                                                    <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[12px] font-black text-white ring-2 ring-gray-900">
                                                        {pendingQuestions.length}
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Queue Sidebar */}
                        <div className={`${(activePdf && mobileView === 'queue' && !showSettings) ? 'flex' : 'hidden sm:flex'} ${(!activePdf || showSettings) ? 'hidden sm:flex' : ''} h-full shrink-0 border-r border-gray-100 flex-1 sm:flex-none`}>
                            <PdfQueueSidebar
                                pendingQuestions={pendingQuestions}
                                setPendingQuestions={setPendingQuestions}
                                uploading={uploading}
                                handleBatchUpload={handleBatchUpload}
                            />
                        </div>

                        {/* PDF View Area */}
                        <div className={`flex-1 flex flex-col relative overflow-hidden ${(!activePdf || mobileView === 'pdf') ? 'flex' : 'hidden sm:flex'}`}>
                            <div ref={viewportRef} className={`flex-1 relative overflow-auto bg-gray-50/30 group/viewport flex p-4 sm:p-20 ${cropMode === 'pan' ? 'touch-pan-x touch-pan-y' : ''}`}>
                                {loading && (
                                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center">
                                        <Loader2 className="h-10 w-10 text-brand-500 animate-spin" />
                                        <p className="mt-4 text-[10px] font-black text-gray-900 uppercase tracking-widest">SAYFA İŞLENİYOR...</p>
                                    </div>
                                )}

                                {!activePdf && !loading && (
                                    <div
                                        className="m-auto max-w-md w-full p-8 sm:p-16 border-4 border-dashed border-gray-200 rounded-[2rem] sm:rounded-[3.5rem] bg-white flex flex-col items-center text-center space-y-4 sm:space-y-6 cursor-pointer hover:border-brand-500/30 hover:bg-brand-50/10 transition-all group shadow-sm"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-brand-50 rounded-[1.5rem] sm:rounded-[2.5rem] flex items-center justify-center text-brand-500 group-hover:scale-110 transition-transform shadow-inner">
                                            <Plus className="h-8 w-8 sm:h-12 sm:w-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-lg sm:text-xl font-black text-gray-900 uppercase tracking-tight">PDF Sürükle veya Seç</h3>
                                            <p className="text-[8px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest">Aynı anda birden fazla PDF ile çalışabilirsiniz</p>
                                        </div>
                                    </div>
                                )}

                                {activePdf && (
                                    <div className={`m-auto relative shadow-[0_0_100px_-20px_rgba(0,0,0,0.2)] border-[4px] sm:border-[8px] border-white rounded-xl sm:rounded-2xl bg-white transition-all duration-500 ${cropMode === 'pan' ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'}`}>
                                        <ReactCrop
                                            crop={crop}
                                            onChange={c => setCrop(c)}
                                            onComplete={onCropComplete}
                                            className="block"
                                            disabled={cropMode === 'pan'}
                                            locked={cropMode === 'pan'}
                                            minWidth={10}
                                            minHeight={10}
                                        >
                                            <canvas ref={canvasRef} className="block rounded-lg" suppressHydrationWarning />

                                            {/* Detected Rectangles Layer */}
                                            {detectedRects.map((rect, i) => {
                                                if (!canvasRef.current) return null;
                                                const canvas = canvasRef.current;
                                                const scaleX = canvas.clientWidth / canvas.width;
                                                const scaleY = canvas.clientHeight / canvas.height;

                                                return (
                                                    <div
                                                        key={`rect-${i}`}
                                                        className="absolute border-2 border-dashed border-blue-500 bg-blue-500/10 hover:bg-blue-500/30 hover:border-solid hover:shadow-xl cursor-pointer transition-all z-20 group"
                                                        style={{
                                                            left: rect.x * scaleX,
                                                            top: rect.y * scaleY,
                                                            width: rect.width * scaleX,
                                                            height: rect.height * scaleY
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent ReactCrop from starting a new crop
                                                            handleRectClick(rect, i);
                                                        }}
                                                        title="Düzenlemek için tıklayın"
                                                    >
                                                        {/* Label */}
                                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                            SORU {i + 1}
                                                        </div>

                                                        {/* Delete Button (Visible on Hover) */}
                                                        <div
                                                            className="absolute -top-3 -right-3 h-6 pl-1.5 pr-2 bg-white border border-rose-100 hover:border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg shadow-sm shadow-rose-500/10 flex items-center justify-center gap-1 cursor-pointer transition-all duration-200 z-30 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 origin-bottom-left"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveRect(i);
                                                            }}
                                                            title="Bu seçimi sil"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                            <span className="text-[9px] font-black uppercase tracking-wider">SİL</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </ReactCrop>

                                        {/* Floating Selection Popup inside Crop Container */}
                                        {completedCrop && (
                                            <div
                                                className="absolute z-[180] animate-in zoom-in-95 duration-200 sm:hidden"
                                                style={getPopupPosition()}
                                            >
                                                <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-2 flex flex-col gap-2 min-w-full">
                                                    <div className="flex items-center justify-between gap-1 bg-gray-50 p-1 rounded-lg">
                                                        {['A', 'B', 'C', 'D', 'E'].map((ans) => (
                                                            <button
                                                                key={ans}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setCurrentAns(currentAns === ans ? null : ans);
                                                                }}
                                                                className={`w-8 h-8 rounded-md text-sm font-black transition-all ${currentAns === ans ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 scale-105' : 'text-gray-400 hover:text-gray-900 hover:bg-white'}`}
                                                            >
                                                                {ans}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setCrop(undefined);
                                                                setCompletedCrop(undefined);
                                                            }}
                                                            size="sm"
                                                            variant="ghost"
                                                            className="flex-1 h-9 text-rose-500 hover:bg-rose-50 hover:text-rose-600 font-black text-xs"
                                                        >
                                                            İPTAL
                                                        </Button>
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addToQueue();
                                                            }}
                                                            size="sm"
                                                            className="flex-[2] h-9 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-black text-xs shadow-lg shadow-brand-500/20"
                                                        >
                                                            TAMAM
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}


                                    </div>
                                )}
                            </div>

                            <div className="hidden sm:block">
                                <PdfActionArea
                                    completedCrop={completedCrop}
                                    setCrop={setCrop}
                                    setCompletedCrop={setCompletedCrop}
                                    currentAns={currentAns}
                                    setCurrentAns={setCurrentAns}
                                    currentDiff={currentDiff}
                                    setCurrentDiff={setCurrentDiff}
                                    addToQueue={addToQueue}
                                    isFilterActive={applyFilter}
                                    setIsFilterActive={setApplyFilter}
                                />
                            </div>

                            {/* Pagination Footer */}
                            {activePdf && (
                                <div className="h-16 sm:h-20 px-4 sm:px-8 border-t border-gray-100 flex items-center justify-center bg-white shrink-0 z-10 pb-4 sm:pb-0">
                                    <div className="flex items-center gap-2 sm:gap-4 scale-90 sm:scale-100">
                                        <Button
                                            variant="ghost" size="icon" className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl hover:bg-gray-50 disabled:opacity-30 border border-gray-100"
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        >
                                            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </Button>

                                        <div className="flex items-center gap-2 px-3 sm:px-6 h-9 sm:h-11 bg-gray-50 rounded-xl sm:rounded-2xl border border-dotted border-gray-300">
                                            <span className="text-[8px] sm:text-[10px] font-black text-gray-900 uppercase tracking-tighter">SAYFA</span>
                                            <input
                                                type="number"
                                                value={currentPage}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    if (val >= 1 && val <= activePdf.numPages) setCurrentPage(val);
                                                }}
                                                className="w-10 sm:w-12 h-6 sm:h-8 bg-white rounded-lg sm:rounded-xl border border-gray-200 text-center text-[10px] sm:text-xs font-black text-brand-500 focus:outline-none"
                                            />
                                            <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-tighter">/ {activePdf.numPages}</span>
                                        </div>

                                        <Button
                                            variant="ghost" size="icon" className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl hover:bg-gray-50 disabled:opacity-30 border border-gray-100"
                                            disabled={currentPage === activePdf.numPages}
                                            onClick={() => setCurrentPage(p => Math.min(activePdf.numPages, p + 1))}
                                        >
                                            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {showSettings && (
                            <div className="absolute inset-0 sm:relative sm:inset-auto z-[170] sm:z-auto bg-white/95 sm:bg-white backdrop-blur-md sm:backdrop-blur-none transition-all">
                                <PdfSettingsSidebar
                                    autoFocus={autoFocus}
                                    setAutoFocus={setAutoFocus}
                                    renderQuality={renderQuality}
                                    setRenderQuality={setRenderQuality}
                                    pdfs={pdfs}
                                    fileInputRef={fileInputRef}
                                    onFileChange={onFileChange}
                                    onClose={() => setShowSettings(false)}
                                    scale={scale}
                                    setScale={setScale}
                                />
                            </div>
                        )}
                    </div>
                </DialogContent>
            </DialogPortal>
            <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf" onChange={onFileChange} />
        </Dialog>
    );
}
