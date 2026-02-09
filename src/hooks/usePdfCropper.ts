import { useState, useRef, useCallback, useEffect } from "react";
import * as pdfjs from "pdfjs-dist";
import { Crop, PixelCrop } from "react-image-crop";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { LoadedPdf, PendingQuestion } from "@/types/pdf-cropper";
import { useQueryClient } from "@tanstack/react-query";
import { optimizeImage } from "@/lib/image-optimization";
import { savePDFsToDB, getPDFsFromDB } from "@/lib/idb-utils";
import { detectQuestionBlocks, Rect } from "@/lib/opencv-utils";

import { useSettings } from "@/contexts/SettingsContext";

export function usePdfCropper(projectId: string, onQuestionAdded?: (question: any) => void) {
    const queryClient = useQueryClient();
    const { ecoMode } = useSettings();

    // PDF State
    const [pdfs, setPdfs] = useState<LoadedPdf[]>([]);
    const [activePdfIndex, setActivePdfIndex] = useState<number | null>(null);

    // Page State
    const [currentPage, setCurrentPage] = useState(1);
    const [scale, setScale] = useState(1.5);
    const [loading, setLoading] = useState(false);
    const [isRendering, setIsRendering] = useState(false);
    const renderTaskRef = useRef<any>(null);

    // Selection/Upload State
    const [uploading, setUploading] = useState(false);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [pendingQuestions, setPendingQuestions] = useState<PendingQuestion[]>([]);
    const [currentAns, setCurrentAns] = useState<string | null>(null);
    const [currentDiff, setCurrentDiff] = useState<number | null>(5);
    const [isMagicMode, setIsMagicMode] = useState(false);
    // PERSISTENCE: Initial load
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const savedQueue = localStorage.getItem(`pdf_queue_${projectId}`);
        if (savedQueue) {
            try {
                const { questions, timestamp } = JSON.parse(savedQueue);
                // 30 minutes expiry check
                const thirtyMinutes = 30 * 60 * 1000;
                if (Date.now() - timestamp < thirtyMinutes) {
                    setPendingQuestions(questions);
                } else {
                    localStorage.removeItem(`pdf_queue_${projectId}`);
                }
            } catch (e) {
                console.error("Queue restore error:", e);
            }
        }

        // Restore PDFs from IndexedDB
        const restorePDFs = async () => {
            try {
                const files = await getPDFsFromDB(projectId);
                if (files.length === 0) return;

                const loadedPdfs: LoadedPdf[] = [];

                for (const file of files) {
                    try {
                        const arrayBuffer = await file.arrayBuffer();
                        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
                        const doc = await loadingTask.promise;

                        loadedPdfs.push({
                            id: Math.random().toString(36).substr(2, 9),
                            file: file,
                            doc: doc,
                            numPages: doc.numPages
                        });
                    } catch (err) {
                        console.error(`Failed to load ${file.name}:`, err);
                    }
                }

                if (loadedPdfs.length > 0) {
                    setPdfs(loadedPdfs);
                    setActivePdfIndex(0);
                }
            } catch (e) {
                console.error("PDF restore error:", e);
            }
        };
        restorePDFs();

        setIsInitialized(true);
    }, [projectId]);

    // PERSISTENCE: Save on change
    useEffect(() => {
        if (!isInitialized) return;
        if (pendingQuestions.length > 0) {
            localStorage.setItem(`pdf_queue_${projectId}`, JSON.stringify({
                questions: pendingQuestions,
                timestamp: Date.now()
            }));
        } else {
            localStorage.removeItem(`pdf_queue_${projectId}`);
        }
    }, [pendingQuestions, projectId, isInitialized]);

    // Settings - Init based on ecoMode
    const [autoFocus, setAutoFocus] = useState(true);
    const [renderQuality, setRenderQuality] = useState(ecoMode ? 1 : 2);
    const [showSettings, setShowSettings] = useState(true);
    const [applyFilter, setApplyFilter] = useState(false);

    // Magic Scan State
    const [isScanning, setIsScanning] = useState(false);
    const [detectedRects, setDetectedRects] = useState<Rect[]>([]);

    // Clear detected rects when page or scale changes (they become invalid)
    useEffect(() => {
        setDetectedRects([]);
    }, [currentPage, scale]);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);

    const activePdf = activePdfIndex !== null ? pdfs[activePdfIndex] : null;

    const handleFileLoad = async (file: File, silent = false) => {
        if (file && file.type === "application/pdf") {
            // Prevent duplicates (by name and size)
            if (pdfs.some(p => p.file.name === file.name && p.file.size === file.size)) {
                if (!silent) toast.info(`${file.name} zaten yüklü.`);
                return;
            }

            setLoading(true);
            try {
                const arrayBuffer = await file.arrayBuffer();
                const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
                const doc = await loadingTask.promise;

                const newPdf: LoadedPdf = {
                    id: Math.random().toString(36).substr(2, 9),
                    file: file,
                    doc: doc,
                    numPages: doc.numPages
                };

                // Update state and save to DB
                setPdfs(prev => {
                    const updated = [...prev, newPdf];
                    if (!silent) {
                        savePDFsToDB(projectId, updated.map(p => p.file));
                        setActivePdfIndex(updated.length - 1);
                    } else {
                        // Silent restore: set active to first if none selected
                        if (activePdfIndex === null) {
                            setActivePdfIndex(0);
                        }
                    }
                    return updated;
                });
                setCurrentPage(1);
                setLoading(false);
                toast.success(`${file.name} yüklendi.`);
            } catch (error) {
                console.error("PDF load error:", error);
                toast.error("PDF dosyası yüklenirken bir hata oluştu.");
                setLoading(false);
            }
        }
    };

    const handleFitToWidth = async () => {
        if (!activePdf || !viewportRef.current) return;
        setLoading(true);
        try {
            const page = await activePdf.doc.getPage(currentPage);
            const viewportBase = page.getViewport({ scale: 1 });
            const isDesktop = window.innerWidth > 640;
            const padding = isDesktop ? 160 : 64;
            const containerWidth = viewportRef.current.clientWidth - padding;
            const newScale = containerWidth / viewportBase.width;
            setScale(Number(newScale.toFixed(2)));
            toast.info("Sayfa genişliğine uyarlandı.");
        } catch (error) {
            console.error("Fit width error:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderPage = useCallback(async (pageNum: number, currentScale: number, quality: number) => {
        if (!activePdf) return;

        // Cancel previous render if still running
        if (renderTaskRef.current) {
            try {
                renderTaskRef.current.cancel();
            } catch (e) {
                // Ignore cancel errors
            }
        }

        // Wait if already rendering
        if (isRendering) {
            return;
        }

        setIsRendering(true);
        setLoading(true);

        try {
            const page = await activePdf.doc.getPage(pageNum);
            const viewport = page.getViewport({ scale: currentScale * quality });
            const canvas = canvasRef.current;
            if (!canvas) {
                setIsRendering(false);
                setLoading(false);
                return;
            }

            const context = canvas.getContext("2d");
            if (!context) {
                setIsRendering(false);
                setLoading(false);
                return;
            }

            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvas.style.width = `${viewport.width / quality}px`;
            canvas.style.height = `${viewport.height / quality}px`;

            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };

            renderTaskRef.current = page.render(renderContext);
            await renderTaskRef.current.promise;
            renderTaskRef.current = null;

            setIsRendering(false);
            setLoading(false);
        } catch (error: any) {
            renderTaskRef.current = null;
            setIsRendering(false);

            // Ignore cancellation errors
            if (error?.name === 'RenderingCancelledException') {
                setLoading(false);
                return;
            }

            console.error("Page render error:", error);
            console.error("Error details:", {
                message: error?.message,
                name: error?.name,
                pageNum,
                scale: currentScale,
                quality
            });
            toast.error(`Sayfa ${pageNum} yüklenirken hata oluştu. PDF dosyası hasarlı olabilir.`);
            setLoading(false);
        }
    }, [activePdf]);

    const addToQueue = useCallback(() => {
        if (!completedCrop || !canvasRef.current || !activePdf) return;

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = completedCrop.width;
        tempCanvas.height = completedCrop.height;
        const ctx = tempCanvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(
            canvasRef.current,
            completedCrop.x, completedCrop.y, completedCrop.width, completedCrop.height,
            0, 0, completedCrop.width, completedCrop.height
        );

        if (applyFilter) {
            const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                if (avg > 180) { // Light gray -> White
                    data[i] = 255;
                    data[i + 1] = 255;
                    data[i + 2] = 255;
                } else if (avg < 100) { // Dark -> Darker
                    const factor = 0.8;
                    data[i] = data[i] * factor;
                    data[i + 1] = data[i + 1] * factor;
                    data[i + 2] = data[i + 2] * factor;
                }
            }
            ctx.putImageData(imageData, 0, 0);
        }

        const previewUrl = tempCanvas.toDataURL("image/png");

        const newPending: PendingQuestion = {
            id: Date.now().toString(),
            pdfId: activePdf.id,
            pdfName: activePdf.file.name,
            previewUrl,
            crop: completedCrop,
            difficulty: currentDiff,
            correctAnswer: currentAns,
            page: currentPage
        };

        setPendingQuestions(prev => [...prev, newPending]);
        setCrop(undefined); // Clear selection for UI
        setCompletedCrop(undefined); // Clear selection

        // --- AI TRAINING FEEDBACK LOOP ---
        // Silently send this successful crop to the backend
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
        fetch(`${baseUrl}/tools/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                crop: completedCrop,
                pageWidth: canvasRef.current.width,
                pageHeight: canvasRef.current.height,
                timestamp: Date.now()
            })
        }).then(() => console.log("🤖 AI Feedback Sent"))
            .catch(err => console.warn("AI Feedback Failed:", err));
        // ---------------------------------

        setCurrentAns(null);
        setCurrentDiff(5);

        if (applyFilter) {
            toast.success("Soru temizlenerek eklendi ✨");
        } else {
            toast.info("Soru sıraya eklendi.");
        }
    }, [completedCrop, activePdf, currentPage, currentAns, currentDiff, applyFilter]);

    const handleBatchUpload = async () => {
        if (pendingQuestions.length === 0) return;
        setUploading(true);

        try {
            const isGuestProject = projectId.startsWith('guest_');
            console.log('🔍 DEBUG - projectId:', projectId, 'isGuest:', isGuestProject);

            if (isGuestProject) {
                // Guest mode: save to LocalStorage with base64 images
                for (const q of pendingQuestions) {
                    const response = await fetch(q.previewUrl);
                    const blob = await response.blob();

                    // Convert to base64
                    const base64 = await new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.readAsDataURL(blob);
                    });

                    const newQuestion = {
                        imageUrl: base64,
                        difficulty: q.difficulty,
                        correctAnswer: q.correctAnswer,
                        createdAt: new Date().toISOString(),
                    };

                    // Use the guest function from guest-projects.ts
                    const { addGuestQuestion } = await import('@/lib/guest-projects');
                    addGuestQuestion(projectId, newQuestion);
                }

                // Invalidate query to refresh the list
                queryClient.invalidateQueries({ queryKey: ["projects", projectId] });

                toast.success(`${pendingQuestions.length} soru başarıyla yüklendi.`);
                setPendingQuestions([]);
            } else {
                // Authenticated mode: upload to backend
                const formData = new FormData();
                formData.append("projectId", projectId);

                const metadata = [];
                for (const q of pendingQuestions) {
                    const response = await fetch(q.previewUrl);
                    const blob = await response.blob();
                    const rawFile = new File([blob], `question_${q.id}.png`, { type: "image/png" });

                    // Optimizasyon
                    const optimizedFile = await optimizeImage(rawFile);
                    formData.append("images", optimizedFile);

                    metadata.push({
                        difficulty: q.difficulty,
                        correctAnswer: q.correctAnswer
                    });
                }

                formData.append("metadata", JSON.stringify(metadata));

                const { data } = await api.post('/questions/bulk-upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                if (data.success && Array.isArray(data.data)) {
                    if (onQuestionAdded) {
                        data.data.forEach((newQuestion: any) => {
                            onQuestionAdded(newQuestion);
                        });
                    }

                    // Invalidate query to refresh the list
                    queryClient.invalidateQueries({ queryKey: ["projects", projectId] });

                    toast.success(`${pendingQuestions.length} soru başarıyla yüklendi.`);
                    setPendingQuestions([]);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Sorular yüklenirken bir hata oluştu.");
        } finally {
            setUploading(false);
        }
    };

    const handleQuickSelect = useCallback(() => {
        if (!canvasRef.current || !viewportRef.current) return;

        const canvas = canvasRef.current;

        // Use client dimensions for the interactive crop component
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;

        const defaultWidth = displayWidth * 0.45;
        const defaultHeight = displayHeight * 0.2;

        const newCrop: Crop = {
            unit: 'px',
            x: (displayWidth - defaultWidth) / 2,
            y: (displayHeight - defaultHeight) / 2,
            width: defaultWidth,
            height: defaultHeight
        };

        setCrop(newCrop);

        // For the actual high-res crop, use internal canvas dimensions
        const scaleX = canvas.width / displayWidth;
        const scaleY = canvas.height / displayHeight;

        setCompletedCrop({
            unit: 'px',
            x: newCrop.x * scaleX,
            y: newCrop.y * scaleY,
            width: newCrop.width * scaleX,
            height: newCrop.height * scaleY
        });

        toast.info("Seçim alanı oluşturuldu. Köşelerden boyutlandırabilirsiniz.");
    }, [canvasRef, viewportRef]);

    const handleMagicScan = useCallback(async () => {
        if (!activePdf) return;

        if (isMagicMode) {
            // Canseled by user
            setIsMagicMode(false);
            setDetectedRects([]);
            toast.info("Sihirli Makas kapatıldı.");
        } else {
            // Activate mode
            setIsMagicMode(true);
            toast.info("Süper! 🚀 Şimdi ayrıştırmak istediğiniz soruları dikdörtgen içine alın.", { duration: 5000 });
        }
    }, [activePdf, isMagicMode]);

    return {
        pdfs, setPdfs,
        activePdfIndex, setActivePdfIndex,
        currentPage, setCurrentPage,
        scale, setScale,
        loading, setLoading,
        uploading, setUploading,
        crop, setCrop,
        completedCrop, setCompletedCrop,
        pendingQuestions, setPendingQuestions,
        currentAns, setCurrentAns,
        currentDiff, setCurrentDiff,
        autoFocus, setAutoFocus,
        renderQuality, setRenderQuality,
        showSettings, setShowSettings,
        applyFilter, setApplyFilter,
        canvasRef, viewportRef,
        activePdf,
        handleFileLoad,
        handleFitToWidth,
        renderPage,
        addToQueue,
        handleBatchUpload,
        handleQuickSelect,
        handleMagicScan,
        isScanning,
        detectedRects,
        setDetectedRects,
        isMagicMode,
        setIsMagicMode
    };
}
