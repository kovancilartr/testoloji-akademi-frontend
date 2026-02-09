"use client";

import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Plus, Video, FileText, ClipboardList,
    MoreVertical, PlayIcon, FileIcon, ListChecks, Trash2, Edit3,
    ChevronDown, ChevronUp, GripVertical
} from "lucide-react";
import { CourseEmptyState } from "./CourseEmptyState";
import React from 'react';

interface CourseContentListProps {
    course: any; // Type for course object
    expandedModules: string[];
    toggleModule: (moduleId: string) => void;
    onDragEnd: (result: DropResult) => void;
    onAddModule: () => void;
    onAddContent: (moduleId: string) => void;
    onEditModule: (module: any) => void;
    onDeleteModule: (moduleId: string) => void;
    onEditContent: (moduleId: string, content: any) => void;
    onDeleteContent: (contentId: string) => void;
}

export function CourseContentList({
    course,
    expandedModules,
    toggleModule,
    onDragEnd,
    onAddModule,
    onAddContent,
    onEditModule,
    onDeleteModule,
    onEditContent,
    onDeleteContent
}: CourseContentListProps) {

    if (!course?.modules || course.modules.length === 0) {
        return <CourseEmptyState onAddModule={onAddModule} />;
    }

    return (
        <div className="space-y-4 pb-24">
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="modules" type="module">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                            {course.modules.map((module: any, index: number) => {
                                const isExpanded = expandedModules.includes(module.id);
                                return (
                                    <Draggable key={module.id} draggableId={module.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                                            >
                                                <div
                                                    className={`p-4 md:p-5 flex items-center justify-between cursor-pointer group/header select-none transition-colors ${isExpanded ? 'bg-slate-50/50 border-b border-slate-100' : 'bg-white'}`}
                                                    onClick={() => toggleModule(module.id)}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="p-1 rounded-md transition-colors text-slate-300 group-hover/header:text-orange-400">
                                                            <GripVertical className="w-4 h-4" />
                                                        </div>
                                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs shrink-0">
                                                            {index + 1}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h3 className="font-bold text-slate-800 text-sm md:text-base truncate group-hover/header:text-orange-500 transition-colors">
                                                                {module.title}
                                                            </h3>
                                                            <p className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                                {module.contents.length} İÇERİK
                                                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-1 md:gap-2 shrink-0">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 px-2 md:px-3 text-orange-600 font-black text-[10px] md:text-xs rounded-lg hover:bg-orange-50"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onAddContent(module.id);
                                                            }}
                                                        >
                                                            <Plus className="w-4 h-4 md:mr-1" /> <span className="hidden md:inline">İÇERİK EKLE</span>
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-slate-600 rounded-lg">
                                                                    <MoreVertical className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="rounded-xl border-slate-200">
                                                                <DropdownMenuItem
                                                                    className="text-xs font-bold p-2.5 cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onEditModule(module);
                                                                    }}
                                                                >
                                                                    <Edit3 className="w-4 h-4 mr-2" /> Bölümü Düzenle
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="text-xs font-bold p-2.5 text-red-600 cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onDeleteModule(module.id);
                                                                    }}
                                                                >
                                                                    <Trash2 className="w-4 h-4 mr-2" /> Bölümü Sil
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>

                                                {isExpanded && (
                                                    <Droppable droppableId={module.id} type="content">
                                                        {(contentProvided) => (
                                                            <div
                                                                {...contentProvided.droppableProps}
                                                                ref={contentProvided.innerRef}
                                                                className="divide-y divide-slate-50 animate-in slide-in-from-top-1 duration-200"
                                                            >
                                                                {module.contents.length === 0 ? (
                                                                    <div className="p-10 text-center space-y-3">
                                                                        <p className="text-slate-400 text-xs md:text-sm font-medium">Bu bölüme henüz içerik eklemediniz.</p>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="text-[10px] font-black h-8 rounded-lg border-slate-200"
                                                                            onClick={() => onAddContent(module.id)}
                                                                        >
                                                                            Hemen Ekle
                                                                        </Button>
                                                                    </div>
                                                                ) : (
                                                                    module.contents.map((content: any, contentIndex: number) => (
                                                                        <Draggable key={content.id} draggableId={content.id} index={contentIndex}>
                                                                            {(contentDraggableProvided) => (
                                                                                <div
                                                                                    ref={contentDraggableProvided.innerRef}
                                                                                    {...contentDraggableProvided.draggableProps}
                                                                                    {...contentDraggableProvided.dragHandleProps}
                                                                                    className="group/item flex items-center justify-between p-3 md:p-4 hover:bg-slate-50/50 transition-colors bg-white cursor-grab active:cursor-grabbing"
                                                                                >
                                                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                                                        <div className="p-1 rounded-md transition-colors text-slate-200 group-hover/item:text-orange-400">
                                                                                            <GripVertical className="w-3.5 h-3.5" />
                                                                                        </div>
                                                                                        <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${content.type === 'VIDEO' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                                                            content.type === 'TEST' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                                                                'bg-indigo-50 text-indigo-600 border-indigo-100'
                                                                                            }`}>
                                                                                            {content.type === 'VIDEO' ? <PlayIcon className="w-4 h-4 md:w-5 md:h-5 fill-current" /> :
                                                                                                content.type === 'TEST' ? <ListChecks className="w-4 h-4 md:w-5 md:h-5" /> :
                                                                                                    <FileIcon className="w-4 h-4 md:w-5 md:h-5" />}
                                                                                        </div>
                                                                                        <div className="min-w-0">
                                                                                            <h4 className="font-bold text-slate-700 text-xs md:text-sm truncate leading-tight">{content.title}</h4>
                                                                                            <p className="text-[9px] md:text-[10px] font-black text-slate-400 tracking-wider flex items-center gap-2">
                                                                                                {content.type === 'TEST' ? 'TESTOLOJİ SINAVI' : content.type}
                                                                                                {content.project && <span>• {content.project.name}</span>}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-center shrink-0 gap-1 md:opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                                                        <DropdownMenu>
                                                                                            <DropdownMenuTrigger asChild>
                                                                                                <Button variant="ghost" size="icon" className="h-7 w-7 md:h-8 md:w-8 text-slate-300 hover:text-slate-600 rounded-lg">
                                                                                                    <MoreVertical className="w-4 h-4" />
                                                                                                </Button>
                                                                                            </DropdownMenuTrigger>
                                                                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                                                                <DropdownMenuItem
                                                                                                    className="text-xs font-bold p-2.5 cursor-pointer"
                                                                                                    onClick={() => onEditContent(module.id, content)}
                                                                                                >
                                                                                                    <Edit3 className="w-4 h-4 mr-2" /> İçeriği Düzenle
                                                                                                </DropdownMenuItem>
                                                                                                <DropdownMenuItem
                                                                                                    className="text-xs font-bold p-2.5 text-red-600 cursor-pointer"
                                                                                                    onClick={() => onDeleteContent(content.id)}
                                                                                                >
                                                                                                    <Trash2 className="w-4 h-4 mr-2" /> İçeriği Sil
                                                                                                </DropdownMenuItem>
                                                                                            </DropdownMenuContent>
                                                                                        </DropdownMenu>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </Draggable>
                                                                    ))
                                                                )}
                                                                {contentProvided.placeholder}
                                                            </div>
                                                        )}
                                                    </Droppable>
                                                )}
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <Button
                variant="ghost"
                className="w-full h-14 md:h-20 border-2 border-dashed border-slate-200 text-slate-400 hover:text-orange-600 hover:border-orange-500/30 hover:bg-orange-50/50 font-black rounded-3xl transition-all duration-300 group"
                onClick={onAddModule}
            >
                <div className="flex flex-col items-center">
                    <div className="flex items-center mb-1">
                        <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" /> Yeni Bölüm Ekle
                    </div>
                    <span className="text-[10px] opacity-60 uppercase tracking-widest hidden md:inline">Konuları Düzenli Bir Şekilde Ayırın</span>
                </div>
            </Button>
        </div>
    );
}
