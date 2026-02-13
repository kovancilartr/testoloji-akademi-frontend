
"use client";

import { UserCog, GraduationCap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Role } from "@/types/auth";
import { cn } from "@/lib/utils";

interface QuickRoleDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    currentRole: Role;
    userName: string;
    onConfirm: (role: Role) => void;
}

export const QuickRoleDialog = ({
    isOpen,
    onOpenChange,
    currentRole,
    userName,
    onConfirm
}: QuickRoleDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
                <div className="p-8 space-y-6">
                    <DialogHeader>
                        <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ring-8 ring-blue-100/50">
                            <UserCog className="h-6 w-6 text-blue-500" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight text-gray-900">Sistem Rolü</DialogTitle>
                        <DialogDescription className="font-bold text-sm text-gray-500 leading-relaxed mt-2">
                            <span className="text-blue-600 font-black">{userName}</span> için yeni bir sistem rolü atayın.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={() => onConfirm(Role.TEACHER)}
                            disabled={currentRole === Role.TEACHER}
                            className={cn(
                                "w-full h-14 rounded-xl font-black text-base transition-all active:scale-95 flex items-center gap-3 px-6",
                                currentRole === Role.TEACHER
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-blue-500 hover:bg-blue-600 text-white shadow-xl shadow-blue-500/20"
                            )}
                        >
                            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                <UserCog className="h-4 w-4" />
                            </div>
                            <span>Eğitmen Yap</span>
                        </Button>

                        <Button
                            onClick={() => onConfirm(Role.STUDENT)}
                            disabled={currentRole === Role.STUDENT}
                            className={cn(
                                "w-full h-14 rounded-xl font-black text-base transition-all active:scale-95 flex items-center gap-3 px-6",
                                currentRole === Role.STUDENT
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20"
                            )}
                        >
                            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                <GraduationCap className="h-4 w-4" />
                            </div>
                            <span>Öğrenci Yap</span>
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="w-full h-12 rounded-xl font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all mt-2"
                        >
                            Vazgeç
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
