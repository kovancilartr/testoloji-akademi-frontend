"use client";

import { Folder } from "lucide-react";

interface EmptyStateProps {
    searchTerm: string;
}

export const EmptyState = ({ searchTerm }: EmptyStateProps) => {
    return (
        <div className="col-span-full py-20 bg-white/40 rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center">
                <Folder className="h-8 w-8 text-gray-200" />
            </div>
            <div className="space-y-1">
                <h3 className="text-lg font-black text-gray-900">
                    {searchTerm ? 'Sonuç Bulunamadı' : 'Henüz Proje Yok'}
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest max-w-xs">
                    {searchTerm ? 'Aradığınız kriterlere uygun bir dosya bulunamadı.' : 'Yeni bir proje oluşturarak başlayın.'}
                </p>
            </div>
        </div>
    );
};
