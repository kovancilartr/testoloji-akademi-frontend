import { PixelCrop } from "react-image-crop";

export interface LoadedPdf {
    id: string;
    file: File;
    doc: any;
    numPages: number;
}

export interface PendingQuestion {
    id: string;
    pdfId: string;
    pdfName: string;
    page: number;
    crop: PixelCrop;
    previewUrl: string;
    correctAnswer?: string | null;
    difficulty?: number | null;
}

export interface PdfCropperProps {
    projectId: string;
    onQuestionAdded: (question: any) => void;
}
