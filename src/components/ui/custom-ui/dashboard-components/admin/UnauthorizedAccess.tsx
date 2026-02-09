"use client";

import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const UnauthorizedAccess = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center space-y-6">
            <div className="bg-red-50 p-6 rounded-[2rem] shadow-xl shadow-red-500/10">
                <Shield className="h-16 w-16 text-red-500" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Yetkisiz Erişim</h1>
            <p className="text-gray-500 font-bold max-w-sm">Bu sayfaya erişmek için yönetici yetkisine sahip olmanız gerekmektedir.</p>
            <Link href="/dashboard">
                <Button className="bg-gray-900 hover:bg-black text-white rounded-2xl px-12 h-14 font-black shadow-2xl transition-all hover:scale-105">
                    Panele Dön
                </Button>
            </Link>
        </div>
    );
};
