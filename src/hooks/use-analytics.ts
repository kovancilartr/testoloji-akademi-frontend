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
        date: string;
        title: string;
        grade: number;
        correctCount: number;
        wrongCount: number;
        netCount: number;
        totalQuestions: number;
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
        enabled: true,
    });
}

export function useTeacherAnalytics() {
    return useQuery({
        queryKey: ["analytics", "teacher"],
        queryFn: async () => {
            const response = await api.get("/analytics/teacher/overview");
            return response.data.data as TeacherAnalytics;
        },
    });
}
