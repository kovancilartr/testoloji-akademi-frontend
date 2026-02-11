"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Globe } from "lucide-react";
import { useThemeColors } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

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
    const colors = useThemeColors();

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm rounded-[2.5rem] p-8 border-none shadow-2xl bg-white text-center">
                <div className="flex justify-center mb-6">
                    <div className={cn(
                        "w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-500",
                        isPublished
                            ? cn("bg-linear-to-br text-white shadow-xl", colors.gradient, colors.shadow)
                            : "bg-slate-100 text-slate-300"
                    )}>
                        <Globe className={cn("w-10 h-10", isPublished && "animate-pulse")} />
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
                        className={cn(
                            "cursor-pointer h-14 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-[0.98] text-white border-0",
                            cn("bg-linear-to-br", colors.gradient, colors.shadow)
                        )}
                        onClick={onToggle}
                        disabled={isLoading}
                    >
                        {isPublished ? 'YAYINI DURDUR (TASLAĞA ÇEK)' : 'HEMEN YAYINLA'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
