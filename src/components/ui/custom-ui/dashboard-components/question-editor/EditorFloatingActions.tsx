import React from "react";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    CornerDownLeft
} from "lucide-react";

interface EditorFloatingActionsProps {
    content: string;
    currentAns: string | null;
    setCurrentAns: (ans: string | null) => void;
    currentDiff: number;
    setCurrentDiff: (diff: number) => void;
    uploading: boolean;
    handleUpload: () => void;
}

export function EditorFloatingActions({
    content,
    currentAns,
    setCurrentAns,
    currentDiff,
    setCurrentDiff,
    uploading,
    handleUpload
}: EditorFloatingActionsProps) {
    return (
        <div className="absolute bottom-16 sm:bottom-20 lg:bottom-6 inset-x-0 px-4 sm:px-8 pointer-events-none z-20">
            <div className="max-w-[750px] mx-auto bg-white/95 backdrop-blur-xl border border-white p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl ring-1 ring-black/5 flex flex-col lg:flex-row items-center gap-3 sm:gap-6 pointer-events-auto">
                <div className="flex lg:flex-col items-center lg:items-start justify-between lg:justify-center w-full lg:w-auto gap-1 pl-2">
                    <span className="text-[9px] sm:text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none">Soru Künyesi</span>
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter hidden lg:block">Yükleme Öncesi</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1 items-center w-full">
                    <div className="flex items-center gap-2 bg-gray-100/50 p-1 rounded-xl border border-gray-100 w-full sm:w-auto">
                        <span className="text-[8px] font-black text-gray-400 pl-2">CEVAP</span>
                        <div className="flex gap-0.5 flex-1 justify-center sm:justify-start">
                            {['A', 'B', 'C', 'D', 'E'].map((ans) => (
                                <button
                                    key={ans}
                                    onClick={() => setCurrentAns(currentAns === ans ? null : ans)}
                                    className={`w-7 h-7 sm:w-7 sm:h-7 rounded-lg text-[10px] font-black transition-all ${currentAns === ans ? 'bg-brand-500 text-white shadow-md' : 'text-gray-400 hover:bg-white'}`}
                                >
                                    {ans}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-100/50 p-1 rounded-xl border border-gray-100 w-full flex-1">
                        <span className="text-[8px] font-black text-gray-400 pl-2 shrink-0">ZORLUK</span>
                        <div className="flex gap-0.5 flex-1 overflow-x-auto no-scrollbar justify-center sm:justify-start">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                                const isActive = currentDiff === num;
                                return (
                                    <button
                                        key={num}
                                        onClick={() => setCurrentDiff(num)}
                                        className={`flex-1 min-w-[20px] h-7 rounded-lg text-[9px] font-black transition-all ${isActive ? 'bg-brand-500 text-white shadow-md' : 'text-gray-400 hover:bg-white'}`}
                                    >
                                        {num}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleUpload}
                    disabled={uploading || !content.trim()}
                    className="w-full lg:w-auto bg-brand-500 hover:bg-brand-600 text-white rounded-xl sm:rounded-2xl px-6 h-10 sm:h-12 font-black text-[10px] sm:text-xs gap-3 shadow-xl transition-all active:scale-95 shrink-0"
                >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>YÜKLE <CornerDownLeft className="h-4 w-4" /></>}
                </Button>
            </div>
        </div>
    );
}
