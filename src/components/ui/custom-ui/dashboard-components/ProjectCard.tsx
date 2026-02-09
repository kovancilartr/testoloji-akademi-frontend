"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Sparkles, Check, Maximize2, Pencil } from "lucide-react";

interface ProjectCardProps {
    project: any;
    isSelectionMode: boolean;
    isSelected: boolean;
    onToggleSelection: (id: string, e: React.MouseEvent) => void;
    onDeleteClick: (project: { id: string, name: string }, e: React.MouseEvent) => void;
    onEditClick: (project: { id: string, name: string }, e: React.MouseEvent) => void;
    onClick: () => void;
}

export const ProjectCard = ({
    project,
    isSelectionMode,
    isSelected,
    onToggleSelection,
    onDeleteClick,
    onEditClick,
    onClick
}: ProjectCardProps) => {
    return (
        <div
            onClick={(e) => {
                if (isSelectionMode) {
                    onToggleSelection(project.id, e);
                } else {
                    onClick();
                }
            }}
            className="group relative cursor-pointer"
        >
            <div className="relative pt-4">
                {/* Folder Tab */}
                <div className={`absolute top-0 left-0 w-14 h-5 border-t border-x rounded-t-xl z-[5] transition-all duration-300 ${isSelected ? 'bg-brand-500 border-brand-500' : 'bg-white border-gray-100 group-hover:bg-brand-50'}`} />

                {/* Folder Body */}
                <Card className={`relative z-10 h-44 rounded-b-2xl rounded-tr-2xl border-none shadow-sm transition-all duration-500 overflow-hidden flex flex-col ${isSelected ? 'bg-brand-50 ring-2 ring-brand-500 shadow-2xl shadow-brand-500/20' : 'bg-white group-hover:shadow-2xl group-hover:shadow-brand-500/10'}`}>
                    {/* Selection Indicator Overlay */}
                    {isSelectionMode && (
                        <div className={`absolute top-3 right-3 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all z-20 ${isSelected ? 'bg-brand-500 border-brand-500 scale-110 shadow-lg shadow-brand-500/30' : 'bg-white/80 border-gray-200'}`}>
                            {isSelected && <Check className="h-4 w-4 text-white font-black" />}
                        </div>
                    )}

                    <div className="p-5 pb-2 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-auto">
                            <div className={`p-2 rounded-xl transition-all duration-300 ${isSelected ? 'bg-brand-500 rotate-6' : 'bg-brand-50 group-hover:bg-brand-500 group-hover:rotate-6'}`}>
                                <FileText className={`h-4 w-4 transition-colors ${isSelected ? 'text-white' : 'text-brand-600 group-hover:text-white'}`} />
                            </div>
                            {!isSelectionMode && (
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg text-gray-400 bg-gray-50/50 hover:text-white hover:bg-brand-500 transition-all opacity-100 sm:opacity-0 group-hover:opacity-100 shadow-sm border border-gray-100 z-30 cursor-pointer"
                                        onClick={(e) => onEditClick({ id: project.id, name: project.name }, e)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg text-gray-400 bg-gray-50/50 hover:text-white hover:bg-red-500 transition-all opacity-100 sm:opacity-0 group-hover:opacity-100 shadow-sm border border-gray-100 z-30 cursor-pointer"
                                        onClick={(e) => onDeleteClick({ id: project.id, name: project.name }, e)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                        <h3 className={`text-sm font-black tracking-tight transition-colors line-clamp-2 min-h-[2.5rem] flex items-end leading-snug break-words mt-2 ${isSelected ? 'text-brand-700' : 'text-gray-900 group-hover:text-brand-500'}`}>
                            {project.name}
                        </h3>
                    </div>

                    <div className="px-5 pb-5">
                        <div className="flex items-center justify-between border-t border-gray-50/50">
                            <div className="flex items-center gap-1.5">
                                <Sparkles className={`h-3 w-3 ${isSelected ? 'text-brand-600' : 'text-brand-500'}`} />
                                <span className={`text-[11px] font-black uppercase tracking-tighter ${isSelected ? 'text-brand-600' : 'text-gray-400'}`}>
                                    {project._count?.questions || project.questions?.length || 0} Soru
                                </span>
                            </div>
                            <div className={`text-[9px] font-bold uppercase ${isSelected ? 'text-brand-400' : 'text-gray-300'}`}>
                                {new Date(project.updatedAt).toLocaleDateString("tr-TR", { month: 'short', day: 'numeric' })}
                            </div>
                        </div>
                    </div>

                    <div className={`absolute bottom-0 left-0 h-1 w-full transition-colors ${isSelected ? 'bg-brand-500' : 'bg-gray-50 group-hover:bg-brand-500/20'}`} />
                </Card>
            </div>
        </div>
    );
};
