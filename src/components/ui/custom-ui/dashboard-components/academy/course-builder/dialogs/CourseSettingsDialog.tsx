"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, UserPlus, UserMinus, X } from "lucide-react";

interface CourseSettings {
    title: string;
    description: string;
    isPublished: boolean;
}

interface CourseSettingsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    settings: CourseSettings;
    onSettingsChange: (settings: CourseSettings) => void;
    onSaveSettings: () => void;
    isLoadingSettings?: boolean;
    studentSearch: string;
    onStudentSearchChange: (search: string) => void;
    filteredStudents: any[];
    enrollments?: any[];
    onEnrollToggle: (studentId: string, isEnrolled: boolean) => void;
    isEnrollLoading?: boolean;
}

export function CourseSettingsDialog({
    isOpen,
    onOpenChange,
    settings,
    onSettingsChange,
    onSaveSettings,
    isLoadingSettings,
    studentSearch,
    onStudentSearchChange,
    filteredStudents,
    enrollments,
    onEnrollToggle,
    isEnrollLoading
}: CourseSettingsDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false} className="max-w-xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                <Tabs defaultValue="general" className="w-full">
                    <div className="px-8 pt-8 pb-4 bg-slate-50/50 border-b border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Kurs Ayarları</DialogTitle>
                                <DialogDescription className="font-medium text-slate-500 text-xs uppercase tracking-widest mt-1">Yapılandırma & Kontrol</DialogDescription>
                            </div>
                        </div>
                        <TabsList className="bg-slate-200/40 p-1 rounded-xl h-10 w-full mb-2">
                            <TabsTrigger value="general" className="flex-1 rounded-lg font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">Genel Bilgiler</TabsTrigger>
                            <TabsTrigger value="students" className="flex-1 rounded-lg font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">Öğrenci Yönetimi</TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="p-8">
                        <TabsContent value="general" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kurs Adı</Label>
                                <Input
                                    className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-orange-500/10 font-bold transition-all"
                                    value={settings.title}
                                    onChange={e => onSettingsChange({ ...settings, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Açıklama</Label>
                                <Textarea
                                    className="min-h-[140px] rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-orange-500/10 font-medium resize-none transition-all leading-relaxed"
                                    placeholder="Kurs hakkında detaylı bilgi girin..."
                                    value={settings.description}
                                    onChange={e => onSettingsChange({ ...settings, description: e.target.value })}
                                />
                            </div>
                            <div className="pt-4">
                                <Button
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black h-12 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98]"
                                    onClick={onSaveSettings}
                                    disabled={isLoadingSettings}
                                >
                                    Değişiklikleri Kaydet
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="students" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                                <Input
                                    placeholder="Öğrenci ismine göre hızlı ara..."
                                    className="h-11 pl-11 pr-4 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-orange-500/10 text-xs font-bold transition-all"
                                    value={studentSearch}
                                    onChange={e => onStudentSearchChange(e.target.value)}
                                />
                            </div>

                            <div className="bg-slate-50/30 rounded-3xl p-2 border border-slate-100">
                                <ScrollArea className="h-[280px] px-2">
                                    <div className="space-y-1.5 py-2">
                                        {filteredStudents.length === 0 ? (
                                            <div className="py-20 text-center">
                                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Öğrenci Bulunamadı</p>
                                            </div>
                                        ) : (
                                            filteredStudents.map(s => {
                                                const isEnrolled = enrollments?.some((e: any) => e.studentId === s.id);
                                                return (
                                                    <div
                                                        key={s.id}
                                                        className={`group flex items-center justify-between p-3 rounded-2xl transition-all duration-300 ${isEnrolled ? 'bg-white shadow-sm border border-slate-100' : 'hover:bg-white/60'}`}
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-all duration-500 ${isEnrolled ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'bg-slate-200 text-slate-500 group-hover:bg-slate-900 group-hover:text-white'}`}>
                                                                {s.name[0]}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-bold text-slate-700 text-[13px] truncate">{s.name}</p>
                                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{s.gradeLevel || 'Öğrenci'}</p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className={`h-8 px-3 rounded-xl cursor-pointer font-black text-[10px] tracking-widest transition-all ${isEnrolled ? 'text-red-500 hover:bg-red-50' : 'text-indigo-600 hover:bg-slate-100'}`}
                                                            onClick={() => onEnrollToggle(s.id, !!isEnrolled)}
                                                            disabled={isEnrollLoading}
                                                        >
                                                            {isEnrolled ? (
                                                                <><UserMinus className="w-3.5 h-3.5 mr-1.5" /> ÇIKAR</>
                                                            ) : (
                                                                <><UserPlus className="w-3.5 h-3.5 mr-1.5" /> EKLE</>
                                                            )}
                                                        </Button>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
