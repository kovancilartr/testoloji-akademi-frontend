"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserCog } from "lucide-react";
import { toast } from "sonner";
import { useUpdateStudent, Student } from "@/hooks/use-students";
import { useThemeColors } from "@/contexts/ThemeContext";
import { GRADE_LEVELS } from "@/lib/constants";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface EditStudentDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    student: Student | null;
}

export function EditStudentDialog({
    isOpen,
    onOpenChange,
    student
}: EditStudentDialogProps) {
    const colors = useThemeColors();
    const updateStudent = useUpdateStudent();

    const [formData, setFormData] = useState({
        name: "",
        gradeLevel: "",
        email: "",
        phone: "",
        notes: ""
    });

    useEffect(() => {
        if (student) {
            setFormData({
                name: student.name || "",
                gradeLevel: student.gradeLevel || "",
                email: student.email || "",
                phone: student.phone || "",
                notes: student.notes || ""
            });
        }
    }, [student]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!student) return;
        if (!formData.name.trim()) {
            toast.error("Öğrenci adı boş olamaz");
            return;
        }

        try {
            await updateStudent.mutateAsync({
                id: student.id,
                data: formData
            });

            toast.success("Öğrenci bilgileri güncellendi");
            onOpenChange(false);
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Güncelleme sırasında bir hata oluştu");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className={`mx-auto ${colors.iconBg} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                        <UserCog className={`h-6 w-6 ${colors.text}`} />
                    </div>
                    <DialogTitle className="text-center text-xl font-black text-gray-900">
                        Öğrenci Bilgilerini Düzenle
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        Öğrenci bilgilerini güncelleyin.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Ad Soyad *</Label>
                        <Input
                            id="edit-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="font-medium"
                            placeholder="Örn: Ali Yılmaz"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-grade">Sınıf / Seviye</Label>
                            <Select
                                value={formData.gradeLevel}
                                onValueChange={(value) => setFormData({ ...formData, gradeLevel: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {GRADE_LEVELS.map((grade) => (
                                        <SelectItem key={grade} value={grade}>
                                            {grade}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-phone">Telefon</Label>
                            <Input
                                id="edit-phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="05..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-email">E-posta</Label>
                        <Input
                            id="edit-email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="ali@ornek.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-notes">Notlar</Label>
                        <Input
                            id="edit-notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Özel notlar..."
                        />
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={updateStudent.isPending}
                            className="cursor-pointer mr-2"
                        >
                            İptal
                        </Button>
                        <Button
                            type="submit"
                            className={`${colors.buttonBg} ${colors.buttonHover} font-bold cursor-pointer text-white`}
                            disabled={updateStudent.isPending || !formData.name.trim()}
                        >
                            {updateStudent.isPending ? (
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
