import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface StudentAnalytics {
    studentName: string;
    courseProgress: {
        id: string;
        title: string;
        percent: number;
        completed: number;
        total: number;
    }[];
    avgScore: number;
    scoreHistory: {
        id: string;
        assignmentId: string;
        date: string;
        title: string;
        grade: number;
        correctCount: number;
        wrongCount: number;
        netCount: number;
        totalQuestions: number;
        hasAiAnalysis: boolean;
        questions: {
            id: string;
            imageUrl: string;
            correctAnswer: string | null;
            studentAnswer: string | null;
            order: number;
        }[];
    }[];
    totalExams: number;
    suggestions: {
        type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
        message: string;
        target: string;
    }[];
}

export interface TeacherAnalytics {
    totalStudents: number;
    studentData: {
        id: string;
        name: string;
        avgGrade: number;
        enrollmentCount: number;
        totalCorrect: number;
        totalWrong: number;
        avgNet: number;
    }[];
    averageClassGrade: number;
}

export function useStudentAnalytics(studentId?: string) {
    return useQuery({
        queryKey: ["analytics", "student", studentId],
        queryFn: async () => {
            const url = studentId ? `/analytics/student/${studentId}/overview` : "/analytics/my-overview";
            const response = await api.get(url);
            return response.data.data as StudentAnalytics;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}

export function useTeacherAnalytics() {
    return useQuery({
        queryKey: ["analytics", "teacher"],
        queryFn: async () => {
            const response = await api.get("/analytics/teacher/overview");
            return response.data.data as TeacherAnalytics;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}

export function useAiAnalysis(assignmentId: string | null) {
    return useQuery({
        queryKey: ["ai-analysis", assignmentId],
        queryFn: async () => {
            const response = await api.get(`/coaching/assignment/${assignmentId}/analysis`);
            return response.data?.data?.aiAnalysis as string | null;
        },
        enabled: !!assignmentId,
        staleTime: Infinity,       // Statik veri, tekrar fetch etmeye gerek yok
        gcTime: 1000 * 60 * 30,    // 30 dakika cache'de tut
    });
}

export function useCoachingHistory(isOpen: boolean, page: number = 1, limit: number = 1) {
    return useQuery({
        queryKey: ["coaching", "history", page, limit],
        queryFn: async () => {
            const response = await api.get(`/coaching/history?page=${page}&limit=${limit}`);
            return response.data?.data as {
                items: any[];
                hasMore: boolean;
                totalPages: number;
                currentPage: number;
            } | null;
        },
        enabled: isOpen,
        staleTime: 1000 * 60 * 5,  // 5 dakika boyunca yeniden fetch etme
        gcTime: 1000 * 60 * 15,    // 15 dakika cache'de tut
    });
}

export function useCoachingUsage(isOpen: boolean) {
    return useQuery({
        queryKey: ["coaching", "usage"],
        queryFn: async () => {
            const response = await api.get('/coaching/usage');
            return response.data?.data as { count: number; limit: number; remaining: number } | null;
        },
        enabled: isOpen,
        staleTime: 1000 * 60 * 2,  // 2 dakika boyunca yeniden fetch etme
        gcTime: 1000 * 60 * 10,    // 10 dakika cache'de tut
    });
}
