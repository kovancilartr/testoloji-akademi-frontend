"use client";

import { Plus, Search, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DashboardSubHeaderProps {
    projectsCount: number;
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    handleCreateClick: () => void;
    isSelectionMode: boolean;
    setIsSelectionMode: (val: boolean) => void;
}

export const DashboardSubHeader = ({
    projectsCount,
    searchTerm,
    setSearchTerm,
    handleCreateClick,
    isSelectionMode,
    setIsSelectionMode
}: DashboardSubHeaderProps) => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
            <div className="space-y-1">
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-gray-900 leading-none">
                    Test Merkezi
                </h1>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-black text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full uppercase tracking-widest">
                        {projectsCount} KLASÖR
                    </span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Dijital Arşiviniz
                    </span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative group flex-1 sm:flex-initial">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                    <Input
                        placeholder="Dosyalarda ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 w-full sm:w-64 rounded-xl border-gray-100 bg-white shadow-sm font-bold text-xs focus-visible:ring-4 focus-visible:ring-brand-500/10 focus-visible:border-brand-500 transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleCreateClick}
                        className="flex-1 cursor-pointer sm:flex-none bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-6 h-11 font-black shadow-lg shadow-brand-500/20 gap-2 text-xs group transition-all"
                    >
                        <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-500" />
                        <span>Yeni Proje</span>
                    </Button>

                    <Button
                        variant={isSelectionMode ? "default" : "outline"}
                        onClick={() => setIsSelectionMode(!isSelectionMode)}
                        className={`flex-1 cursor-pointer sm:flex-none rounded-xl px-4 h-11 font-black gap-2 text-xs transition-all ${isSelectionMode ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-xl' : 'border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Sparkles className={`h-4 w-4 ${isSelectionMode ? 'animate-pulse text-brand-400' : ''}`} />
                        <span>{isSelectionMode ? 'Seçimi Bitir' : 'Kitaplaştır'}</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};
