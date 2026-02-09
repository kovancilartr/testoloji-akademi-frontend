import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { PixelCrop } from "react-image-crop";

interface PdfActionAreaProps {
    completedCrop: PixelCrop | undefined;
    setCrop: (crop: any) => void;
    setCompletedCrop: (crop: any) => void;
    currentAns: string | null;
    setCurrentAns: (ans: string | null) => void;
    currentDiff: number | null;
    setCurrentDiff: (diff: number) => void;
    addToQueue: () => void;
    isFilterActive: boolean;
    setIsFilterActive: (active: boolean) => void;
}

export function PdfActionArea({
    completedCrop,
    setCrop,
    setCompletedCrop,
    currentAns,
    setCurrentAns,
    currentDiff,
    setCurrentDiff,
    addToQueue,
    isFilterActive,
    setIsFilterActive
}: PdfActionAreaProps) {
    return (
        <div className={`shrink-0 transition-all duration-500 bg-white border-t border-gray-100 overflow-hidden ${completedCrop ? 'h-auto opacity-100 py-3 sm:py-4' : 'h-0 opacity-0'}`}>
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 flex flex-col xl:flex-row items-center gap-4 xl:gap-8">

                {/* 1. Left Section: Question Info & Cancel */}
                <div className="flex items-center gap-4 w-full xl:w-auto justify-between xl:justify-start">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-tight">Soru Bilgisi</span>
                        <span className="text-[9px] text-gray-400 font-medium">Seçili alan için ayarlar</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setCrop(undefined); setCompletedCrop(undefined); }}
                        className="h-8 px-3 text-[10px] font-black text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl gap-1.5 uppercase tracking-wide border border-red-100 hover:border-red-200"
                    >
                        <X className="h-3.5 w-3.5" /> İPTAL
                    </Button>
                </div>

                {/* 2. Middle Section: Settings Row (Answers + Difficulty + Tools) */}
                <div className="flex flex-col xl:flex-row gap-3 items-stretch xl:items-center w-full xl:w-auto xl:flex-1 justify-center">

                    <div className="flex items-center justify-center gap-3 w-full xl:w-auto">
                        {/* Desktop Filter Button (Separate) */}
                        <button
                            onClick={() => setIsFilterActive(!isFilterActive)}
                            className={`hidden sm:flex h-10 px-3 rounded-xl items-center justify-center gap-2 border transition-all ${isFilterActive
                                ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                                : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                                }`}
                            title="Otomatik Temizle (Magic Wand)"
                        >
                            <div className="relative">
                                <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full border-2 border-white ${isFilterActive ? 'bg-blue-500' : 'hidden'}`} />
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wand-2"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" /><path d="m14 7 3 3" /><path d="M5 6v4" /><path d="M19 14v4" /><path d="M10 2v2" /><path d="M7 8H3" /><path d="M21 16h-4" /><path d="M11 3H9" /></svg>
                            </div>
                            <span className="hidden lg:inline text-[9px] font-black tracking-widest">Soruyu Temizle</span>
                        </button>

                        {/* Answer Selection Details */}
                        <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100 shrink-0 w-full sm:w-auto justify-center">
                            {/* Mobile Filter Button (Integrated) */}
                            <button
                                onClick={() => setIsFilterActive(!isFilterActive)}
                                className={`sm:hidden h-8 w-8 rounded-lg flex items-center justify-center transition-all ${isFilterActive
                                    ? 'bg-white text-blue-600 shadow-sm border border-blue-100'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-white'
                                    }`}
                            >
                                <div className="relative flex items-center justify-center">
                                    <div className={`absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full border border-white ${isFilterActive ? 'bg-blue-500' : 'hidden'}`} />
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wand-2"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" /><path d="m14 7 3 3" /><path d="M5 6v4" /><path d="M19 14v4" /><path d="M10 2v2" /><path d="M7 8H3" /><path d="M21 16h-4" /><path d="M11 3H9" /></svg>
                                </div>
                            </button>
                            <div className="w-px h-6 bg-gray-200 mx-1 sm:hidden"></div>

                            <span className="hidden sm:inline-block text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">CEVAP</span>
                            <div className="flex gap-1 justify-between flex-1 sm:flex-none">
                                {['A', 'B', 'C', 'D', 'E'].map((ans) => (
                                    <button
                                        key={ans}
                                        onClick={() => setCurrentAns(currentAns === ans ? null : ans)}
                                        className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${currentAns === ans ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20 scale-105' : 'text-gray-400 hover:text-gray-700 hover:bg-white'}`}
                                    >
                                        {ans}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Difficulty Selection */}
                    <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100 overflow-x-auto no-scrollbar flex-1 xl:max-w-md w-full">
                        <span className="hidden sm:inline-block text-[9px] font-black text-gray-400 uppercase tracking-widest px-2 shrink-0">ZORLUK</span>
                        <div className="flex gap-1 items-center flex-1 justify-between min-w-[200px]">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                                const isActive = currentDiff === num;
                                const colorClass = num <= 3 ? (isActive ? 'bg-emerald-500' : 'hover:bg-emerald-100')
                                    : num <= 7 ? (isActive ? 'bg-amber-500' : 'hover:bg-amber-100')
                                        : (isActive ? 'bg-rose-500' : 'hover:bg-rose-100');
                                return (
                                    <button
                                        key={num}
                                        onClick={() => setCurrentDiff(num)}
                                        className={`flex-1 min-w-[20px] h-8 rounded-lg text-[10px] font-black transition-all ${isActive ? `${colorClass} text-white shadow-md scale-105` : `text-gray-300 ${colorClass}`}`}
                                    >
                                        {num}
                                    </button>
                                );
                            })}
                        </div>
                        <span className={`text-xs font-black w-6 text-center shrink-0 ${currentDiff && currentDiff <= 3 ? 'text-emerald-500' : currentDiff && currentDiff <= 7 ? 'text-amber-500' : 'text-rose-500'}`}>{currentDiff}</span>
                    </div>

                </div>

                {/* 3. Right Section: Confirm Button */}
                <Button
                    onClick={addToQueue}
                    className="w-full xl:w-auto bg-gray-900 hover:bg-black text-white rounded-xl h-12 px-8 font-black text-xs gap-3 shadow-xl shadow-gray-900/10 transition-all hover:scale-[1.02] active:scale-95 group shrink-0"
                >
                    <span>KUYRUĞA EKLE</span>
                    <div className="flex items-center justify-center bg-white/20 rounded h-5 p-1 min-w-[1.5rem]">
                        <span className="text-[10px] font-bold">↵</span>
                    </div>
                </Button>

            </div>
        </div>
    );
}
