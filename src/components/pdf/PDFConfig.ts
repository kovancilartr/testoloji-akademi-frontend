import { createTw } from "react-pdf-tailwind";

export interface Question {
    id: string;
    imageUrl: string;
    width: number;
    height: number;
    bottomSpacing?: number;
    difficulty?: number;
    correctAnswer?: string;
    projectIndex?: number;
}

export interface PDFTemplateProps {
    questions: Question[];
    projectName: string;
    settings?: {
        title?: string;
        subtitle?: string;
        schoolName?: string;
        colCount?: number;
        questionSpacing?: number;
        watermarkText?: string;
        showDebug?: boolean;
        primaryColor?: string;
        fontFamily?: string;
        showDifficulty?: boolean;
        showAnswerKey?: boolean;
        qrCodeUrl?: string;
        template?: string;
        showCoverPage?: boolean;
        coverTitle?: string;
        coverTemplate?: 'modern_gradient' | 'minimalist_shapes' | 'creative_pattern';
        authorName?: string;
        footerText?: string;
    };
    userRole?: string;
}

export const getImageUrl = (url: string) => {
    // Base64 images (guest mode)
    if (url.startsWith('data:')) return url;
    // Full URLs
    if (url.startsWith('http')) return url;
    // Relative URLs (backend)
    return `http://localhost:4000${url}`;
};

export const USABLE_HEIGHT = 815;
export const COL_WIDTH_2 = 280;
export const COL_WIDTH_1 = 560;

export const tw = createTw({
    theme: {
        extend: {
            colors: {
                orange: { 500: "#f97316" },
                gray: { 50: "#f9fafb", 100: "#f3f4f6", 200: "#e5e7eb", 300: "#d1d5db", 400: "#9ca3af", 600: "#4b5563", 800: "#1f2937" }
            },
        },
    },
});
