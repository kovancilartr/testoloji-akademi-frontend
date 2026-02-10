import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

export interface Course {
    id: string;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    isPublished: boolean;
    enrollments?: { studentId: string }[];
    _count?: {
        modules: number;
        enrollments: number;
    };
    createdAt: string;
}

export interface CourseModule {
    id: string;
    title: string;
    order: number;
    contents: CourseContent[];
}

export interface CourseContent {
    id: string;
    title: string;
    type: 'VIDEO' | 'PDF' | 'TEST' | 'TEXT';
    url?: string;
    projectId?: string;
    project?: {
        id: string;
        name: string;
    };
    order: number;
}

export function useCourses() {
    return useQuery({
        queryKey: ["courses"],
        queryFn: async () => {
            const response = await api.get("/courses");
            return response.data.data as Course[];
        },
    });
}

export function useAdminAllCourses() {
    return useQuery({
        queryKey: ["admin-courses"],
        queryFn: async () => {
            const response = await api.get("/courses/admin/all");
            return response.data.data as (Course & { instructor: { name: string, email: string } })[];
        },
    });
}

export function useCourse(id: string) {
    return useQuery({
        queryKey: ["courses", id],
        queryFn: async () => {
            const response = await api.get(`/courses/${id}`);
            return response.data.data as Course & { modules: CourseModule[] };
        },
        enabled: !!id
    });
}

export function useCreateCourse() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<Course>) => {
            const response = await api.post("/courses", data);
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
    });
}

export function useAddModule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ courseId, title, order }: { courseId: string, title: string, order: number }) => {
            const response = await api.post(`/courses/${courseId}/modules`, { title, order });
            return response.data.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["courses", variables.courseId] });
        },
    });
}

export function useAddContent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ moduleId, courseId, data }: { moduleId: string, courseId: string, data: any }) => {
            const response = await api.post(`/courses/modules/${moduleId}/contents`, data);
            return response.data.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["courses", variables.courseId] });
        },
    });
}

export function useUpdateCourse() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string, data: any }) => {
            const response = await api.patch(`/courses/${id}`, data);
            return response.data.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["courses", variables.id] });
        },
    });
}

export function useEnrollStudent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ courseId, studentId }: { courseId: string, studentId: string }) => {
            const response = await api.post(`/courses/${courseId}/enroll`, { studentId });
            return response.data.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["courses", variables.courseId] });
        },
    });
}

export function useUnenrollStudent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ courseId, studentId }: { courseId: string, studentId: string }) => {
            const response = await api.delete(`/courses/${courseId}/enroll/${studentId}`);
            return response.data.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["courses", variables.courseId] });
        },
    });
}

export function useReorderModules() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ courseId, moduleIds }: { courseId: string, moduleIds: string[] }) => {
            const response = await api.post(`/courses/${courseId}/modules/reorder`, { moduleIds });
            return response.data.data;
        },
        onMutate: async ({ courseId, moduleIds }) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ["courses", courseId] });

            // Snapshot the previous value
            const previousCourse = queryClient.getQueryData(["courses", courseId]);

            // Optimistically update to the new value
            queryClient.setQueryData(["courses", courseId], (old: any) => {
                if (!old) return old;
                const newModules = [...old.modules].sort((a, b) =>
                    moduleIds.indexOf(a.id) - moduleIds.indexOf(b.id)
                );
                return { ...old, modules: newModules };
            });

            // Return a context object with the snapshotted value
            return { previousCourse };
        },
        onError: (err, variables, context: any) => {
            if (context?.previousCourse) {
                queryClient.setQueryData(["courses", variables.courseId], context.previousCourse);
            }
        },
        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: ["courses", variables.courseId] });
        },
    });
}

export function useReorderContents() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ courseId, moduleId, contentIds }: { courseId: string, moduleId: string, contentIds: string[] }) => {
            const response = await api.post(`/courses/modules/${moduleId}/contents/reorder`, { contentIds });
            return response.data.data;
        },
        onMutate: async ({ courseId, moduleId, contentIds }) => {
            await queryClient.cancelQueries({ queryKey: ["courses", courseId] });
            const previousCourse = queryClient.getQueryData(["courses", courseId]);

            queryClient.setQueryData(["courses", courseId], (old: any) => {
                if (!old) return old;
                const newModules = old.modules.map((m: any) => {
                    if (m.id === moduleId) {
                        const newContents = [...m.contents].sort((a, b) =>
                            contentIds.indexOf(a.id) - contentIds.indexOf(b.id)
                        );
                        return { ...m, contents: newContents };
                    }
                    return m;
                });
                return { ...old, modules: newModules };
            });

            return { previousCourse };
        },
        onError: (err, variables, context: any) => {
            if (context?.previousCourse) {
                queryClient.setQueryData(["courses", variables.courseId], context.previousCourse);
            }
        },
        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: ["courses", variables.courseId] });
        },
    });
}

// --- ÖĞRENCİ HOOKLARI ---

export function useMyCourses() {
    return useQuery({
        queryKey: ["my-courses"],
        queryFn: async () => {
            const response = await api.get("/courses/my-courses");
            return response.data.data;
        },
    });
}

export function useMyCourse(id: string) {
    return useQuery({
        queryKey: ["my-courses", id],
        queryFn: async () => {
            const response = await api.get(`/courses/my-courses/${id}`);
            return response.data.data;
        },
        enabled: !!id,
    });
}

export function useUpdateProgress() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ courseId, contentId, status }: { courseId: string, contentId: string, status: string }) => {
            const response = await api.post(`/courses/my-courses/${courseId}/progress/${contentId}`, { status });
            return response.data.data;
        },
        onMutate: async ({ courseId, contentId, status }) => {
            // Cancel outgoing refetches to avoid overwriting optimistic update
            await queryClient.cancelQueries({ queryKey: ["my-courses", courseId] });

            // Snapshot previous value
            const previousCourse = queryClient.getQueryData(["my-courses", courseId]);

            // Optimistically update
            queryClient.setQueryData(["my-courses", courseId], (old: any) => {
                if (!old) return old;

                const newModules = old.modules.map((m: any) => ({
                    ...m,
                    contents: m.contents.map((c: any) => {
                        if (c.id === contentId) {
                            return {
                                ...c,
                                progress: [{ status, updatedAt: new Date().toISOString() }]
                            };
                        }
                        return c;
                    })
                }));

                return { ...old, modules: newModules };
            });

            return { previousCourse };
        },
        onError: (err, variables, context: any) => {
            if (context?.previousCourse) {
                queryClient.setQueryData(["my-courses", variables.courseId], context.previousCourse);
            }
            toast.error("İlerleme kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
        },
        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: ["my-courses", variables.courseId] });
        },
    });
}

export function useStartTest() {
    return useMutation({
        mutationFn: async ({ courseId, contentId }: { courseId: string, contentId: string }) => {
            const response = await api.post(`/courses/my-courses/${courseId}/start-test/${contentId}`);
            return response.data.data; // { assignmentId }
        }
    });
}

export function useUpdateModule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ moduleId, courseId, title }: { moduleId: string, courseId: string, title: string }) => {
            const response = await api.patch(`/courses/modules/${moduleId}`, { title });
            return response.data.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["courses", variables.courseId] });
        },
    });
}

export function useDeleteModule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ moduleId, courseId }: { moduleId: string, courseId: string }) => {
            const response = await api.delete(`/courses/modules/${moduleId}`);
            return response.data.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["courses", variables.courseId] });
        },
    });
}

export function useUpdateContent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ contentId, courseId, data }: { contentId: string, courseId: string, data: any }) => {
            const response = await api.patch(`/courses/contents/${contentId}`, data);
            return response.data.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["courses", variables.courseId] });
        },
    });
}

export function useDeleteContent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ contentId, courseId }: { contentId: string, courseId: string }) => {
            const response = await api.delete(`/courses/contents/${contentId}`);
            return response.data.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["courses", variables.courseId] });
        },
    });
}
