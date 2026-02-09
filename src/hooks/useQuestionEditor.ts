import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { optimizeImage } from "@/lib/image-optimization";

export function useQuestionEditor(projectId: string, onQuestionAdded?: (question: any) => void) {
    const queryClient = useQueryClient();
    const [content, setContent] = useState("");
    const [currentAns, setCurrentAns] = useState<string | null>(null);
    const [currentDiff, setCurrentDiff] = useState<number>(5);
    const [uploading, setUploading] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    // Simple auto-save to local storage
    useEffect(() => {
        const saved = localStorage.getItem("last_rendered_question");
        if (saved) setContent(saved);
    }, []);

    useEffect(() => {
        localStorage.setItem("last_rendered_question", content);
    }, [content]);

    const insertMath = (latex: string) => {
        setContent(prev => prev + latex);
    };

    const handleUpload = async (onClose: () => void) => {
        if (!content.trim()) {
            toast.error("Lütfen soru içeriği yazın.");
            return;
        }

        if (!currentAns) {
            toast.error("Lütfen doğru cevabı seçin.");
            return;
        }

        setUploading(true);
        try {
            const { toPng } = await import('html-to-image');
            if (!previewRef.current) return;

            const dataUrl = await toPng(previewRef.current, {
                quality: 1,
                pixelRatio: 3,
                backgroundColor: '#ffffff',
            });

            const blob = await (await fetch(dataUrl)).blob();
            const rawFile = new File([blob], "question.png", { type: "image/png" });

            // Optimizasyon
            const optimizedFile = await optimizeImage(rawFile);

            const formData = new FormData();
            formData.append("projectId", projectId);
            formData.append("image", optimizedFile);
            formData.append("correctAnswer", currentAns);
            formData.append("difficulty", String(currentDiff));

            const { data } = await api.post('/questions/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (onQuestionAdded) {
                onQuestionAdded(data.data);
            }

            // Invalidate project query to refresh data
            queryClient.invalidateQueries({ queryKey: ["projects", projectId] });

            toast.success("Soru başarıyla oluşturuldu ve yüklendi.");
            onClose();
            setContent("");
            setCurrentAns(null);
            setCurrentDiff(5);
        } catch (error) {
            console.error(error);
            toast.error("Soru yüklenirken bir hata oluştu.");
        } finally {
            setUploading(false);
        }
    };

    return {
        content, setContent,
        currentAns, setCurrentAns,
        currentDiff, setCurrentDiff,
        uploading, setUploading,
        previewRef: previewRef as React.RefObject<HTMLDivElement>,
        insertMath,
        handleUpload
    };
}
