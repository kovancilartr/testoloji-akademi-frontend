
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export interface ScheduleItem {
    id: string;
    studentId: string;
    date?: string; // Belirli bir tarih için (ISO format)
    dayOfWeek?: number; // VEYA haftalık tekrarlayan (1-7)
    startTime: string; // HH:MM
    endTime: string;   // HH:MM
    activity: string;
    isCompleted: boolean;
    courseId?: string;
    contentId?: string;
}

export interface CreateScheduleDTO {
    studentId: string;
    date?: string; // Belirli bir tarih için
    dayOfWeek?: number; // VEYA haftalık tekrarlayan
    startTime: string;
    endTime: string;
    activity: string;
    courseId?: string;
    contentId?: string;
}

export function useSchedule(studentId?: string) {
    const { user } = useAuth();
    const isStudent = user?.role === "STUDENT";

    return useQuery({
        queryKey: ["schedule", studentId || "self"],
        queryFn: async () => {
            const params = studentId ? { studentId } : {};
            const response = await api.get("/schedule", { params });
            return response.data.data as ScheduleItem[];
        },
        // Eğer öğrenciyse her zaman çalışsın, hataysa (öğretmen/admin) öğrenci seçiliyse çalışsın
        enabled: isStudent || (!!studentId && studentId !== "")
    });
}

export function useCreateScheduleItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateScheduleDTO) => {
            const response = await api.post("/schedule", data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["schedule", variables.studentId] });
        }
    });
}

export function useDeleteScheduleItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, studentId }: { id: string, studentId: string }) => {
            await api.delete(`/schedule/${id}`);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["schedule", variables.studentId] });
        }
    });
}
