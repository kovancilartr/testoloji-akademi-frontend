"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteProject } from "@/hooks/use-projects";
import { useAuth } from "@/contexts/AuthContext";
import { deleteGuestProject } from "@/lib/guest-projects";
import { toast } from "sonner";

interface DeleteProjectDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    projectToDelete: { id: string, name: string } | null;
    onProjectDeleted?: () => void;
}

export const DeleteProjectDialog = ({ isOpen, onOpenChange, projectToDelete, onProjectDeleted }: DeleteProjectDialogProps) => {
    const deleteProjectMutation = useDeleteProject();
    const { user } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);

    const confirmDelete = () => {
        if (!projectToDelete) return;

        if (!user) {
            // Guest mode: delete from LocalStorage
            setIsDeleting(true);
            deleteGuestProject(projectToDelete.id);
            toast.success("Proje silindi!");
            onOpenChange(false);
            setIsDeleting(false);
            if (onProjectDeleted) onProjectDeleted();
        } else {
            // Authenticated mode: use backend
            deleteProjectMutation.mutate(projectToDelete.id, {
                onSuccess: () => {
                    onOpenChange(false);
                }
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
                <div className="p-8 space-y-6">
                    <DialogHeader>
                        <div className="bg-red-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ring-8 ring-red-50/50">
                            <AlertCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight text-gray-900">Klasörü Sil?</DialogTitle>
                        <DialogDescription className="font-bold text-sm text-gray-500 leading-relaxed mt-2">
                            <span className="text-red-600 font-black">"{projectToDelete?.name}"</span> isimli klasörü ve içindeki tüm soruları kalıcı olarak silmek üzeresiniz. Bu işlem <span className="underline decoration-red-200 decoration-2">geri alınamaz.</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={confirmDelete}
                            disabled={isDeleting || deleteProjectMutation.isPending}
                            className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-base shadow-xl shadow-red-500/20 transition-all active:scale-95"
                        >
                            {(isDeleting || deleteProjectMutation.isPending) ? "Siliniyor..." : "Evet, Kalıcı Olarak Sil"}
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
