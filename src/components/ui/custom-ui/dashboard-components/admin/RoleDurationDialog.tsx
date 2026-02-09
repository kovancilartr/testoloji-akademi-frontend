
"use client";

import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { SubscriptionTier } from "@/types/auth";

interface SubscriptionDurationDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedTier: SubscriptionTier | null;
    onConfirm: (duration: 'monthly' | 'yearly') => void;
    onCancel: () => void;
}

export const SubscriptionDurationDialog = ({
    isOpen,
    onOpenChange,
    selectedTier,
    onConfirm,
    onCancel
}: SubscriptionDurationDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
                <div className="p-8 space-y-6">
                    <DialogHeader>
                        <div className="bg-orange-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ring-8 ring-orange-100/50">
                            <Crown className="h-6 w-6 text-orange-500" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight text-gray-900">Abonelik Süresi Seçin</DialogTitle>
                        <DialogDescription className="font-bold text-sm text-gray-500 leading-relaxed mt-2">
                            Kullanıcıyı <span className="text-orange-500 font-black">{selectedTier}</span> pakete yükseltmek üzeresiniz. Lütfen abonelik periyodunu seçin.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={() => onConfirm('monthly')}
                            className="w-full h-14 bg-gray-900 hover:bg-black text-white rounded-xl font-black text-base shadow-xl shadow-gray-200 transition-all active:scale-95 flex flex-col items-center justify-center"
                        >
                            <span>Aylık Paket</span>
                            <span className="text-[10px] font-bold opacity-70 italic">+1 Ay Süre Tanımlanır</span>
                        </Button>
                        <Button
                            onClick={() => onConfirm('yearly')}
                            className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-base shadow-xl shadow-orange-500/20 transition-all active:scale-95 flex flex-col items-center justify-center"
                        >
                            <span>Yıllık Paket (Önerilen)</span>
                            <span className="text-[10px] font-bold opacity-90 italic">+1 Yıl Süre Tanımlanır</span>
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={onCancel}
                            className="w-full h-12 rounded-xl font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
                        >
                            Vazgeç
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
