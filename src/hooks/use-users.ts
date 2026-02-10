import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/auth";

export interface UserStats {
    totalUsers: number;
    totalProjects: number;
    totalQuestions: number;
    usersByRole: Array<{ role: string, _count: number }>;
}

export const useUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<any[]>>("/users");
            return data.data;
        },
    });
};

export const useUserStats = () => {
    return useQuery({
        queryKey: ["user-stats"],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<UserStats>>("/users/stats");
            return data.data;
        },
    });
};

export const useTeacherStats = () => {
    return useQuery({
        queryKey: ["teacher-stats"],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<any>>("/users/teacher-stats");
            return data.data;
        },
    });
};

export const useStudentStats = () => {
    return useQuery({
        queryKey: ["student-stats"],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<any>>("/users/student-stats");
            return data.data;
        },
        refetchInterval: 300000, // 5 dakikada bir sayaçları güncelle
        refetchOnWindowFocus: true, // Uygulamaya geri dönüldüğünde tazele
    });
};

export const useUpdateUserRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, role, duration }: { userId: string, role: string, duration?: 'monthly' | 'yearly' }) => {
            const { data } = await api.patch(`/users/${userId}/role`, { role, duration });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["user-stats"] });
        },
    });
};

export const useToggleUserStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userId: string) => {
            const { data } = await api.patch(`/users/${userId}/status`);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["user-stats"] });
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userId: string) => {
            const { data } = await api.delete(`/users/${userId}`);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["user-stats"] });
        },
    });
};
