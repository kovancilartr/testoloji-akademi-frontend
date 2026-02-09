"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/types/auth";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

interface RoleProtectProps {
    children: React.ReactNode;
    allowedRoles: Role[];
}

export const RoleProtect = ({ children, allowedRoles }: RoleProtectProps) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center space-y-6 bg-slate-50/50">
                <div className="bg-red-50 p-6 rounded-[2.5rem] shadow-2xl shadow-red-500/10 animate-in zoom-in-50 duration-500">
                    <Shield className="h-20 w-20 text-red-500" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Erişim Yetkiniz Bulunmuyor</h1>
                    <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
                        Bu sayfa sadece öğretmenlerin ve yetkililerin erişimine açıktır.
                    </p>
                </div>
                <div className="pt-4">
                    <Link href="/dashboard">
                        <Button className="bg-slate-900 hover:bg-black text-white rounded-2xl px-12 h-14 font-black shadow-2xl transition-all hover:scale-105 active:scale-95">
                            Ana Sayfaya Dön
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
