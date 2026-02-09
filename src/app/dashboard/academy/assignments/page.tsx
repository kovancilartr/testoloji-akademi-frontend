"use client";

import { useState } from "react";
import { useAssignments, useDeleteAssignment } from "@/hooks/use-assignments";
import { useStudents } from "@/hooks/use-students";
import { useProjects } from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Search, BookOpen, Clock, Video, FileText, Calendar as CalendarIcon, MoreVertical, Eye, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FullPageLoader } from "@/components/ui/custom-ui/FullPageLoader";
import { cn } from "@/lib/utils";
import { useThemeColors } from "@/contexts/ThemeContext";
import { CreateAssignmentDialog } from "@/components/ui/custom-ui/dashboard-components/assignments/CreateAssignmentDialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { RoleProtect } from "@/components/providers/RoleProtect";
import { Role } from "@/types/auth";

export default function AssignmentsPage() {
    const { data: assignments, isLoading: assignmentsLoading } = useAssignments();
    const { isLoading: studentsLoading } = useStudents();
    const colors = useThemeColors();
    const deleteAssignment = useDeleteAssignment();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredAssignments = assignments?.filter(a =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.student.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleDelete = async (id: string) => {
        if (confirm("Bu ödevi silmek istediğinize emin misiniz?")) {
            await deleteAssignment.mutateAsync(id);
        }
    };

    if (assignmentsLoading || studentsLoading) return <FullPageLoader message="Ödevler yükleniyor..." />;

    // Helper to get formatted date
    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("tr-TR", {
            day: 'numeric', month: 'long'
        });
    };

    // Helper for status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "COMPLETED": return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Tamamlandı</Badge>;
            case "IN_PROGRESS": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Devam Ediyor</Badge>;
            case "OVERDUE": return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Gecikmiş</Badge>;
            default: return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Bekliyor</Badge>;
        }
    };

    // Helper for type icon
    const getTypeIcon = (type: string) => {
        switch (type) {
            case "TEST": return <FileText className="w-4 h-4 text-orange-500" />;
            case "VIDEO": return <Video className="w-4 h-4 text-blue-500" />;
            default: return <BookOpen className="w-4 h-4 text-purple-500" />;
        }
    };

    return (
        <RoleProtect allowedRoles={[Role.TEACHER, Role.ADMIN]}>
            <div className="flex-1 flex flex-col h-full bg-gray-50/50">
                {/* Header */}
                <div className="p-4 md:p-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3">
                            <div className={cn("p-2 md:p-3 rounded-xl bg-white shadow-sm border border-gray-100", colors.text)}>
                                <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                            Ödevler
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm md:text-base">
                            Öğrencilere ödev atayın ve tamamlanma durumlarını takip edin.
                        </p>
                    </div>

                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className={cn("text-white shadow-lg w-full sm:w-auto", colors.buttonBg, colors.buttonHover, colors.shadow)}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Ödev Ata
                    </Button>
                </div>

                {/* Filter Bar */}
                <div className="px-4 md:px-8 pb-4">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Ödev başlığı veya öğrenci adı ara..."
                            className="pl-9 bg-white"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto px-4 md:px-8 pb-8">
                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead>Ödev Başlığı</TableHead>
                                    <TableHead>Öğrenci</TableHead>
                                    <TableHead>Son Tarih</TableHead>
                                    <TableHead className="text-center">Durum</TableHead>
                                    <TableHead className="text-right">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAssignments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                                            {searchTerm ? 'Sonuç bulunamadı' : 'Henüz ödev oluşturulmamış.'}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredAssignments.map((assignment) => (
                                        <TableRow key={assignment.id} className="hover:bg-gray-50/50 transition-colors">
                                            <TableCell>
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                                    {getTypeIcon(assignment.type)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{assignment.title}</span>
                                                    <span className="text-xs text-gray-500 truncate max-w-[200px]">
                                                        {assignment.type === 'TEST' && assignment.project ? `Proje: ${assignment.project.name}` : assignment.description || '-'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                                                        {assignment.student.name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm text-gray-700">{assignment.student.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <Clock className="w-3 h-3 text-gray-400" />
                                                    {formatDate(assignment.dueDate)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {getStatusBadge(assignment.status)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-gray-400 hover:text-red-600"
                                                    onClick={() => handleDelete(assignment.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden grid grid-cols-1 gap-4">
                        {filteredAssignments.length === 0 ? (
                            <div className="text-center text-gray-500 py-10 bg-white rounded-xl border border-gray-100">
                                {searchTerm ? 'Sonuç bulunamadı' : 'Henüz ödev oluşturulmamış.'}
                            </div>
                        ) : (
                            filteredAssignments.map((assignment) => (
                                <div key={assignment.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                                {getTypeIcon(assignment.type)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 line-clamp-1">{assignment.title}</h3>
                                                <p className="text-xs text-gray-500 line-clamp-1">
                                                    {assignment.type === 'TEST' && assignment.project ? assignment.project.name : assignment.description || '-'}
                                                </p>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8">
                                                    <MoreVertical className="w-4 h-4 text-gray-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(assignment.id)}>
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Sil
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                                                {assignment.student.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                                                {assignment.student.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(assignment.dueDate)}
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        {getStatusBadge(assignment.status)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <CreateAssignmentDialog
                    isOpen={isCreateOpen}
                    onOpenChange={setIsCreateOpen}
                />
            </div>
        </RoleProtect>
    );
}
