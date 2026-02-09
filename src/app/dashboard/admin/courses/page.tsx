
"use client";

import { useState } from "react";
import { useAdminAllCourses } from "@/hooks/use-courses";
import { useAuth } from "@/contexts/AuthContext";
import { FullPageLoader } from "@/components/ui/custom-ui/FullPageLoader";
import { Role } from "@/types/auth";
import {
    BookOpen,
    Search,
    Plus,
    MoreHorizontal,
    Eye,
    Trash2,
    User,
    Calendar,
    CheckCircle2,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { UnauthorizedAccess } from "@/components/ui/custom-ui/dashboard-components/admin/UnauthorizedAccess";
import Image from "next/image";

export default function AdminCoursesPage() {
    const { user: currentUser } = useAuth();
    const { data: courses = [], isLoading } = useAdminAllCourses();
    const [searchTerm, setSearchTerm] = useState("");

    if (isLoading) return <FullPageLoader message="Kurslar yükleniyor..." />;

    if (currentUser?.role !== Role.ADMIN) {
        return <UnauthorizedAccess />;
    }

    const filteredCourses = courses.filter((c: any) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-gray-50/50 overflow-hidden">

            <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 space-y-8 custom-scrollbar">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-orange-500" />
                            Sistem Kursları
                        </h1>
                        <p className="text-gray-500 font-bold">
                            Tüm eğitmenler tarafından oluşturulan kursları buradan yönetebilirsiniz.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            <Input
                                placeholder="Kurs adı veya eğitmen ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-11 h-12 bg-white border-gray-200 rounded-2xl shadow-sm focus:ring-orange-500/20 focus:border-orange-500 font-bold transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Courses Table/Grid */}
                <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/30 border-b border-gray-100 uppercase tracking-widest text-[10px] font-black text-gray-400">
                                    <th className="px-8 py-6">Kurs Bilgisi</th>
                                    <th className="px-8 py-6">Eğitmen</th>
                                    <th className="px-8 py-6">İstatistikler</th>
                                    <th className="px-8 py-6">Durum</th>
                                    <th className="px-8 py-6">Oluşturulma</th>
                                    <th className="px-8 py-6 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredCourses.map((course: any) => (
                                    <tr key={course.id} className="group hover:bg-gray-50/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative h-14 w-20 rounded-xl bg-gray-100 overflow-hidden border border-gray-100 shrink-0 shadow-sm">
                                                    {course.thumbnailUrl ? (
                                                        <Image
                                                            src={course.thumbnailUrl}
                                                            alt={course.title}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center">
                                                            <BookOpen className="w-6 h-6 text-gray-300" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-black text-gray-900 truncate leading-tight group-hover:text-orange-600 transition-colors">{course.title}</span>
                                                    <span className="text-[11px] font-bold text-gray-400 truncate max-w-[200px] mt-1">{course.description || "Açıklama belirtilmemiş"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900 leading-none">{course.instructor.name}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 mt-1">{course.instructor.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-gray-900 leading-none">{course._count?.modules || 0}</span>
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tight">Modül</span>
                                                </div>
                                                <div className="w-px h-6 bg-gray-100" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-gray-900 leading-none">{course._count?.enrollments || 0}</span>
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tight">Öğrenci</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {course.isPublished ? (
                                                <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-50 font-black text-[9px] uppercase tracking-widest py-1 px-3 rounded-lg">
                                                    YAYINDA
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-100 font-black text-[9px] uppercase tracking-widest py-1 px-3 rounded-lg">
                                                    TASLAK
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                                                    <Calendar className="w-3 h-3 text-gray-400" />
                                                    {new Date(course.createdAt).toLocaleDateString("tr-TR")}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-300 mt-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(course.createdAt).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-md transition-all">
                                                        <MoreHorizontal className="h-5 w-5 text-gray-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 rounded-2xl border-none shadow-2xl p-2 bg-white">
                                                    <DropdownMenuLabel className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-2">Kurs İşlemleri</DropdownMenuLabel>
                                                    <DropdownMenuItem className="rounded-xl flex items-center gap-2 font-bold focus:bg-orange-50 focus:text-orange-600 cursor-pointer">
                                                        <Eye className="h-4 w-4" /> Kursa Git
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-gray-50 mx-1" />
                                                    <DropdownMenuItem className="rounded-xl flex items-center gap-2 font-bold text-red-500 focus:bg-red-50 focus:text-red-600 cursor-pointer">
                                                        <Trash2 className="h-4 w-4" /> Kursu Sil...
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {filteredCourses.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center">
                                                    <BookOpen className="w-8 h-8 text-gray-200" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-gray-900 font-black">Kurs Bulunamadı</p>
                                                    <p className="text-gray-400 text-sm font-bold">Arama kriterlerinize uygun kurs bulunmamaktadır.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
