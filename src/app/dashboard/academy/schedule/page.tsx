"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CalendarDays, Plus } from "lucide-react";
import { useStudents } from "@/hooks/use-students";
import { useSchedule, useDeleteScheduleItem } from "@/hooks/use-schedule";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useThemeColors } from "@/contexts/ThemeContext";

// Child Components
import { CreateActivityDialog } from "@/components/ui/custom-ui/dashboard-components/schedule/CreateActivityDialog";
import { DesktopCalendar } from "@/components/ui/custom-ui/dashboard-components/schedule/DesktopCalendar";
import { MobileWeeklyCalendar } from "@/components/ui/custom-ui/dashboard-components/schedule/MobileWeeklyCalendar";

import { RoleProtect } from "@/components/providers/RoleProtect";
import { Role } from "@/types/auth";

export default function SchedulePage() {
    const colors = useThemeColors();
    const { data: students, isLoading: studentsLoading } = useStudents();
    const [selectedStudentId, setSelectedStudentId] = useState<string>("");

    // İlk yüklemede öğrenci seçimi
    useEffect(() => {
        if (students && students.length > 0 && !selectedStudentId) {
            setSelectedStudentId(students[0].id);
        }
    }, [students, selectedStudentId]);

    const { data: schedule, isLoading: scheduleLoading } = useSchedule(selectedStudentId);
    const deleteItem = useDeleteScheduleItem();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Desktop Calendar State (Monthly)
    const [currentDate, setCurrentDate] = useState(new Date());

    // Mobile Calendar State (Weekly)
    const [currentWeekDate, setCurrentWeekDate] = useState(new Date());

    const handleDelete = async (id: string) => {
        if (window.confirm("Bu aktiviteyi silmek istediğinize emin misiniz?")) {
            try {
                await deleteItem.mutateAsync({ id, studentId: selectedStudentId });
                toast.success("Aktivite başarıyla silindi");
            } catch (error) {
                console.error(error);
                toast.error("Silinirken bir hata oluştu");
            }
        }
    };

    return (
        <RoleProtect allowedRoles={[Role.TEACHER, Role.ADMIN]}>
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3">
                        <div className={cn("p-3 rounded-xl bg-white shadow-sm border border-gray-100", colors.text)}>
                            <CalendarDays className="w-8 h-8" />
                        </div>
                        Haftalık Program
                    </h1>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                        <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                            <SelectTrigger className="w-full sm:w-[200px] bg-white border-gray-200">
                                <SelectValue placeholder="Öğrenci Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                {studentsLoading ? (
                                    <div className="p-2 text-sm text-gray-500">Yükleniyor...</div>
                                ) : students && students.length > 0 ? (
                                    students.map((student) => (
                                        <SelectItem key={student.id} value={student.id}>
                                            {student.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="p-2 text-sm text-gray-500">Öğrenci bulunamadı</div>
                                )}
                            </SelectContent>
                        </Select>

                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className={cn("text-white shadow-lg shadow-indigo-500/20 active:scale-95 transition-all w-full sm:w-auto", colors.buttonBg, colors.buttonHover)}
                            disabled={!selectedStudentId}
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Yeni Ekle
                        </Button>
                    </div>
                </div>

                {!selectedStudentId ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm border-dashed">
                        <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-50", colors.text)}>
                            <CalendarDays className="w-8 h-8 opacity-50" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Öğrenci Seçilmedi</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Programı görüntülemek ve düzenlemek için lütfen yukarıdan bir öğrenci seçin.
                        </p>
                    </div>
                ) : scheduleLoading ? (
                    <div className="h-64 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className={cn("w-8 h-8 border-4 border-t-transparent rounded-full animate-spin", colors.border)}></div>
                            <span className="text-sm font-medium text-gray-500">Program yükleniyor...</span>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
                        <DesktopCalendar
                            schedule={schedule}
                            currentDate={currentDate}
                            setCurrentDate={setCurrentDate}
                            handleDelete={handleDelete}
                            colors={colors}
                        />

                        <MobileWeeklyCalendar
                            schedule={schedule}
                            currentWeekDate={currentWeekDate}
                            setCurrentWeekDate={setCurrentWeekDate}
                            handleDelete={handleDelete}
                            colors={colors}
                        />
                    </div>
                )}

                <CreateActivityDialog
                    isOpen={isCreateModalOpen}
                    onOpenChange={setIsCreateModalOpen}
                    selectedStudentId={selectedStudentId}
                    colors={colors}
                />
            </div>
        </RoleProtect>
    );
}
