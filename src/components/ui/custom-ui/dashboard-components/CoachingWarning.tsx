"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, X, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useThemeColors } from "@/contexts/ThemeContext";

export function CoachingWarning() {
    const { user } = useAuth();
    const colors = useThemeColors();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show for teachers without coaching access
        if (user?.role === "TEACHER" && !user?.hasCoachingAccess) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [user]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 right-4 z-100 animate-in fade-in slide-in-from-right-4 duration-500 max-w-[320px]">
            <div className="relative group">
                {/* Background Glow */}
                <div className={cn(
                    "absolute -inset-0.5 bg-linear-to-r opacity-30 blur-lg group-hover:opacity-50 transition duration-1000 group-hover:duration-200",
                    colors.gradient
                )}></div>

                <div className="relative bg-white/90 backdrop-blur-xl border border-brand-100 p-4 rounded-2xl shadow-2xl flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg text-white",
                            "bg-linear-to-br", colors.gradient, colors.shadow
                        )}>
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-black text-xs text-gray-900 uppercase tracking-tight">Koçluk Erişimi Gerekli</h4>
                            <div className="h-0.5 w-8 bg-brand-500 rounded-full mt-0.5 opacity-50" />
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <p className="text-[11px] leading-relaxed font-bold text-gray-600">
                        Koçluk hizmetiniz henüz aktif değil. Öğrencilerinizi sisteme ekleyip koçluk verebilmeniz için yönetici ile iletişime geçmelisiniz.
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                                    <div className="w-full h-full bg-gray-200 animate-pulse" />
                                </div>
                            ))}
                        </div>
                        <span className="text-[9px] font-black text-brand-500 uppercase tracking-widest">+500 Akademisyen</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
