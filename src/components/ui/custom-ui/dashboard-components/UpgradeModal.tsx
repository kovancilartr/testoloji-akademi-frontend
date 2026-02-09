"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, X, CheckCircle2, Zap, Star } from "lucide-react";
import { SubscriptionTier } from "@/types/auth";

import { useAuth } from "@/contexts/AuthContext";

interface UpgradeModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    currentRole: SubscriptionTier;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
    isOpen,
    onOpenChange,
    title,
    description,
    currentRole
}) => {
    const { user } = useAuth();

    const handleWhatsAppRedirect = () => {
        const phone = "905457983910";
        const email = user?.email || "Kayıtsız Kullanıcı";
        const message = `Merhaba, ${email} adresi ile sisteme kayıtlıyım. Paket limitlerimi doldurdum, premium paketlere geçiş yapmak için bilgi alabilir miyim?`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
                <div className="relative">
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                    <div className="p-8 space-y-8 relative">
                        <DialogHeader className="space-y-4">
                            <div className="bg-brand-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-2 shadow-inner ring-1 ring-brand-100/50">
                                <Crown className="h-7 w-7 text-brand-500 animate-pulse" />
                            </div>
                            <div className="space-y-1">
                                <DialogTitle className="text-3xl font-black tracking-tight text-gray-900 leading-tight">
                                    {title}
                                </DialogTitle>
                                <DialogDescription className="font-bold text-sm text-gray-400 uppercase tracking-widest">
                                    Paketinizi Yükseltme Vakti Geldi
                                </DialogDescription>
                            </div>
                        </DialogHeader>

                        <div className="space-y-6">
                            <p className="text-gray-500 font-bold text-sm leading-relaxed">
                                {description} Daha fazla içerik oluşturmaya devam etmek için premium paketlerimizden birine geçiş yapın.
                            </p>

                            <div className="space-y-3">
                                <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 group hover:bg-white hover:ring-2 hover:ring-brand-500/20 transition-all cursor-default">
                                    <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                                        <Zap className="h-5 w-5 text-orange-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs font-black text-gray-900 uppercase">Bronz Paket</div>
                                        <div className="text-[10px] font-bold text-gray-400">1 Proje • 15 Soru Limiti</div>
                                    </div>
                                    {currentRole === SubscriptionTier.BRONZ && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                                </div>

                                <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 group hover:bg-white hover:ring-2 hover:ring-slate-500/20 transition-all cursor-default relative overflow-hidden">
                                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                        <Star className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs font-black text-gray-900 uppercase">Gümüş Paket</div>
                                        <div className="text-[10px] font-bold text-gray-400">5 Proje • 100 Soru Limiti (%66 Tasarruf)</div>
                                    </div>
                                    {currentRole === SubscriptionTier.GUMUS && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                                </div>

                                <div className="p-4 bg-brand-500/5 rounded-2xl flex items-center gap-4 group hover:bg-white hover:ring-2 hover:ring-brand-500/20 transition-all cursor-default border border-brand-500/10">
                                    <div className="h-10 w-10 rounded-xl bg-brand-500 flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
                                        <Crown className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs font-black text-gray-900 uppercase">Altın Paket</div>
                                        <div className="text-[10px] font-bold text-gray-400">15 Proje • 200 Soru Limiti (%60 Tasarruf)</div>
                                    </div>
                                    {currentRole === SubscriptionTier.ALTIN && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 pt-2">
                            <Button
                                className="w-full h-14 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-black text-base shadow-xl shadow-brand-500/20 gap-2 transition-all active:scale-95 group"
                                onClick={handleWhatsAppRedirect}
                            >
                                <Crown className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                                Paketleri İncele
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="w-full h-12 rounded-xl font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
                            >
                                Belki Daha Sonra
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
