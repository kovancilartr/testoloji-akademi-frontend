"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";

interface FullPageLoaderProps {
    message?: string;
}

export const FullPageLoader = ({ message = "Hazırlanıyor" }: FullPageLoaderProps) => {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-white fixed inset-0 z-[9999]">
            <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
                <div className="relative w-16 h-16 animate-bounce">
                    <Image
                        src="/images/logo2.png"
                        alt="Loading Logo"
                        fill
                        className="object-contain drop-shadow-2xl"
                    />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="font-black text-2xl tracking-tighter text-gray-900 uppercase">Testoloji</span>
                    <div className="flex items-center gap-2 text-brand-500 font-bold text-xs uppercase tracking-[0.3em] ml-1">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {message}
                    </div>
                </div>
            </div>
        </div>
    );
};
