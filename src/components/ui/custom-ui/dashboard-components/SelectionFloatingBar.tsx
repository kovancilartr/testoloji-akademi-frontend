"use client";

import { BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SelectionFloatingBarProps {
    selectedCount: number;
    onClear: () => void;
    onMergeOpen: () => void;
}

export const SelectionFloatingBar = ({ selectedCount, onClear, onMergeOpen }: SelectionFloatingBarProps) => {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[40] w-full max-w-2xl px-4 animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-gray-900 rounded-[2rem] p-4 shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-xl bg-gray-900/90">
                <div className="flex items-center gap-4 pl-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white font-black shadow-lg shadow-brand-500/20">
                        {selectedCount}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-white font-black text-sm leading-none">Dosya Seçildi</p>
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mt-1">Kitap oluşturmaya hazır</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClear}
                        className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl font-bold text-xs"
                    >
                        Seçimi Temizle
                    </Button>
                    <Button
                        onClick={onMergeOpen}
                        className="bg-white hover:bg-gray-100 text-gray-900 rounded-xl px-6 h-12 font-black gap-2 shadow-xl active:scale-95 transition-all text-xs"
                    >
                        <BookMarked className="h-4 w-4" />
                        Kitabı Oluştur
                    </Button>
                </div>
            </div>
        </div>
    );
};
