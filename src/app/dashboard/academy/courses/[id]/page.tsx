"use client";

import { use, useState, useEffect, useMemo } from "react";
import {
    useCourse,
    useAddModule,
    useAddContent,
    useUpdateCourse,
    useEnrollStudent,
    useUnenrollStudent,
    useReorderModules,
    useReorderContents,
    useUpdateModule,
    useDeleteModule,
    useUpdateContent,
    useDeleteContent
} from "@/hooks/use-courses";
import { useProjects } from "@/hooks/use-projects";
import { useStudents } from "@/hooks/use-students";
import { FullPageLoader } from "@/components/ui/custom-ui/FullPageLoader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DropResult } from "@hello-pangea/dnd";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Custom Components
import { CourseHeader } from "@/components/ui/custom-ui/dashboard-components/academy/course-builder/CourseHeader";
import { CourseContentList } from "@/components/ui/custom-ui/dashboard-components/academy/course-builder/CourseContentList";
import { CourseSettingsDialog } from "@/components/ui/custom-ui/dashboard-components/academy/course-builder/dialogs/CourseSettingsDialog";
import { PublishCourseDialog } from "@/components/ui/custom-ui/dashboard-components/academy/course-builder/dialogs/PublishCourseDialog";
import { CreateModuleDialog } from "@/components/ui/custom-ui/dashboard-components/academy/course-builder/dialogs/CreateModuleDialog";
import { CreateContentDialog, ContentData } from "@/components/ui/custom-ui/dashboard-components/academy/course-builder/dialogs/CreateContentDialog";

import { RoleProtect } from "@/components/providers/RoleProtect";
import { Role } from "@/types/auth";

export default function CourseBuilderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: course, isLoading } = useCourse(id);
    const { data: projects } = useProjects();
    const { data: students } = useStudents();
    const router = useRouter();

    const addModule = useAddModule();
    const addContent = useAddContent();
    const updateCourse = useUpdateCourse();
    const enrollStudent = useEnrollStudent();
    const unenrollStudent = useUnenrollStudent();
    const reorderModules = useReorderModules();
    const reorderContents = useReorderContents();
    const updateModule = useUpdateModule();
    const deleteModule = useDeleteModule();
    const updateContent = useUpdateContent();
    const deleteContent = useDeleteContent();

    // UI States
    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
    const [isContentModalOpen, setIsContentModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [expandedModules, setExpandedModules] = useState<string[]>([]);
    const [studentSearch, setStudentSearch] = useState("");

    // Edit States
    const [moduleEditId, setModuleEditId] = useState<string | null>(null);
    const [contentEditId, setContentEditId] = useState<string | null>(null);

    // Form States
    const [moduleTitle, setModuleTitle] = useState("");
    const [selectedModuleId, setSelectedModuleId] = useState("");
    const [contentData, setContentData] = useState<ContentData>({
        title: "",
        type: "VIDEO", // Explicitly type assertion no longer needed if ContentData handles it well, but let's keep it consistent
        url: "",
        projectId: "",
        duration: 0,
        attemptLimit: 0
    });

    const [courseSettings, setCourseSettings] = useState({
        title: "",
        description: "",
        isPublished: false
    });

    useEffect(() => {
        if (course) {
            setCourseSettings({
                title: course.title,
                description: course.description || "",
                isPublished: course.isPublished
            });
            if (course.modules.length > 0 && expandedModules.length === 0) {
                setExpandedModules([course.modules[0].id]);
            }
        }
    }, [course]);

    const filteredStudents = useMemo(() => {
        if (!students) return [];
        return students.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()));
    }, [students, studentSearch]);

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const handleAddModule = async () => {
        if (!moduleTitle) return;
        try {
            if (moduleEditId) {
                await updateModule.mutateAsync({ courseId: id, moduleId: moduleEditId, title: moduleTitle });
                toast.success("Bölüm güncellendi.");
            } else {
                const newModule = await addModule.mutateAsync({
                    courseId: id,
                    title: moduleTitle,
                    order: (course?.modules.length || 0) + 1
                });
                setExpandedModules(prev => [...prev, newModule.id]);
                toast.success("Bölüm başarıyla eklendi.");
            }
            setIsModuleModalOpen(false);
            setModuleTitle("");
            setModuleEditId(null);
        } catch (error) {
            toast.error("İşlem sırasında bir hata oluştu.");
        }
    };

    const handleDeleteModule = async (moduleId: string) => {
        if (!confirm("Bu bölümü ve içindeki tüm içerikleri silmek istediğinize emin misiniz?")) return;
        try {
            await deleteModule.mutateAsync({ courseId: id, moduleId });
            toast.success("Bölüm silindi.");
        } catch (error) {
            toast.error("Bölüm silinemedi.");
        }
    };

    const handleAddContent = async () => {
        if (!contentData.title) return;
        try {
            if (contentEditId) {
                await updateContent.mutateAsync({
                    courseId: id,
                    contentId: contentEditId,
                    data: contentData
                });
                toast.success("İçerik güncellendi.");
            } else {
                await addContent.mutateAsync({
                    courseId: id,
                    moduleId: selectedModuleId,
                    data: {
                        ...contentData,
                        order: (course?.modules.find((m: any) => m.id === selectedModuleId)?.contents.length || 0) + 1
                    }
                });
                toast.success("İçerik modüle eklendi.");
            }
            setIsContentModalOpen(false);
            setContentData({ title: "", type: "VIDEO", url: "", projectId: "", duration: 0, attemptLimit: 0 });
            setContentEditId(null);
        } catch (error) {
            toast.error("İşlem sırasında hata oluştu.");
        }
    };

    const handleDeleteContent = async (contentId: string) => {
        if (!confirm("Bu içeriği silmek istediğinize emin misiniz?")) return;
        try {
            await deleteContent.mutateAsync({ courseId: id, contentId });
            toast.success("İçerik silindi.");
        } catch (error) {
            toast.error("İçerik silinemedi.");
        }
    };

    const handleUpdateSettings = async () => {
        try {
            await updateCourse.mutateAsync({ id, data: courseSettings });
            setIsSettingsModalOpen(false);
            toast.success("Kurs ayarları güncellendi.");
        } catch (error) {
            toast.error("Güncelleme başarısız.");
        }
    };

    const handleToggleEnroll = async (studentId: string, isEnrolled: boolean) => {
        try {
            if (isEnrolled) {
                await unenrollStudent.mutateAsync({ courseId: id, studentId });
                toast.success("Öğrenci kurstan çıkarıldı.");
            } else {
                await enrollStudent.mutateAsync({ courseId: id, studentId });
                toast.success("Öğrenci kursa atandı.");
            }
        } catch (error: any) {
            toast.error("İşlem başarısız.");
        }
    };

    const onDragEnd = async (result: DropResult) => {
        if (!course) return;
        const { destination, source, type } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        if (type === "module") {
            const modules = Array.from(course.modules);
            const [reorderedModule] = modules.splice(source.index, 1);
            modules.splice(destination.index, 0, reorderedModule as any);

            const moduleIds = modules.map((m: any) => m.id);
            try {
                await reorderModules.mutateAsync({ courseId: id, moduleIds });
                toast.success("Bölüm sıralaması güncellendi.");
            } catch (error) {
                toast.error("Sıralama güncellenemedi.");
            }
        }

        if (type === "content") {
            const moduleId = source.droppableId;
            const module = course.modules.find((m: any) => m.id === moduleId);
            if (!module) return;

            const contents = Array.from(module.contents);
            const [reorderedContent] = contents.splice(source.index, 1);
            contents.splice(destination.index, 0, reorderedContent as any);

            const contentIds = contents.map((c: any) => c.id);
            try {
                await reorderContents.mutateAsync({ courseId: id, moduleId, contentIds });
                toast.success("İçerik sıralaması güncellendi.");
            } catch (error) {
                toast.error("Sıralama güncellenemedi.");
            }
        }
    };

    if (isLoading) return <FullPageLoader message="Müfredat yükleniyor..." />;
    if (!course) return <div className="p-10 text-center">Kurs bulunamadı.</div>;

    return (
        <RoleProtect allowedRoles={[Role.TEACHER, Role.ADMIN]}>
            <div className="flex-1 flex flex-col h-full bg-[#f8fafc] animate-in fade-in duration-500">
                {/* Desktop Navbar / Header */}
                <CourseHeader
                    course={course}
                    onBack={() => router.back()}
                    onOpenSettings={() => setIsSettingsModalOpen(true)}
                    onOpenPublish={() => setIsPublishModalOpen(true)}
                />

                {/* Course Content Area */}
                <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-10">
                    <div className="max-w-4xl mx-auto space-y-4">
                        <CourseContentList
                            course={course}
                            expandedModules={expandedModules}
                            toggleModule={toggleModule}
                            onDragEnd={onDragEnd}
                            onAddModule={() => setIsModuleModalOpen(true)}
                            onAddContent={(moduleId) => {
                                setModuleEditId(null);
                                setContentEditId(null);
                                setSelectedModuleId(moduleId);
                                setIsContentModalOpen(true);
                            }}
                            onEditModule={(module) => {
                                setModuleEditId(module.id);
                                setModuleTitle(module.title);
                                setIsModuleModalOpen(true);
                            }}
                            onDeleteModule={handleDeleteModule}
                            onEditContent={(moduleId, content) => {
                                setSelectedModuleId(moduleId);
                                setContentEditId(content.id);
                                setContentData({
                                    title: content.title,
                                    type: content.type,
                                    url: content.url || "",
                                    projectId: content.projectId || "",
                                    duration: content.duration || 0,
                                    attemptLimit: content.attemptLimit || 0
                                });
                                setIsContentModalOpen(true);
                            }}
                            onDeleteContent={handleDeleteContent}
                        />
                    </div>
                </div>

                {/* Float Action for Mobile (Add Module) */}
                <div className="fixed bottom-6 right-6 md:hidden z-40">
                    <Button
                        className="w-14 h-14 rounded-full bg-slate-900 text-white shadow-2xl flex items-center justify-center p-0"
                        onClick={() => setIsModuleModalOpen(true)}
                    >
                        <Plus className="w-6 h-6" />
                    </Button>
                </div>

                {/* Dialogs */}
                <CourseSettingsDialog
                    isOpen={isSettingsModalOpen}
                    onOpenChange={setIsSettingsModalOpen}
                    settings={courseSettings}
                    onSettingsChange={setCourseSettings}
                    onSaveSettings={handleUpdateSettings}
                    isLoadingSettings={updateCourse.isPending}
                    studentSearch={studentSearch}
                    onStudentSearchChange={setStudentSearch}
                    filteredStudents={filteredStudents}
                    enrollments={course.enrollments}
                    onEnrollToggle={handleToggleEnroll}
                    isEnrollLoading={enrollStudent.isPending || unenrollStudent.isPending}
                />

                <PublishCourseDialog
                    isOpen={isPublishModalOpen}
                    onOpenChange={setIsPublishModalOpen}
                    isPublished={courseSettings.isPublished}
                    onToggle={async () => {
                        const next = !courseSettings.isPublished;
                        setCourseSettings({ ...courseSettings, isPublished: next });
                        await updateCourse.mutateAsync({ id, data: { ...courseSettings, isPublished: next } });
                        toast.success(next ? "Kurs Başarıyla Yayına Alındı!" : "Kurs Taslak Moduna Çekildi.");
                    }}
                    isLoading={updateCourse.isPending}
                />

                <CreateModuleDialog
                    isOpen={isModuleModalOpen}
                    onOpenChange={(open) => {
                        setIsModuleModalOpen(open);
                        if (!open) {
                            setModuleEditId(null);
                            setModuleTitle("");
                        }
                    }}
                    moduleTitle={moduleTitle}
                    onModuleTitleChange={setModuleTitle}
                    onSubmit={handleAddModule}
                    isLoading={addModule.isPending || updateModule.isPending}
                    mode={moduleEditId ? 'edit' : 'create'}
                />

                <CreateContentDialog
                    isOpen={isContentModalOpen}
                    onOpenChange={(open) => {
                        setIsContentModalOpen(open);
                        if (!open) {
                            setContentEditId(null);
                            setContentData({ title: "", type: "VIDEO", url: "", projectId: "", duration: 0, attemptLimit: 0 });
                        }
                    }}
                    contentData={contentData}
                    onContentDataChange={setContentData}
                    onSubmit={handleAddContent}
                    projects={projects || []}
                    isLoading={addContent.isPending || updateContent.isPending}
                    mode={contentEditId ? 'edit' : 'create'}
                />
            </div>
        </RoleProtect>
    );
}
