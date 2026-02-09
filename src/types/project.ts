import { Question } from './question';

export interface Project {
    id: string;
    name: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    questions?: Question[];
    settings?: {
        title?: string;
        subtitle?: string;
        schoolName?: string;
        colCount?: number;
        questionSpacing?: number;
        watermarkText?: string;
        showDifficulty?: boolean;
        showAnswerKey?: boolean;
        qrCodeUrl?: string;
        primaryColor?: string;
        fontFamily?: string;
    };
    _count?: {
        questions: number;
    };
}
