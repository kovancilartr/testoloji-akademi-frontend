"use client";

import { useState } from "react";
import { Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useCreateProject } from "@/hooks/use-projects";
import { useAuth } from "@/contexts/AuthContext";
import { createGuestProject } from "@/lib/guest-projects";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CreateProjectDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onProjectCreated?: () => void;
}

export const CreateProjectDialog = ({ isOpen, onOpenChange, onProjectCreated }: CreateProjectDialogProps) => {
    const [newProjectName, setNewProjectName] = useState("");
    const createProjectMutation = useCreateProject();
    const { user } = useAuth();
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateProject = async () => {
        if (!newProjectName.trim()) return;

        if (!user) {
            // Guest mode: create in LocalStorage
            setIsCreating(true);
            const newProject = createGuestProject(newProjectName);

            if (!newProject) {
                toast.error("Misafir kullanıcılar en fazla 1 proje oluşturabilir. Üye olun!");
                setIsCreating(false);
                return;
            }

            toast.success("Proje oluşturuldu!");
            setNewProjectName("");
            onOpenChange(false);
            setIsCreating(false);

            if (onProjectCreated) onProjectCreated();

            // Navigate to the project
            router.push(`/dashboard/project/${newProject.id}`);
        } else {
            // Authenticated mode: use backend
            createProjectMutation.mutate(newProjectName, {
                onSuccess: () => {
                    setNewProjectName("");
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
                        <div className="bg-brand-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                            <Folder className="h-6 w-6 text-brand-600" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight text-gray-900">Yeni Klasör Aç</DialogTitle>
                        <DialogDescription className="font-bold text-[9px] text-gray-400 uppercase tracking-widest mt-1">
                            Sorularınızı düzenlemek için bir başlık girin.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                id="name"
                                autoFocus
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                className="h-14 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 font-bold text-base transition-all px-5"
                                placeholder="Klasör adı (örn: 10. Sınıf Kimya)"
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={handleCreateProject}
                            disabled={isCreating || createProjectMutation.isPending || !newProjectName.trim()}
                            className="w-full h-14 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-black text-base shadow-xl shadow-brand-500/10 disabled:opacity-50"
                        >
                            {(isCreating || createProjectMutation.isPending) ? "Oluşturuluyor..." : "Oluştur"}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};
