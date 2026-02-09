export interface Question {
    id: string;
    projectId: string;
    imageUrl: string;
    order: number;
    width: number;
    height: number;
    bottomSpacing: number;
    difficulty?: number;
    correctAnswer?: string;
    createdAt: string;
    updatedAt: string;
}
