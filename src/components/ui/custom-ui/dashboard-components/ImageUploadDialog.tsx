"use client";

import React, { useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Upload, X, Image as ImageIcon, Loader2, Sparkles } from "lucide-react";
import { useBulkUploadQuestions } from "@/hooks/use-questions";
import { optimizeImage } from "@/lib/image-optimization";
import { toast } from "sonner";

interface ImageUploadDialogProps {
    projectId: string;
    onBeforeOpen?: () => boolean; // Return true to allow opening
}

export default function ImageUploadDialog({ projectId, onBeforeOpen }: ImageUploadDialogProps) {
    const [open, setOpen] = useState(false);

    const handleOpenClick = (e: React.MouseEvent) => {
        if (onBeforeOpen) {
            const allowed = onBeforeOpen();
            if (!allowed) return;
        }
        setOpen(true);
    };
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const bulkUploadMutation = useBulkUploadQuestions();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length === 0) return;

        setIsOptimizing(true);
        try {
            const optimizedFiles = await Promise.all(
                selectedFiles.map(async (file) => {
                    try {
                        return await optimizeImage(file);
                    } catch (err) {
                        return file; // Fallback to original
                    }
                })
            );

            setFiles(prev => [...prev, ...optimizedFiles]);

            const newPreviews = optimizedFiles.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        } catch (error) {
            toast.error("Görseller işlenirken bir hata oluştu.");
        } finally {
            setIsOptimizing(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeFile = (index: number) => {
        URL.revokeObjectURL(previews[index]);
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = () => {
        if (files.length === 0) return;

        bulkUploadMutation.mutate({ projectId, files }, {
            onSuccess: () => {
                setOpen(false);
                setFiles([]);
                setPreviews([]);
            }
        });
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const onDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const droppedFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        if (droppedFiles.length === 0) return;

        setIsOptimizing(true);
        try {
            const optimizedFiles = await Promise.all(
                droppedFiles.map(async (file) => {
                    try {
                        return await optimizeImage(file);
                    } catch (err) {
                        return file;
                    }
                })
            );

            setFiles(prev => [...prev, ...optimizedFiles]);
            const newPreviews = optimizedFiles.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        } finally {
            setIsOptimizing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button
                variant="outline"
                onClick={handleOpenClick}
                className="h-10 bg-white border-brand-100 hover:border-brand-500 hover:text-brand-500 rounded-xl px-4 font-bold text-xs gap-2 transition-all shadow-sm group shrink-0 cursor-pointer"
            >
                <Plus className="h-4 w-4 text-brand-500 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline tracking-widest text-xs dialog-text-span">Görselden Soru Ekle</span>
            </Button>
            <DialogContent className="sm:max-w-2xl rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
                <div className="p-8 space-y-6">
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="bg-brand-100 p-2.5 rounded-2xl">
                                <ImageIcon className="h-6 w-6 text-brand-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black tracking-tight">Toplu Görsel Yükle</DialogTitle>
                                <DialogDescription className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">
                                    Soru görsellerini sürükleyip bırakarak veya seçerek topluca ekleyin.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Drop Zone */}
                    <div
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className="group relative cursor-pointer"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-pink-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative border-2 border-dashed border-brand-100 bg-brand-50/30 hover:bg-white hover:border-brand-500 rounded-3xl p-10 transition-all duration-300 flex flex-col items-center justify-center gap-4">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                            />

                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-brand-50 group-hover:scale-110 transition-transform duration-500">
                                {isOptimizing ? (
                                    <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
                                ) : (
                                    <Upload className="h-8 w-8 text-brand-500" />
                                )}
                            </div>

                            <div className="text-center">
                                <p className="text-sm font-black text-gray-900 leading-tight">Yüklemek istediğiniz görselleri buraya sürükleyin</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Veya bilgisayarınızdan seçmek için tıklayın</p>
                            </div>

                            <div className="flex gap-2">
                                <div className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-tighter">PNG</div>
                                <div className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-tighter">JPG</div>
                                <div className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-tighter">WEBP</div>
                            </div>
                        </div>
                    </div>

                    {/* Previews */}
                    {previews.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-2">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Seçilen Görseller ({files.length})</h4>
                                <Button
                                    variant="ghost"
                                    onClick={() => { setFiles([]); setPreviews([]); }}
                                    className="h-6 text-[9px] font-black text-red-400 hover:text-red-500 hover:bg-red-50 uppercase tracking-widest rounded-lg"
                                >
                                    Tümünü Temizle
                                </Button>
                            </div>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-[200px] overflow-y-auto custom-scrollbar p-1">
                                {previews.map((preview, index) => (
                                    <div key={index} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                                        <img src={preview} alt="preview" className="w-full h-full object-cover" />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                            className="absolute top-1 right-1 p-1 bg-white/90 rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50/80 p-6 flex items-center justify-between border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-brand-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Yapay zeka ile optimize ediliyor</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            className="rounded-xl font-bold text-xs px-6 h-12"
                        >
                            İptal
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={files.length === 0 || bulkUploadMutation.isPending}
                            className="bg-brand-500 hover:bg-brand-600 text-white rounded-2xl px-10 h-12 font-black shadow-xl shadow-brand-500/20 gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                        >
                            {bulkUploadMutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Yükleniyor...</span>
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4" />
                                    <span>{files.length} Soru Ekle</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
