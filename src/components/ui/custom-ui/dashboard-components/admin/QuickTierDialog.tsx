
"use client";

import { Crown, Star, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { SubscriptionTier } from "@/types/auth";
import { cn } from "@/lib/utils";

interface QuickTierDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    currentTier: SubscriptionTier;
    userName: string;
    onConfirm: (tier: SubscriptionTier) => void;
}

export const QuickTierDialog = ({
    isOpen,
    onOpenChange,
    currentTier,
    userName,
    onConfirm
}: QuickTierDialogProps) => {
    const tiers = [
        { id: SubscriptionTier.BRONZ, name: "Bronz Paket", icon: Zap, color: "orange" },
        { id: SubscriptionTier.GUMUS, name: "Gümüş Paket", icon: Star, color: "slate" },
        { id: SubscriptionTier.ALTIN, name: "Altın Paket", icon: Crown, color: "amber" },
        { id: SubscriptionTier.FREE, name: "Ücretsiz Paket", icon: Users, color: "gray" },
    ];

    const tierStyles: Record<string, { bg: string, border: string, text: string, hoverBg: string, hoverBorder: string }> = {
        orange: { bg: "bg-orange-100", border: "border-orange-200", text: "text-orange-600", hoverBg: "hover:bg-orange-50", hoverBorder: "hover:border-orange-200" },
        slate: { bg: "bg-slate-100", border: "border-slate-200", text: "text-slate-600", hoverBg: "hover:bg-slate-50", hoverBorder: "hover:border-slate-200" },
        amber: { bg: "bg-amber-100", border: "border-amber-200", text: "text-amber-600", hoverBg: "hover:bg-amber-50", hoverBorder: "hover:border-amber-200" },
        gray: { bg: "bg-gray-100", border: "border-gray-200", text: "text-gray-600", hoverBg: "hover:bg-gray-50", hoverBorder: "hover:border-gray-200" },
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[440px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
                <div className="p-8 space-y-6">
                    <DialogHeader>
                        <div className="bg-amber-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ring-8 ring-amber-100/50">
                            <Crown className="h-6 w-6 text-amber-500" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight text-gray-900">Paket İşlemleri</DialogTitle>
                        <DialogDescription className="font-bold text-sm text-gray-500 leading-relaxed mt-2">
                            <span className="text-amber-600 font-black">{userName}</span> için abonelik planı seçin.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-3">
                        {tiers.map((tier) => (
                            <Button
                                key={tier.id}
                                onClick={() => onConfirm(tier.id)}
                                disabled={currentTier === tier.id}
                                variant="outline"
                                className={cn(
                                    "h-24 rounded-[2rem] border-2 transition-all active:scale-95 flex flex-col items-center justify-center gap-2 p-4",
                                    currentTier === tier.id
                                        ? "bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed"
                                        : `bg-white ${tierStyles[tier.color].hoverBg} ${tierStyles[tier.color].hoverBorder} border-gray-100`
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center",
                                    currentTier === tier.id ? "bg-gray-200" : tierStyles[tier.color].bg
                                )}>
                                    <tier.icon className={cn(
                                        "h-5 w-5",
                                        currentTier === tier.id ? "text-gray-400" : tierStyles[tier.color].text
                                    )} />
                                </div>
                                <span className={cn(
                                    "text-xs font-black uppercase tracking-tight",
                                    currentTier === tier.id ? "text-gray-400" : "text-gray-900"
                                )}>{tier.name.split(' ')[0]}</span>
                            </Button>
                        ))}
                    </div>

                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="w-full h-12 rounded-xl font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
                    >
                        Vazgeç
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
