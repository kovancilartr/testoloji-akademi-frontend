import React from "react";
import {
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Calculator,
    X,
} from "lucide-react";

interface EditorHeaderProps {
    onClose: () => void;
    guideModal: React.ReactNode;
}

export function EditorHeader({ onClose, guideModal }: EditorHeaderProps) {
    return (
        <DialogHeader className="h-14 sm:h-16 px-4 sm:px-8 border-b border-gray-100 flex flex-row items-center justify-between bg-white shrink-0 z-10 font-sans space-y-0">
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-brand-500 rounded-lg sm:rounded-xl shadow-lg shadow-brand-500/20">
                    <Calculator className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-white" />
                </div>
                <div className="flex flex-col text-left">
                    <DialogTitle className="text-[11px] sm:text-sm font-black uppercase tracking-widest text-gray-900 leading-none">
                        Dijital Editör
                    </DialogTitle>
                    <DialogDescription className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-1 hidden sm:block">
                        Matematiksel formüllerle profesyonel sorular tasarlayın
                    </DialogDescription>
                </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
                {guideModal}
                <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-gray-50 text-gray-400 border border-gray-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100"
                    onClick={onClose}
                >
                    <X className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                </Button>
            </div>
        </DialogHeader>
    );
}
