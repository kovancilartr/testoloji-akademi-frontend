"use client";

import React, { useEffect, useState } from "react";
import { Download, Smartphone, X } from "lucide-react";
import { Button } from "./button";

export function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check local storage first
        const isDismissed = localStorage.getItem('pwa_prompt_dismissed');
        if (isDismissed === 'true') return;

        const handler = (e: any) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            setIsVisible(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsVisible(false);
        }

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            // If they installed, we don't need to show this again
            localStorage.setItem('pwa_prompt_dismissed', 'true');
        } else {
            console.log('User dismissed the install prompt');
        }

        // We've used the prompt, and can't use it again
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('pwa_prompt_dismissed', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 z-[100] animate-in slide-in-from-left-10 duration-500">
            <div className="bg-white/80 backdrop-blur-2xl border border-brand-100 p-4 rounded-[2rem] shadow-2xl flex items-center gap-4 max-w-sm relative group">
                <button
                    onClick={handleDismiss}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-colors"
                >
                    <X className="h-3 w-3" />
                </button>

                <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
                    <Smartphone className="h-6 w-6 text-white" />
                </div>

                <div className="flex-1">
                    <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-tight leading-none mb-1">Uygulamayı Yükle</h4>
                    <p className="text-[10px] font-medium text-gray-500 leading-tight">Testoloji'yi ana ekranına ekle ve anında eriş.</p>
                </div>

                <Button
                    onClick={handleInstallClick}
                    className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-4 h-9 font-black text-[10px] uppercase shadow-lg shadow-brand-500/20 transition-all hover:scale-105 active:scale-95 gap-2"
                >
                    <Download className="h-3.5 w-3.5" />
                    Kur
                </Button>
            </div>
        </div>
    );
}
