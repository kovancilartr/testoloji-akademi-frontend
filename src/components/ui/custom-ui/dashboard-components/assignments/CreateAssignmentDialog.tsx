"use client";

import { useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useCreateAssignment } from "@/hooks/use-assignments";
import { useStudents } from "@/hooks/use-students";
import { useProjects } from "@/hooks/use-projects";
import { useThemeColors } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";

interface CreateAssignmentDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateAssignmentDialog({
    isOpen,
    onOpenChange
}: CreateAssignmentDialogProps) {
    const createAssignment = useCreateAssignment();
    const { data: students } = useStudents();
    const { data: projects } = useProjects();
    const colors = useThemeColors();

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("TEST");
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [externalUrl, setExternalUrl] = useState("");

    // Date State for Calendar
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
    const [duration, setDuration] = useState(0);
    const [allowedAttempts, setAllowedAttempts] = useState(1);

    const toggleStudent = (studentId: string) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const toggleAllStudents = () => {
        if (selectedStudents.length === students?.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(students?.map(s => s.id) || []);
        }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createAssignment.mutateAsync({
                title,
                description,
                type,
                studentIds: selectedStudents,
                projectId: type === "TEST" ? selectedProject : undefined,
                externalUrl: type !== "TEST" ? externalUrl : undefined,
                dueDate: dueDate ? dueDate.toISOString() : undefined,
                duration: duration > 0 ? duration : undefined,
                allowedAttempts
            });
            onOpenChange(false);
            // Reset form
            setTitle("");
            setDescription("");
            setSelectedStudents([]);
            setSelectedProject("");
            setExternalUrl("");
            setDueDate(undefined);
            setDuration(0);
            setAllowedAttempts(1);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Yeni Ödev Ata</DialogTitle>
                    <DialogDescription>Birden fazla öğrenciye aynı anda ödev atayabilirsiniz.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreate} className="space-y-6 py-4">
                    {/* Temel Bilgiler */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Ödev Başlığı *</Label>
                            <Input
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Örn: Limit ve Süreklilik Testi 1"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Ödev Tipi</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TEST">Testoloji Testi</SelectItem>
                                    <SelectItem value="VIDEO">Video İzleme</SelectItem>
                                    <SelectItem value="READING">Okuma / Araştırma</SelectItem>
                                    <SelectItem value="CUSTOM">Diğer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Açıklama</Label>
                        <Textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Ödev hakkında kısa bir açıklama..."
                        />
                    </div>

                    {/* Tip'e göre içerik seçimi */}
                    {type === "TEST" ? (
                        <div className="space-y-2">
                            <Label>Testoloji Projesi Seç *</Label>
                            <Select value={selectedProject} onValueChange={setSelectedProject} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Bir proje seçiniz..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {(projects as any[])?.map((p: any) => (
                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label>Bağlantı (URL)</Label>
                            <Input
                                type="url"
                                value={externalUrl}
                                onChange={e => setExternalUrl(e.target.value)}
                                placeholder="https://youtube.com/..."
                            />
                        </div>
                    )}

                    <div className="space-y-2 flex flex-col">
                        <Label className="mb-2">Son Teslim Tarihi</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !dueDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dueDate ? format(dueDate, "PPP", { locale: tr }) : <span>Tarih seçiniz</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dueDate}
                                    onSelect={setDueDate}
                                    initialFocus
                                    locale={tr}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Sınav Süresi (Dakika)</Label>
                            <Input
                                type="number"
                                min={0}
                                value={duration}
                                onChange={e => setDuration(parseInt(e.target.value) || 0)}
                                placeholder="0 = Limitsiz"
                            />
                            <p className="text-[10px] text-gray-500">0 girerseniz süre sınırı olmaz.</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Tekrar Hakkı</Label>
                            <Input
                                type="number"
                                min={1}
                                value={allowedAttempts}
                                onChange={e => setAllowedAttempts(parseInt(e.target.value) || 1)}
                            />
                        </div>
                    </div>

                    {/* Öğrenci Seçimi */}
                    <div className="space-y-3 pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-bold">Öğrenciler ({selectedStudents.length} Seçili)</Label>
                            <Button type="button" variant="ghost" size="sm" onClick={toggleAllStudents} className="text-xs h-8">
                                {selectedStudents.length === students?.length ? "Seçimi Kaldır" : "Tümünü Seç"}
                            </Button>
                        </div>
                        <div className="border border-gray-200 rounded-xl p-4 max-h-48 overflow-y-auto space-y-2 bg-gray-50/50">
                            {students?.map(student => (
                                <div key={student.id} className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-gray-100">
                                    <Checkbox
                                        id={`student-${student.id}`}
                                        checked={selectedStudents.includes(student.id)}
                                        onCheckedChange={() => toggleStudent(student.id)}
                                    />
                                    <Label htmlFor={`student-${student.id}`} className="flex-1 cursor-pointer font-medium">
                                        {student.name}
                                        <span className="text-gray-400 text-xs ml-2 font-normal">({student.gradeLevel})</span>
                                    </Label>
                                </div>
                            ))}
                            {students?.length === 0 && (
                                <p className="text-center text-gray-400 text-sm py-2">Henüz öğrenci eklenmemiş.</p>
                            )}
                        </div>
                        {selectedStudents.length === 0 && (
                            <p className="text-xs text-red-500">En az bir öğrenci seçmelisiniz.</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={createAssignment.isPending || selectedStudents.length === 0} className={cn("w-full sm:w-auto text-white", colors.buttonBg, colors.buttonHover)}>
                            {createAssignment.isPending ? 'Atanıyor...' : 'Ödevi Ata'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
