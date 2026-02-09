
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Assignment } from "./use-assignments";

export interface Student {
    id: string;
    name: string;
    gradeLevel?: string;
    email?: string;
    phone?: string;
    notes?: string;
    _count?: {
        assignments: number;
    };
    createdAt: string;
}

export interface StudentDetail extends Student {
    assignments: Assignment[];
    schedules: any[];
}

// Öğrencileri getir
export function useStudents() {
    return useQuery({
        queryKey: ["students"],
        queryFn: async () => {
            const response = await api.get("/academy/students");
            return response.data.data as Student[];
        },
    });
}

// Tekil öğrenci getir
export function useStudent(id: string) {
    return useQuery({
        queryKey: ["students", id],
        queryFn: async () => {
            const response = await api.get(`/academy/students/${id}`);
            return response.data.data as StudentDetail;
        },
        enabled: !!id
    });
}

// Öğrenci silme
export function useDeleteStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/academy/students/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] });
        },
    });
}

// Öğrenci ekleme
export function useCreateStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<Student>) => {
            const response = await api.post("/academy/students", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] });
        },
    });
}

// Öğrenci güncelleme
export function useUpdateStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string, data: Partial<Student> }) => {
            const response = await api.patch(`/academy/students/${id}`, data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["students"] });
            queryClient.invalidateQueries({ queryKey: ["students", variables.id] });
        },
    });
}
