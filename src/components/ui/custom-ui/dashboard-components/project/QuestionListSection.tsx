"use client";

import React from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { ProjectSubHeader } from "./ProjectSubHeader";
import { QuestionCard } from "./QuestionCard";

interface QuestionListSectionProps {
    questions: any[];
    onDragEnd: (result: DropResult) => void;
    getImageUrl: (url: string) => string;
    onImagePreview: (url: string) => void;
    onUpdateSpacing: (id: string, spacing: number) => void;
    onUpdateDetail: (id: string, data: { difficulty?: number, correctAnswer?: string }) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
}

export const QuestionListSection = ({
    questions,
    onDragEnd,
    getImageUrl,
    onImagePreview,
    onUpdateSpacing,
    onUpdateDetail,
    onDelete
}: QuestionListSectionProps) => {
    return (
        <div className="flex-1 h-full overflow-y-auto custom-scrollbar bg-white border-r border-gray-100">
            <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 max-w-[900px] mx-auto">
                <ProjectSubHeader questionCount={questions.length} />

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="questions" direction="vertical">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-4 pb-20"
                            >
                                {questions.map((question, index) => (
                                    <QuestionCard
                                        key={question.id}
                                        question={question}
                                        index={index}
                                        getImageUrl={getImageUrl}
                                        onImagePreview={onImagePreview}
                                        onUpdateSpacing={onUpdateSpacing}
                                        onUpdateDetail={onUpdateDetail}
                                        onDelete={onDelete}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
};
