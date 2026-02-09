"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface DeleteUserDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    userEmail: string | undefined;
    onConfirm: () => void;
    isPending: boolean;
}

export const DeleteUserDialog = ({
    isOpen,
    onOpenChange,
    userEmail,
    onConfirm,
    isPending
}: DeleteUserDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
                <div className="p-8 space-y-6">
                    <DialogHeader>
                        <div className="bg-red-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ring-8 ring-red-50/50">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight text-gray-900">Hesabı Sil?</DialogTitle>
                        <DialogDescription className="font-bold text-sm text-gray-500 leading-relaxed mt-2">
                            <span className="text-red-600 font-black">"{userEmail}"</span> adlı kullanıcının hesabını ve tüm verilerini kalıcı olarak silmek üzeresiniz. Bu işlem <span className="underline decoration-red-200 decoration-2">geri alınamaz.</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={onConfirm}
                            disabled={isPending}
                            className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-base shadow-xl shadow-red-500/20 transition-all active:scale-95"
                        >
                            {isPending ? "Siliniyor..." : "Hesabı Kalıcı Olarak Sil"}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
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
