
"use client";

import { useState } from "react";
import { useCourses, useCreateCourse } from "@/hooks/use-courses";
import { Button } from "@/components/ui/button";
import {
    Plus, Search, BookOpen, GraduationCap,
    Layers, Users, ArrowUpRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FullPageLoader } from "@/components/ui/custom-ui/FullPageLoader";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTheme, useThemeColors } from "@/contexts/ThemeContext";
import { RoleProtect } from "@/components/providers/RoleProtect";
import { Role } from "@/types/auth";

export default function CoursesPage() {
    const { data: courses, isLoading } = useCourses();
    const createCourse = useCreateCourse();
    const router = useRouter();
    const colors = useThemeColors();

    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        thumbnailUrl: ""
    });

    const filteredCourses = courses?.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createCourse.mutateAsync(formData);
            setIsCreateOpen(false);
            setFormData({ title: "", description: "", thumbnailUrl: "" });
            toast.success("Kurs başarıyla oluşturuldu.");
        } catch (error) {
            toast.error("Kurs oluşturulurken hata oluştu.");
        }
    };

    if (isLoading) return <FullPageLoader message="Kurslar yükleniyor..." />;

    return (
        <RoleProtect allowedRoles={[Role.TEACHER, Role.ADMIN]}>
            <div className="flex-1 p-8 space-y-6 bg-gradient-to-br from-gray-50 via-white to-gray-50/50 min-h-full overflow-auto">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                            <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg", colors.gradient, colors.shadow)}>
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            Kurslar & Müfredat
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm">
                            Eğitim içeriklerinizi yönetin ve paylaşın.
                        </p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className={cn("text-white shadow-lg", colors.buttonBg, colors.buttonHover, colors.shadow)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Yeni Kurs
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Yeni Kurs Oluştur</DialogTitle>
                                <DialogDescription>
                                    Müfredatınıza yeni bir eğitim serisi ekleyin.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Kurs Başlığı *</Label>
                                    <Input
                                        id="title"
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Örn: TYT Matematik"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Açıklama</Label>
                                    <Input
                                        id="description"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Kurs içeriği hakkında kısa bilgi..."
                                    />
                                </div>

                                <DialogFooter>
                                    <Button type="submit" className={cn("w-full", colors.buttonBg, colors.buttonHover)} disabled={createCourse.isPending}>
                                        {createCourse.isPending ? 'Oluşturuluyor...' : 'Kursu Oluştur'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-xl">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Kurs ara..."
                        className="pl-10 bg-white"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Courses Grid */}
                <div className="flex-1">
                    {filteredCourses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                            <BookOpen className="w-12 h-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-bold text-gray-900">Henüz kurs yok</h3>
                            <p className="text-gray-500 mt-2 text-sm">
                                İlk kursunuzu oluşturmak için yukarıdaki butona tıklayın.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {filteredCourses.map((course) => (
                                <Card
                                    key={course.id}
                                    className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-gray-100 overflow-hidden"
                                    onClick={() => router.push(`/dashboard/academy/courses/${course.id}`)}
                                >
                                    <CardHeader className={cn("pb-3", colors.bg)}>
                                        <div className="flex items-start justify-between">
                                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colors.iconBg)}>
                                                <GraduationCap className={cn("w-5 h-5", colors.text)} />
                                            </div>
                                            <Badge variant="secondary" className="bg-white/80 text-xs">
                                                {course._count?.modules || 0} Bölüm
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pt-4">
                                        <div>
                                            <CardTitle className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors">
                                                {course.title}
                                            </CardTitle>
                                            {course.description && (
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                    {course.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Layers className="w-3 h-3" />
                                                <span>{course._count?.modules || 0} modül</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                <span>{course._count?.enrollments || 0} öğrenci</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-0">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={cn("w-full group-hover:bg-gray-100 transition-colors", colors.text)}
                                        >
                                            Kursu Yönet
                                            <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </RoleProtect>
    );
}
