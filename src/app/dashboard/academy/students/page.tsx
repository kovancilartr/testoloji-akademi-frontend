
"use client";

import { useState } from "react";
import { useStudents, useCreateStudent, useDeleteStudent, Student } from "@/hooks/use-students";
import { EditStudentDialog } from "@/components/ui/custom-ui/dashboard-components/EditStudentDialog";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Search, User, GraduationCap, Eye, Users, Pencil, Mail, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FullPageLoader } from "@/components/ui/custom-ui/FullPageLoader";
import { cn } from "@/lib/utils";
import { useThemeColors } from "@/contexts/ThemeContext";
import { RoleProtect } from "@/components/providers/RoleProtect";
import { Role } from "@/types/auth";
import { GRADE_LEVELS } from "@/lib/constants";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function StudentsPage() {
    const { data: students, isLoading } = useStudents();
    const deleteStudent = useDeleteStudent();
    const createStudent = useCreateStudent();
    const router = useRouter();
    const colors = useThemeColors();

    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        gradeLevel: "",
        email: "",
        phone: "",
        notes: ""
    });

    const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredStudents = students?.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const paginatedStudents = filteredStudents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createStudent.mutateAsync(formData);
            setIsCreateOpen(false);
            setFormData({ name: "", gradeLevel: "", email: "", phone: "", notes: "" });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bu öğrenciyi silmek istediğinize emin misiniz? Tüm verileri silinecek.")) {
            await deleteStudent.mutateAsync(id);
        }
    };

    const handleEdit = (student: Student) => {
        setStudentToEdit(student);
        setIsEditOpen(true);
    };

    if (isLoading) return <FullPageLoader message="Öğrenci listesi yükleniyor..." />;

    return (
        <RoleProtect allowedRoles={[Role.TEACHER, Role.ADMIN]}>
            <div className="flex-1 p-8 space-y-6 bg-gradient-to-br from-gray-50 via-white to-gray-50/50 min-h-full overflow-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3">
                            <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg", colors.gradient, colors.shadow)}>
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            Öğrencilerim
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm">
                            Toplam {students?.length || 0} öğrenci kayıtlı.
                        </p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className={cn("text-white shadow-lg", colors.buttonBg, colors.buttonHover, colors.shadow)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Yeni Öğrenci Ekle
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Yeni Öğrenci Ekle</DialogTitle>
                                <DialogDescription>
                                    Öğrenci bilgilerini girerek sisteme kaydedin.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Ad Soyad *</Label>
                                    <Input
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Örn: Ali Yılmaz"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="grade">Sınıf / Seviye</Label>
                                    <Select
                                        value={formData.gradeLevel}
                                        onValueChange={value => setFormData({ ...formData, gradeLevel: value })}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sınıf seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {GRADE_LEVELS.map((grade) => (
                                                <SelectItem key={grade} value={grade}>
                                                    {grade}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">E-posta</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="ali@ornek.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Telefon</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="05..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notlar</Label>
                                    <Input
                                        id="notes"
                                        value={formData.notes}
                                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                        placeholder="Öğrenci hakkında özel notlar..."
                                    />
                                </div>

                                <DialogFooter>
                                    <Button type="submit" className={cn(colors.buttonBg, colors.buttonHover)} disabled={createStudent.isPending}>
                                        {createStudent.isPending ? 'Kaydediliyor...' : 'Kaydet'}
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
                        placeholder="İsim veya e-posta ile ara..."
                        className="pl-10 bg-white"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Desktop Table Area */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hidden md:block">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead>Öğrenci Adı</TableHead>
                                <TableHead>Sınıf</TableHead>
                                <TableHead>İletişim</TableHead>
                                <TableHead className="text-center">Ödevler</TableHead>
                                <TableHead className="text-right">İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedStudents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                                        {searchTerm ? 'Sonuç bulunamadı' : 'Henüz öğrenci eklenmemiş.'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedStudents.map((student) => (
                                    <TableRow key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell>
                                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs", colors.iconBg, colors.text)}>
                                                {student.name.charAt(0)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium text-gray-900">
                                            {student.name}
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-600">
                                                {student.gradeLevel || '-'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <span className="text-gray-900">{student.email || '-'}</span>
                                                <span className="text-gray-500 text-xs">{student.phone}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold", colors.bg, colors.text)}>
                                                {student._count?.assignments || 0}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                                                    onClick={() => router.push(`/dashboard/academy/students/${student.id}`)}
                                                    title="Detaylı Analiz"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50 cursor-pointer"
                                                    onClick={() => handleEdit(student)}
                                                    title="Düzenle"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                                    onClick={() => handleDelete(student.id)}
                                                    title="Sil"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {filteredStudents.length > itemsPerPage && (
                        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Gösterilen: {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredStudents.length)} / Toplam: {filteredStudents.length}
                            </p>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    className="h-8 w-8 p-0 rounded-lg border-gray-200 text-gray-600 disabled:opacity-30 cursor-pointer hover:bg-white"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <Button
                                        key={i}
                                        variant={currentPage === i + 1 ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={cn(
                                            "h-8 w-8 p-0 rounded-lg font-bold text-xs border-gray-200 cursor-pointer shadow-sm mx-0.5",
                                            currentPage === i + 1 ? cn(colors.buttonBg, colors.buttonHover, "text-white border-transparent shadow-md shadow-gray-200") : "text-gray-600 bg-white hover:border-gray-300"
                                        )}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="h-8 w-8 p-0 rounded-lg border-gray-200 text-gray-600 disabled:opacity-30 cursor-pointer hover:bg-white"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Card View Area */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {paginatedStudents.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100">
                            {searchTerm ? 'Sonuç bulunamadı' : 'Henüz öğrenci eklenmemiş.'}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {paginatedStudents.map((student) => (
                                <div key={student.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
                                    {/* Header: Avatar, Name, Grade, Assignment Count */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0", colors.iconBg, colors.text)}>
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 leading-tight">{student.name}</h3>
                                                <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                                                    {student.gradeLevel || '-'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={cn("px-2 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap", colors.bg, colors.text)}>
                                            {student._count?.assignments || 0} Ödev
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="space-y-2 text-sm bg-gray-50/50 p-3 rounded-lg border border-gray-50">
                                        <div className="flex items-center gap-2 text-gray-600 truncate">
                                            <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                            <span className="truncate">{student.email || '-'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                            <span>{student.phone || '-'}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="grid grid-cols-4 gap-2 pt-2">
                                        <Button
                                            className="col-span-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 font-bold h-9"
                                            variant="outline"
                                            onClick={() => router.push(`/dashboard/academy/students/${student.id}`)}
                                        >
                                            <Eye className="w-4 h-4 mr-2" /> Analiz
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="col-span-1 border-orange-200 text-orange-700 hover:bg-orange-50 h-9"
                                            onClick={() => handleEdit(student)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="col-span-1 border-red-200 text-red-700 hover:bg-red-50 h-9"
                                            onClick={() => handleDelete(student.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {/* Mobile Pagination */}
                            {filteredStudents.length > itemsPerPage && (
                                <div className="flex items-center justify-center gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        className="h-9 w-9 p-0 rounded-xl"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <span className="text-xs font-bold text-gray-500">
                                        {currentPage} / {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        className="h-9 w-9 p-0 rounded-xl"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>


                <EditStudentDialog
                    isOpen={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    student={studentToEdit}
                />
            </div >
        </RoleProtect>
    );
}
