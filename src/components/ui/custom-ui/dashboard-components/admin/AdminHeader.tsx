"use client";

import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AdminHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    roleFilter: string;
    onRoleFilterChange: (value: string) => void;
    tierFilter: string;
    onTierFilterChange: (value: string) => void;
}

export const AdminHeader = ({
    searchTerm,
    onSearchChange,
    roleFilter,
    onRoleFilterChange,
    tierFilter,
    onTierFilterChange
}: AdminHeaderProps) => {
    return (
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
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

            <div className="flex flex-wrap items-center gap-3">
                {/* Role Filter */}
                <Select value={roleFilter} onValueChange={onRoleFilterChange}>
                    <SelectTrigger className="w-[140px] h-11 rounded-xl border-gray-100 bg-white shadow-sm font-bold text-xs focus:ring-4 focus:ring-brand-500/10 transition-all">
                        <SelectValue placeholder="Rol Seç" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                        <SelectItem value="ALL" className="font-bold text-xs">Tüm Roller</SelectItem>
                        <SelectItem value="ADMIN" className="font-bold text-xs">Yönetici</SelectItem>
                        <SelectItem value="TEACHER" className="font-bold text-xs">Eğitmen</SelectItem>
                        <SelectItem value="STUDENT" className="font-bold text-xs">Öğrenci</SelectItem>
                    </SelectContent>
                </Select>

                {/* Tier Filter */}
                <Select value={tierFilter} onValueChange={onTierFilterChange}>
                    <SelectTrigger className="w-[140px] h-11 rounded-xl border-gray-100 bg-white shadow-sm font-bold text-xs focus:ring-4 focus:ring-brand-500/10 transition-all">
                        <SelectValue placeholder="Paket Seç" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl">
                        <SelectItem value="ALL" className="font-bold text-xs">Tüm Paketler</SelectItem>
                        <SelectItem value="FREE" className="font-bold text-xs">Ücretsiz</SelectItem>
                        <SelectItem value="BRONZ" className="font-bold text-xs">Bronz</SelectItem>
                        <SelectItem value="GUMUS" className="font-bold text-xs">Gümüş</SelectItem>
                        <SelectItem value="ALTIN" className="font-bold text-xs">Altın</SelectItem>
                    </SelectContent>
                </Select>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                    <Input
                        placeholder="E-posta veya isim ara..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 h-11 w-48 sm:w-64 rounded-xl border-gray-100 bg-white shadow-sm font-bold text-xs focus-visible:ring-4 focus-visible:ring-brand-500/10 focus-visible:border-brand-500 transition-all"
                    />
                </div>
            </div>
        </div>
    );
};
