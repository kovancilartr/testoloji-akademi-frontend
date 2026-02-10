import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getGuestProject, getGuestProjects, updateGuestProjectSettings, updateGuestProject } from "@/lib/guest-projects";

export interface Project {
    id: string;
    name: string;
    questionCount?: number;
    updatedAt: string;
    questions?: any[];
    settings?: any;
}

// Projeleri Getir
export function useProjects() {
    return useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            // Check if user is logged in (via localStorage token check or similar)
            // But here we can just try to fetch and if it fails or if we want to be explicit:
            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
            if (!token) {
                return getGuestProjects() as Project[];
            }
            const response = await api.get("/projects");
            return response.data.data as Project[];
        }
    });
}

// Tek Proje Getir
export function useProject(id: string) {
    return useQuery({
        queryKey: ["projects", id],
        queryFn: async () => {
            console.log("🔍 useProject hook - ID:", id);
            if (id.startsWith('guest_')) {
                const guestProject = getGuestProject(id);
                console.log("🔍 Guest Project Found:", guestProject);
                return guestProject as Project;
            }
            const response = await api.get(`/projects/${id}`);
            return response.data.data as Project;
        },
        enabled: !!id
    });
}

// Proje İstatistikleri (Limit kontrolü için)
export function useProjectStats() {
    const { data: projects = [] } = useProjects();

    // Toplam soru sayısını hesapla
    const totalQuestions = projects.reduce((acc, p) => acc + (p.questionCount || 0), 0);
    const totalProjects = projects.length;

    return {
        totalQuestions,
        totalProjects
    };
}

// Proje Oluştur
export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (name: string) => {
            const response = await api.post("/projects", { name });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
}

// Proje Sil
export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (projectId: string) => {
            await api.delete(`/projects/${projectId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });
}

// Proje Güncelle (İsim vb)
export function useUpdateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...data }: { id: string, name?: string }) => {
            if (id.startsWith('guest_')) {
                updateGuestProject(id, data);
                return { success: true, data };
            }
            const response = await api.put(`/projects/${id}`, data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["projects", variables.id] });
        },
    });
}

// Proje Ayarlarını Güncelle
export function useUpdateProjectSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, settings }: { id: string, settings: any }) => {
            if (id.startsWith('guest_')) {
                updateGuestProjectSettings(id, settings);
                return { success: true, data: settings };
            }
            const response = await api.put(`/settings/${id}`, settings);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["settings", variables.id] });
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["projects", variables.id] });
        },
    });
}
