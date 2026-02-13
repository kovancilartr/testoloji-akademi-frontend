import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/auth";

export interface UserStats {
    totalUsers: number;
    totalProjects: number;
    totalQuestions: number;
    totalCourses: number;
    totalAssignments: number;
    completedAssignments: number;
    pendingAssignments: number;
    totalCoachingSessions: number;
    totalEnrollments: number;
    activeUsersLast7Days: number;
    newUsersLast30Days: number;
    usersByRole: Array<{ role: string; _count: number }>;
    usersByTier: Array<{ tier: string; _count: number }>;
    recentUsers: Array<{ createdAt: string }>;
    latestUsers: Array<{
        id: string;
        name: string;
        email: string;
        role: string;
        tier: string;
        createdAt: string;
    }>;
}

export const useUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<any[]>>("/users");
            return data.data;
        },
        staleTime: 5 * 60 * 1000, // 5 dakika cache
        refetchOnWindowFocus: false,
    });
};

export const useUserStats = () => {
    return useQuery({
        queryKey: ["user-stats"],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<UserStats>>("/users/stats");
            return data.data;
        },
        staleTime: 5 * 60 * 1000, // 5 dakika cache - sayfa geçişlerinde yeniden istek atılmaz
        refetchOnWindowFocus: false, // Pencere odaklandığında tekrar çekilmez
    });
};

export const useTeacherStats = () => {
    return useQuery({
        queryKey: ["teacher-stats"],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<any>>("/users/teacher-stats");
            return data.data;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
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

export const useToggleCoachingAccess = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, hasAccess }: { userId: string, hasAccess: boolean }) => {
            const { data } = await api.patch(`/users/${userId}/coaching-access`, { hasCoachingAccess: hasAccess });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
};
