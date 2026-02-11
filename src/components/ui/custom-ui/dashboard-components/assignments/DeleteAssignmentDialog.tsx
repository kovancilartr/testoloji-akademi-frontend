"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteAssignment } from "@/hooks/use-assignments";
import { toast } from "sonner";

interface DeleteAssignmentDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    assignmentToDelete: { id: string, title: string } | null;
}

export const DeleteAssignmentDialog = ({ isOpen, onOpenChange, assignmentToDelete }: DeleteAssignmentDialogProps) => {
    const deleteAssignmentMutation = useDeleteAssignment();

    const confirmDelete = async () => {
        if (!assignmentToDelete) return;

        try {
            await deleteAssignmentMutation.mutateAsync(assignmentToDelete.id);
            toast.success("Ödev başarıyla silindi.");
            onOpenChange(false);
        } catch (error) {
            toast.error("Ödev silinirken bir hata oluştu.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false} className="sm:max-w-[400px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
                <div className="p-8 space-y-6">
                    <DialogHeader>
                        <div className="bg-red-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ring-8 ring-red-50/50">
                            <AlertCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight text-gray-900">Ödevi Sil?</DialogTitle>
                        <DialogDescription className="font-bold text-sm text-gray-500 leading-relaxed mt-2">
                            <span className="text-red-600 font-black">"{assignmentToDelete?.title}"</span> isimli ödevi kalıcı olarak silmek üzeresiniz. Bu işlem <span className="underline decoration-red-200 decoration-2">geri alınamaz.</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 h-12 rounded-xl font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all cursor-pointer border border-gray-100"
                        >
                            Vazgeç
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            disabled={deleteAssignmentMutation.isPending}
                            className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-sm shadow-xl shadow-red-500/20 transition-all active:scale-95 border-none cursor-pointer"
                        >
                            {deleteAssignmentMutation.isPending ? "..." : "Sil"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
