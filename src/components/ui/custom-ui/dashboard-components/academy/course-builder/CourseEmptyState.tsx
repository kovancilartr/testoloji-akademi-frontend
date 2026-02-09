"use client";

import { Button } from "@/components/ui/button";
import { Layers, Plus } from "lucide-react";

interface CourseEmptyStateProps {
    onAddModule: () => void;
}

export function CourseEmptyState({ onAddModule }: CourseEmptyStateProps) {
    return (
        <div className="text-center py-24 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm space-y-6 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-orange-50 rounded-3xl flex items-center justify-center text-orange-200 mx-auto transform -rotate-6">
                <Layers className="w-12 h-12" />
            </div>
            <div className="space-y-2 px-6">
                <h3 className="text-2xl font-black text-slate-900">Kursunu İnşa Etmeye Başla</h3>
                <p className="text-slate-500 max-w-sm mx-auto font-medium text-sm md:text-base">
                    Müfredatını bölümlere ayır, içine videolar, testler ve dökümanlar ekleyerek harika bir deneyim oluştur.
                </p>
            </div>
            <Button
                className="bg-orange-500 hover:bg-orange-600 font-black h-12 px-8 rounded-2xl shadow-xl shadow-orange-100 transition-all hover:translate-y-[-2px]"
                onClick={onAddModule}
            >
                <Plus className="w-5 h-5 mr-2" /> İlk Bölümü Oluştur
            </Button>
        </div>
    );
}
