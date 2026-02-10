import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Question } from "@/types/question";
import { ApiResponse } from "@/types/auth";
import { toast } from "sonner";
import {
    updateGuestQuestion,
    deleteGuestQuestion,
    reorderGuestQuestions,
    addGuestQuestion,
    getGuestProject
} from "@/lib/guest-projects";

export function useUpdateQuestionDetail() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data, projectId }: { id: string, data: Partial<Question>, projectId?: string }) => {
            const isGuestProject = projectId?.startsWith('guest_');

            if (isGuestProject && projectId) {
                // Guest mode: update in LocalStorage
                updateGuestQuestion(projectId, id, data);
                return { data: { ...data, id } };
            } else {
                // Authenticated mode: update via API
                const response = await api.put<ApiResponse<Question>>(`/questions/${id}`, data);
                return response.data;
            }
        },
        onMutate: async ({ id, data, projectId }) => {
            // Cancel outgoing refetches
            if (projectId) {
                await queryClient.cancelQueries({ queryKey: ["projects", projectId] });
            } else {
                await queryClient.cancelQueries({ queryKey: ["projects"] });
            }

            // Snapshot the previous projects/project
            const previousData = projectId
                ? queryClient.getQueryData(["projects", projectId])
                : queryClient.getQueriesData({ queryKey: ["projects"] });

            // Optimistic update
            if (projectId) {
                queryClient.setQueryData(["projects", projectId], (old: any) => {
                    if (!old || !old.questions) return old;
                    return {
                        ...old,
                        questions: old.questions.map((q: any) =>
                            q.id === id ? { ...q, ...data } : q
                        )
                    };
                });
            } else {
                queryClient.setQueriesData<any>({ queryKey: ["projects"] }, (old: any) => {
                    if (!old) return old;
                    if (Array.isArray(old)) return old; // Skip project list
                    if (!old.questions) return old;
                    return {
                        ...old,
                        questions: old.questions.map((q: any) =>
                            q.id === id ? { ...q, ...data } : q
                        )
                    };
                });
            }

            return { previousData };
        },
        onError: (error: any, variables, context: any) => {
            if (context?.previousData) {
                if (variables.projectId) {
                    queryClient.setQueryData(["projects", variables.projectId], context.previousData);
                } else {
                    context.previousData.forEach(([key, value]: any) => {
                        queryClient.setQueryData(key, value);
                    });
                }
            }
            const errorMessage = error.response?.data?.message || "Güncelleme başarısız.";
            toast.error(errorMessage);
        },
        onSettled: (data, error, variables) => {
            // Always refetch to stay in sync
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        }
    });
}

export function useDeleteQuestion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, projectId }: { id: string, projectId: string }) => {
            const isGuestQuestion = id.startsWith('guest_q_');

            if (isGuestQuestion) {
                deleteGuestQuestion(projectId, id);
            } else {
                await api.delete(`/questions/${id}`);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            toast.success("Soru silindi.");
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || "Silme başarısız.";
            toast.error(errorMessage);
        }
    });
}

export function useReorderQuestions() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ projectId, questionIds }: { projectId: string, questionIds: string[] }) => {
            const isGuestProject = projectId.startsWith('guest_');

            if (isGuestProject) {
                const project = getGuestProject(projectId);
                if (project) {
                    const questionMap = new Map(project.questions.map(q => [q.id, q]));
                    const reorderedQuestions = questionIds.map(id => questionMap.get(id)).filter(Boolean);
                    reorderGuestQuestions(projectId, reorderedQuestions as any[]);
                }
            } else {
                await api.post('/questions/reorder', { projectId, questionIds });
            }
        },
        onMutate: async ({ projectId, questionIds }) => {
            await queryClient.cancelQueries({ queryKey: ["projects", projectId] });
            const previousProject = queryClient.getQueryData(["projects", projectId]);

            // Optimistically update the local cache
            queryClient.setQueryData(["projects", projectId], (old: any) => {
                if (!old) return old;
                // Create a new array based on the new question order
                const questionMap = new Map(old.questions.map((q: any) => [q.id, q]));
                const newQuestions = questionIds.map(id => questionMap.get(id)).filter(Boolean);

                return {
                    ...old,
                    questions: newQuestions
                };
            });

            return { previousProject };
        },
        onError: (error: any, variables, context) => {
            if (context?.previousProject) {
                queryClient.setQueryData(["projects", variables.projectId], context.previousProject);
            }
            const errorMessage = error.response?.data?.message || "Sıralama kaydedilemedi.";
            toast.error(errorMessage);
        },
        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId] });
        }
    });
}

export function useUploadQuestion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ projectId, file }: { projectId: string, file: File }) => {
            const isGuestProject = projectId.startsWith('guest_');

            if (isGuestProject) {
                // Convert file to base64 for guest users
                return new Promise(async (resolve, reject) => {
                    const reader = new FileReader();
                    const dimensions = await import('@/lib/image-optimization').then(m => m.getImageDimensions(file));

                    reader.onload = () => {
                        const base64 = reader.result as string;
                        const newQuestion = addGuestQuestion(projectId, {
                            imageUrl: base64,
                            width: dimensions.width,
                            height: dimensions.height,
                            createdAt: new Date().toISOString(),
                        });
                        resolve(newQuestion);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            } else {
                const formData = new FormData();
                formData.append("projectId", projectId);
                formData.append("image", file);
                const { data } = await api.post<ApiResponse<Question>>('/questions/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                return data.data;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            toast.success("Soru yüklendi.");
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || "Yükleme başarısız.";
            toast.error(errorMessage);
        }
    });
}

export function useBulkUploadQuestions() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ projectId, files }: { projectId: string, files: File[] }) => {
            const isGuestProject = projectId.startsWith('guest_');

            if (isGuestProject) {
                // Guest mode: convert to base64 and save to LocalStorage
                const results = [];
                const { getImageDimensions } = await import('@/lib/image-optimization');

                for (const file of files) {
                    const dimensions = await getImageDimensions(file);
                    const base64 = await new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });

                    const newQuestion = addGuestQuestion(projectId, {
                        imageUrl: base64,
                        width: dimensions.width,
                        height: dimensions.height,
                        createdAt: new Date().toISOString(),
                    });

                    if (newQuestion) results.push(newQuestion);
                }
                return results;
            } else {
                // Authenticated mode: upload to backend
                const formData = new FormData();
                formData.append("projectId", projectId);
                files.forEach(file => {
                    formData.append("images", file);
                });
                const { data } = await api.post<ApiResponse<Question[]>>('/questions/bulk-upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                return data.data;
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            toast.success(`${data.length} soru başarıyla yüklendi.`);
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || "Toplu yükleme başarısız.";
            toast.error(errorMessage);
        }
    });
}
