
"use client";

import { useMyCourses } from "@/hooks/use-courses";
import { FullPageLoader } from "@/components/ui/custom-ui/FullPageLoader";
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    ArrowRight,
    Clock,
    Layers,
    User,
    Sparkles,
    Search,
    CheckCircle,
    GraduationCap,
    PlayCircle
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useTheme, useThemeColors } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function StudentLibraryPage() {
    const { data: enrollments, isLoading } = useMyCourses();
    const [searchQuery, setSearchQuery] = useState("");
    const colors = useThemeColors();

    if (isLoading) return <FullPageLoader message="Kütüphanen hazırlanıyor..." />;

    const filteredCourses = enrollments?.filter((e: any) =>
        e.course.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div className="flex-1 p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-50/50 min-h-full">
            {/* Header */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                        <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg", colors.gradient, colors.shadow)}>
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        Kütüphanem
                    </h1>
                    <p className="text-gray-500 mt-2 text-base">
                        Kayıtlı olduğun tüm kurslar ve eğitim materyalleri burada.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative group max-w-md">
                    <Search className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors", `group-focus-within:${colors.text}`)} />
                    <Input
                        placeholder="Kurs ara..."
                        className="h-12 pl-11 pr-4 w-full rounded-2xl border-gray-100 bg-white shadow-sm font-semibold transition-all"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {filteredCourses.length === 0 ? (
                <div className="text-center py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50/30 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <BookOpen className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">
                        {searchQuery ? "Sonuç Bulunamadı" : "Henüz Kurs Yok"}
                    </h3>
                    <p className="text-gray-500 text-lg">
                        {searchQuery ? "Arama kriterlerine uygun kurs bulunamadı." : "Size atanan kurslar henüz kütüphanenize düşmedi."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCourses.map((enrollment: any) => {
                        const isCompleted = !!enrollment.completedAt;

                        return (
                            <Link key={enrollment.id} href={`/dashboard/student/library/${enrollment.courseId}`}>
                                <Card className={cn("border-l-4 shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden relative bg-gradient-to-br from-gray-50 via-white to-gray-50/30", colors.border)}>
                                    {/* Subtle background pattern */}
                                    <div className="absolute inset-0 opacity-5">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-900 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                                    </div>

                                    <CardHeader className="pb-3 relative">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3 flex-1">
                                                <div className={cn("p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm", colors.bg)}>
                                                    <Layers className={cn("w-6 h-6", colors.text)} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge className={cn("text-[10px] font-black uppercase tracking-wider", colors.bg, colors.text, colors.border)}>
                                                            KURS
                                                        </Badge>
                                                        {isCompleted && (
                                                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-black uppercase">
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                TAMAMLANDI
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <h3 className="text-lg font-black text-gray-900 leading-tight mb-2 line-clamp-2">
                                                        {enrollment.course.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <User className="w-3.5 h-3.5" />
                                                        <span className="font-semibold">{enrollment.course.instructor?.name || "Eğitmen"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pb-4 relative space-y-3">
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-1.5 text-gray-500">
                                                <BookOpen className="w-3.5 h-3.5" />
                                                <span className="font-bold">{enrollment.course._count?.modules || 0} Ünite</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span className="font-bold">Kayıtlı</span>
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="pt-0 relative">
                                        <Button
                                            className={cn("w-full bg-gray-50 text-gray-600 font-bold group/btn transition-all", colors.buttonHover, "hover:text-white")}
                                            variant="ghost"
                                        >
                                            <PlayCircle className="w-4 h-4 mr-2" />
                                            Kursa Devam Et
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
