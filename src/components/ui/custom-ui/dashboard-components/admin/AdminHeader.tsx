"use client";

import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface AdminHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export const AdminHeader = ({ searchTerm, onSearchChange }: AdminHeaderProps) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white shadow-sm hover:bg-gray-50 border border-gray-100">
                        <ArrowLeft className="h-5 w-5 text-gray-400" />
                    </Button>
                </Link>
                <div className="space-y-1">
                    <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-gray-900 leading-none">
                        KULLANICI YÖNETİMİ
                    </h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">
                        Platformdaki tüm hesapları kontrol edin ve yetkilendirin
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                    <Input
                        placeholder="E-posta veya isim ara..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 h-11 w-48 sm:w-80 rounded-xl border-gray-100 bg-white shadow-sm font-bold text-xs focus-visible:ring-4 focus-visible:ring-brand-500/10 focus-visible:border-brand-500 transition-all"
                    />
                </div>
            </div>
        </div>
    );
};
