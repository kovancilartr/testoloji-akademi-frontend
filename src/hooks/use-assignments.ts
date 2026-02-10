
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Assignment {
    id: string;
    title: string;
    description?: string;
    type: "TEST" | "VIDEO" | "READING" | "CUSTOM";
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";
    dueDate?: string;
    grade?: number;
    feedback?: string;
    student: {
        id: string;
        name: string;
    };
    project?: {
        id: string;
        name: string;
    };
    externalUrl?: string;
    createdAt: string;
}

export interface CreateAssignmentDTO {
    title: string;
    description?: string;
    type: string;
    studentIds: string[];
    projectId?: string;
    externalUrl?: string;
    dueDate?: string;
    duration?: number;
    allowedAttempts?: number;
}

// Ödevleri Getir
export function useAssignments(studentId?: string) {
    return useQuery({
        queryKey: ["assignments", studentId],
        queryFn: async () => {
            const params = studentId ? { studentId } : {};
            const response = await api.get("/assignments", { params });
            return response.data.data as Assignment[];
        },
        refetchInterval: 120000, // 2 dakikada bir ödev listesini tazele
    });
}

// Ödev Oluştur (Toplu)
export function useCreateAssignment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateAssignmentDTO) => {
            const response = await api.post("/assignments", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assignments"] });
            queryClient.invalidateQueries({ queryKey: ["students"] }); // Öğrenci ödev sayısı değişti
        },
    });
}

// Ödev Sil
export function useDeleteAssignment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/assignments/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assignments"] });
            queryClient.invalidateQueries({ queryKey: ["students"] });
        },
    });
}

// Ödev Tamamla / Gönder
export function useSubmitAssignment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, answers }: { id: string; answers?: Record<string, any> }) => {
            const response = await api.post(`/assignments/${id}/submit`, { answers: answers || {} });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assignments"] });
            queryClient.invalidateQueries({ queryKey: ["students"] });
        },
    });
}

// Ödev İşaretini Geri Al
export function useUndoSubmitAssignment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.post(`/assignments/${id}/undo-submit`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assignments"] });
            queryClient.invalidateQueries({ queryKey: ["students"] });
        },
    });
}
