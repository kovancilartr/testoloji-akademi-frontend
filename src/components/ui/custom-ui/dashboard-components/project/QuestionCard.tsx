"use client";

import { GripVertical, Maximize2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Draggable } from "@hello-pangea/dnd";

interface QuestionCardProps {
    question: any;
    index: number;
    getImageUrl: (url: string) => string;
    onImagePreview: (url: string) => void;
    onUpdateSpacing: (id: string, spacing: number) => void;
    onUpdateDetail: (id: string, data: { difficulty?: number, correctAnswer?: string }) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
}

export const QuestionCard = ({
    question,
    index,
    getImageUrl,
    onImagePreview,
    onUpdateSpacing,
    onUpdateDetail,
    onDelete
}: QuestionCardProps) => {
    return (
        <Draggable key={question.id} draggableId={question.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`
                        bg-white rounded-3xl border transition-all group overflow-hidden flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 p-4
                        ${snapshot.isDragging ? 'border-brand-500 shadow-2xl scale-[1.02] z-40 bg-brand-50/20' : 'border-gray-50 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/5'}
                    `}
                >
                    <div className="flex items-center justify-between sm:justify-start gap-4">
                        <div className="flex items-center gap-3">
                            {/* Drag Handle */}
                            <div {...provided.dragHandleProps} className="p-2 cursor-grab active:cursor-grabbing text-gray-300 hover:text-brand-500 transition-colors">
                                <GripVertical className="h-5 w-5" />
                            </div>

                            {/* Index & Thumbnail */}
                            <div className="flex items-center gap-4 shrink-0">
                                <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-black text-[11px] shadow-lg shadow-brand-500/20">
                                    {index + 1}
                                </div>
                                <div
                                    onClick={() => onImagePreview(getImageUrl(question.imageUrl))}
                                    className="relative w-20 h-14 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden cursor-zoom-in hover:ring-2 hover:ring-brand-500/40 transition-all flex items-center justify-center group/thumb"
                                >
                                    <img
                                        src={getImageUrl(question.imageUrl)}
                                        className="max-h-full max-w-full object-contain p-1"
                                        alt={`Soru ${index + 1}`}
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/5 flex items-center justify-center transition-colors">
                                        <Maximize2 className="h-4 w-4 text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Delete Button */}
                        <div className="sm:hidden">
                            <Button
                                variant="ghost" size="icon"
                                className="h-9 w-9 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-100 shadow-sm"
                                onClick={(e) => onDelete(question.id, e)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-1 items-end gap-3 sm:gap-5 pt-3 sm:pt-0 border-t sm:border-none border-gray-50">
                        {/* Spacing Select */}
                        <div className="flex-1 min-w-0 sm:max-w-[120px] space-y-1.5">
                            <label className="text-[8px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5 px-1 truncate">
                                Mizanpaj
                            </label>
                            <Select
                                value={String(question.bottomSpacing || 20)}
                                onValueChange={(val) => onUpdateSpacing(question.id, parseInt(val))}
                            >
                                <SelectTrigger className="h-9 bg-gray-50/50 border-gray-100 rounded-xl font-bold text-[10px] focus:ring-brand-500/20 hover:bg-white transition-colors">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-gray-100 shadow-2xl">
                                    {[5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(v => (
                                        <SelectItem key={v} value={String(v)} className="font-bold text-[10px]">{v}mm</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Difficulty Select */}
                        <div className="flex-1 min-w-0 sm:max-w-[100px] space-y-1.5">
                            <label className="text-[8px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5 px-1 truncate">
                                Zorluk
                            </label>
                            <Select
                                value={String(question.difficulty || 5)}
                                onValueChange={(val) => onUpdateDetail(question.id, { difficulty: parseInt(val) })}
                            >
                                <SelectTrigger className="h-9 bg-gray-50/50 border-gray-100 rounded-xl font-bold text-[10px] focus:ring-brand-500/20 hover:bg-white transition-colors">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-gray-100 shadow-2xl">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (
                                        <SelectItem key={v} value={String(v)} className="font-bold text-[10px]">{v} Puan</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Correct Answer Select */}
                        <div className="flex-1 min-w-0 sm:max-w-[100px] space-y-1.5">
                            <label className="text-[8px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5 px-1 truncate">
                                Cevap
                            </label>
                            <Select
                                value={question.correctAnswer || ""}
                                onValueChange={(val) => onUpdateDetail(question.id, { correctAnswer: val })}
                            >
                                <SelectTrigger className="h-9 bg-gray-50/50 border-gray-100 rounded-xl font-bold text-[10px] focus:ring-brand-500/20 hover:bg-white transition-colors">
                                    <SelectValue placeholder="..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-gray-100 shadow-2xl">
                                    {["A", "B", "C", "D", "E"].map(v => (
                                        <SelectItem key={v} value={v} className="font-bold text-[10px]">{v}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Desktop Delete Action */}
                        <div className="hidden sm:block ml-auto shrink-0">
                            <Button
                                variant="ghost" size="icon"
                                className="h-9 w-9 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-100 hover:border-red-500 shadow-sm"
                                onClick={(e) => onDelete(question.id, e)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};
