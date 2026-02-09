"use client";

import React, { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";

export function OfflineStatus() {
    const [isOffline, setIsOffline] = useState(false);
    const [showOnline, setShowOnline] = useState(false);

    useEffect(() => {
        const handleOffline = () => setIsOffline(true);
        const handleOnline = () => {
            setIsOffline(false);
            setShowOnline(true);
            setTimeout(() => setShowOnline(false), 3000);
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if (isOffline) {
        return (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000] animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="bg-red-500 text-white px-6 py-2 rounded-full shadow-2xl flex items-center gap-3 border border-red-400">
                    <WifiOff className="h-4 w-4 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Çevrimdışı Çalışılıyor</span>
                </div>
            </div>
        );
    }

    if (showOnline) {
        return (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000] animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="bg-emerald-500 text-white px-6 py-2 rounded-full shadow-2xl flex items-center gap-3 border border-emerald-400">
                    <Wifi className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Tekrar Çevrimiçi</span>
                </div>
            </div>
        );
    }

    return null;
}
