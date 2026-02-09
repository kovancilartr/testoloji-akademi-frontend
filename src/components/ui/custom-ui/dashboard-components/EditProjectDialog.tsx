"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, FolderEdit } from "lucide-react";
import { toast } from "sonner";
import { useUpdateProject } from "@/hooks/use-projects";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColors } from "@/contexts/ThemeContext";

interface EditProjectDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    project: { id: string; name: string } | null;
    onProjectUpdated?: () => void;
}

export function EditProjectDialog({
    isOpen,
    onOpenChange,
    project,
    onProjectUpdated
}: EditProjectDialogProps) {
    const { user } = useAuth();
    const colors = useThemeColors();
    const [projectName, setProjectName] = useState("");
    const updateProject = useUpdateProject();

    useEffect(() => {
        if (project) {
            setProjectName(project.name);
        }
    }, [project]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!projectName.trim()) {
            toast.error("Klasör adı boş olamaz");
            return;
        }

        if (!project) return;

        try {
            // Guest project için localStorage'ı güncelle
            if (!user && project.id.startsWith('guest_')) {
                const guestProjects = JSON.parse(localStorage.getItem('guestProjects') || '[]');
                const updatedProjects = guestProjects.map((p: any) =>
                    p.id === project.id ? { ...p, name: projectName.trim(), updatedAt: new Date().toISOString() } : p
                );
                localStorage.setItem('guestProjects', JSON.stringify(updatedProjects));

                // Custom event dispatch
                window.dispatchEvent(new Event('guestProjectsUpdated'));

                toast.success("Klasör adı güncellendi");
                onProjectUpdated?.();
                onOpenChange(false);
            } else {
                // Backend project için API çağrısı
                await updateProject.mutateAsync({
                    id: project.id,
                    name: projectName.trim()
                });

                toast.success("Klasör adı güncellendi");
                onProjectUpdated?.();
                onOpenChange(false);
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Klasör adı güncellenirken bir hata oluştu");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className={`mx-auto ${colors.iconBg} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                        <FolderEdit className={`h-6 w-6 ${colors.text}`} />
                    </div>
                    <DialogTitle className="text-center text-xl font-black text-gray-900">
                        Klasör Adını Düzenle
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        Klasörünüze yeni bir ad verin
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Klasör Adı</Label>
                        <Input
                            id="name"
                            placeholder="Örn: Matematik Soruları"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="font-medium"
                            autoFocus
                        />
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={updateProject.isPending}
                            className="cursor-pointer mr-2"
                        >
                            İptal
                        </Button>
                        <Button
                            type="submit"
                            className={`${colors.buttonBg} ${colors.buttonHover} font-bold cursor-pointer`}
                            disabled={updateProject.isPending || !projectName.trim()}
                        >
                            {updateProject.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Güncelleniyor...
                                </>
                            ) : (
                                "Güncelle"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
