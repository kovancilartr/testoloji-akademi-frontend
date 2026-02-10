import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    link?: string;
    createdAt: string;
}

export function useNotifications() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const response = await api.get("/notifications");
            // Standard expected structure: { success: true, data: { notifications: [], unreadCount: 0 } }
            // After axios response interceptor: response.data.data is { notifications: [], unreadCount: 0 }
            const data = response.data.data;

            return {
                notifications: data?.notifications || (Array.isArray(data) ? data : []),
                unreadCount: typeof data?.unreadCount === 'number' ? data.unreadCount : (Array.isArray(data) ? data.filter((n: any) => !n.isRead).length : 0)
            };
        },
        refetchInterval: 30000, // 30 saniyede bir kontrol et (Sunucu dostu)
    });

    const markAsRead = useMutation({
        mutationFn: async (id: string) => {
            await api.patch(`/notifications/${id}/read`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    const markAllAsRead = useMutation({
        mutationFn: async () => {
            await api.post("/notifications/read-all");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    const deleteNotification = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/notifications/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    return {
        ...query,
        notifications: query.data?.notifications || [],
        unreadCount: query.data?.unreadCount || 0,
        markAsRead: markAsRead.mutate,
        markAllAsRead: markAllAsRead.mutate,
        deleteNotification: deleteNotification.mutate,
    };
}
