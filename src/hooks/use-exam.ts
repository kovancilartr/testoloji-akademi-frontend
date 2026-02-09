
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

export interface Question {
    id: string;
    imageUrl: string;
    order: number;
    correctAnswer?: string;
}

export interface ExamData {
    id: string;
    status: string;
    project: {
        id: string;
        name: string;
        questions: Question[];
    };
    duration?: number;
    allowedAttempts?: number;
    attemptCount?: number;
    completedAt?: string;
    grade?: number;
    answers?: Record<string, string>;
    feedback?: string;
}

export function useExam(assignmentId: string) {
    const queryClient = useQueryClient();

    const examQuery = useQuery({
        queryKey: ["exam", assignmentId],
        queryFn: async () => {
            const { data } = await api.get(`/assignments/${assignmentId}`);
            return data.data as ExamData;
        },
        enabled: !!assignmentId
    });

    const submitMutation = useMutation({
        mutationFn: async (answers: Record<string, string>) => {
            const { data } = await api.post(`/assignments/${assignmentId}/submit`, { answers });
            return data;
        },
        onSuccess: () => {
            toast.success("Sınav başarıyla tamamlandı!");
            queryClient.invalidateQueries({ queryKey: ["exam", assignmentId] });
            queryClient.invalidateQueries({ queryKey: ["assignments"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Sınav gönderilemedi");
        }
    });

    return {
        exam: examQuery.data,
        isLoading: examQuery.isLoading,
        isError: examQuery.isError,
        submitExam: submitMutation.mutateAsync,
        isSubmitting: submitMutation.isPending
    };
}
