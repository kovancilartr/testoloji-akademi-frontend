"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BookOpen, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateScheduleItem } from "@/hooks/use-schedule";
import { useCourses, useCourse } from "@/hooks/use-courses";
import { ThemeColors } from "@/contexts/ThemeContext";

const DAYS = [
    { id: 1, name: "Pazartesi" },
    { id: 2, name: "Salı" },
    { id: 3, name: "Çarşamba" },
    { id: 4, name: "Perşembe" },
    { id: 5, name: "Cuma" },
    { id: 6, name: "Cumartesi" },
    { id: 7, name: "Pazar" },
];

interface CreateActivityDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedStudentId: string;
    colors: ThemeColors;
}

export function CreateActivityDialog({
    isOpen,
    onOpenChange,
    selectedStudentId,
    colors
}: CreateActivityDialogProps) {
    const createItem = useCreateScheduleItem();
    const { data: courses, isLoading: coursesLoading } = useCourses();

    // Form State
    const [scheduleType, setScheduleType] = useState<"recurring" | "specific">("recurring");
    const [day, setDay] = useState<string>("1");
    const [specificDate, setSpecificDate] = useState("");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("10:00");
    const [activityType, setActivityType] = useState<"custom" | "course">("custom");
    const [activity, setActivity] = useState("");
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [selectedModuleId, setSelectedModuleId] = useState("");
    const [selectedContentId, setSelectedContentId] = useState("");

    // Seçilen kursu detaylı çek
    const { data: selectedCourseData } = useCourse(selectedCourseId);

    // Seçilen modülü bul
    const selectedModule = selectedCourseData?.modules?.find((m: any) => m.id === selectedModuleId);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        let activityText = activity;
        let finalCourseId = undefined;
        let finalContentId = undefined;

        if (activityType === "course") {
            if (!selectedCourseId || !selectedContentId) {
                alert("Lütfen bir kurs ve içerik seçin.");
                return;
            }

            const course = courses?.find(c => c.id === selectedCourseId);
            const module = selectedCourseData?.modules?.find((m: any) => m.id === selectedModuleId);
            const content = module?.contents?.find((c: any) => c.id === selectedContentId);

            if (course && content) {
                activityText = `📚 ${course.title} → ${module?.title || "Ders"} → ${content.title}`;
                finalCourseId = selectedCourseId;
                finalContentId = selectedContentId;
            } else {
                alert("Seçilen kurs bilgileri alınamadı.");
                return;
            }
        }

        try {
            await createItem.mutateAsync({
                studentId: selectedStudentId,
                date: scheduleType === "specific" ? specificDate : undefined,
                dayOfWeek: scheduleType === "recurring" ? parseInt(day) : undefined,
                startTime,
                endTime,
                activity: activityText,
                courseId: finalCourseId,
                contentId: finalContentId,
            });
            onOpenChange(false);

            // Reset Form (Optional but good UX)
            setActivity("");
            setActivityType("custom");
            setScheduleType("recurring");
            setSpecificDate("");
            setSelectedCourseId("");
            setSelectedModuleId("");
            setSelectedContentId("");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-black text-slate-900">Yeni Aktivite Ekle</DialogTitle>
                    <DialogDescription className="font-medium text-slate-500">Haftalık programa yeni bir ders veya aktivite ekleyin.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4 py-4">
                    <div className="space-y-3">
                        <Label>Program Tipi</Label>
                        <RadioGroup value={scheduleType} onValueChange={(val: "recurring" | "specific") => setScheduleType(val)}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="recurring" id="recurring" />
                                <Label htmlFor="recurring" className="font-normal cursor-pointer">Haftalık Tekrarlayan (Her Pazartesi, vb.)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="specific" id="specific" />
                                <Label htmlFor="specific" className="font-normal cursor-pointer">Belirli Bir Tarih (Sadece o gün)</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {scheduleType === "recurring" ? (
                        <div className="space-y-2">
                            <Label>Gün</Label>
                            <Select value={day} onValueChange={setDay}>
                                <SelectTrigger className="w-full border-slate-200 h-10 rounded-lg">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="z-[200]">
                                    {DAYS.map(d => (
                                        <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label>Tarih</Label>
                            <Input
                                type="date"
                                required
                                value={specificDate}
                                onChange={e => setSpecificDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Başlangıç Saati</Label>
                            <Input type="time" required value={startTime} onChange={e => setStartTime(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Bitiş Saati</Label>
                            <Input type="time" required value={endTime} onChange={e => setEndTime(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Aktivite Tipi</Label>
                        <RadioGroup value={activityType} onValueChange={(val: "custom" | "course") => setActivityType(val)}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="custom" id="custom" />
                                <Label htmlFor="custom" className="font-normal cursor-pointer">Özel Aktivite (Serbest Metin)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="course" id="course" />
                                <Label htmlFor="course" className="font-normal cursor-pointer">Kurs İçeriği Seç</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {activityType === "custom" ? (
                        <div className="space-y-2">
                            <Label>Aktivite / Ders</Label>
                            <Input
                                required
                                placeholder="Örn: Matematik Etüdü, Kitap Okuma..."
                                value={activity}
                                onChange={e => setActivity(e.target.value)}
                            />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <Label>Kurs Seçin</Label>
                                <Select value={selectedCourseId} onValueChange={(val) => {
                                    setSelectedCourseId(val);
                                    setSelectedModuleId("");
                                    setSelectedContentId("");
                                }}>
                                    <SelectTrigger className="w-full h-12 rounded-xl border-slate-200 font-bold">
                                        <SelectValue placeholder="Bir kurs seçin..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-200 z-[200]">
                                        {coursesLoading ? (
                                            <div className="p-2 text-sm text-gray-500">Yükleniyor...</div>
                                        ) : courses && courses.length > 0 ? (
                                            courses.map((course: any) => (
                                                <SelectItem key={course.id} value={course.id}>
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="w-4 h-4" />
                                                        {course.title}
                                                    </div>
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="p-2 text-sm text-gray-500">Henüz kurs yok</div>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedCourseId && (
                                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                    <Label className="font-bold text-slate-700">Bölüm Seçin</Label>
                                    <Select
                                        value={selectedModuleId}
                                        onValueChange={(val) => {
                                            setSelectedModuleId(val);
                                            setSelectedContentId("");
                                        }}
                                        disabled={!selectedCourseData}
                                    >
                                        <SelectTrigger className="w-full h-12 rounded-xl border-slate-200 font-bold">
                                            <SelectValue placeholder={!selectedCourseData ? "Bölümler yükleniyor..." : "Bir bölüm seçin..."} />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-slate-200 z-[200]">
                                            {selectedCourseData?.modules && selectedCourseData.modules.length > 0 ? (
                                                selectedCourseData.modules.map((module: any) => (
                                                    <SelectItem key={module.id} value={module.id} className="font-bold cursor-pointer">
                                                        {module.title}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-2 text-sm text-gray-500 font-bold">Bu kursta henüz bölüm yok</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {selectedModuleId && (
                                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                    <Label className="font-bold text-slate-700">İçerik Seçin</Label>
                                    <Select
                                        value={selectedContentId}
                                        onValueChange={setSelectedContentId}
                                        disabled={!selectedModule}
                                    >
                                        <SelectTrigger className="w-full h-12 rounded-xl border-slate-200 font-bold">
                                            <SelectValue placeholder={!selectedModule ? "İçerikler yükleniyor..." : "Bir içerik seçin..."} />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-slate-200 z-[200]">
                                            {selectedModule?.contents && selectedModule.contents.length > 0 ? (
                                                selectedModule.contents.map((content: any) => (
                                                    <SelectItem key={content.id} value={content.id} className="font-bold cursor-pointer">
                                                        {content.title}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-2 text-sm text-gray-500 font-bold">Bu bölümde henüz içerik yok</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="submit" disabled={createItem.isPending} className={cn("text-white", colors.buttonBg, colors.buttonHover)}>
                            {createItem.isPending ? 'Ekleniyor...' : 'Ekle'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
