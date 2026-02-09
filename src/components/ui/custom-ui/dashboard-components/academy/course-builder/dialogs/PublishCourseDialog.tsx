"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Globe } from "lucide-react";

interface PublishCourseDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    isPublished: boolean;
    onToggle: () => Promise<void>;
    isLoading?: boolean;
}

export function PublishCourseDialog({
    isOpen,
    onOpenChange,
    isPublished,
    onToggle,
    isLoading
}: PublishCourseDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm rounded-[2.5rem] p-8 border-none shadow-2xl bg-white text-center">
                <div className="flex justify-center mb-6">
                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-500 ${isPublished ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200' : 'bg-slate-100 text-slate-300'}`}>
                        <Globe className={`w-10 h-10 ${isPublished ? 'animate-pulse' : ''}`} />
                    </div>
                </div>

                <div className="space-y-2 mb-8">
                    <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
                        {isPublished ? 'Kurs Yayında' : 'Kurs Taslak Modunda'}
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium text-sm leading-relaxed px-4">
                        {isPublished
                            ? 'Kursun şu an tüm kayıtlı öğrenciler tarafından görülebilir ve erişilebilir durumda.'
                            : 'Kursu yayınladığında, atadığın öğrenciler kütüphanelerinde kursu görebilecekler.'}
                    </DialogDescription>
                </div>

                <div className="grid gap-3">
                    <Button
                        className={`h-14 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-[0.98] ${isPublished
                            ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-100'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-100'
                            }`}
                        onClick={onToggle}
                        disabled={isLoading}
                    >
                        {isPublished ? 'YAYINI DURDUR (TASLAĞA ÇEK)' : 'HEMEN YAYINLA'}
                    </Button>
                    <Button
                        variant="ghost"
                        className="h-12 rounded-xl text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50"
                        onClick={() => onOpenChange(false)}
                    >
                        KAPAT
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
