"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Video, ClipboardList, FileText, Clock, Users } from "lucide-react";

export interface ContentData {
    title: string;
    type: "VIDEO" | "PDF" | "TEST";
    url: string;
    projectId: string;
    duration?: number;
    attemptLimit?: number;
}

interface CreateContentDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    contentData: ContentData;
    onContentDataChange: (data: ContentData) => void;
    onSubmit: () => void;
    projects: any[]; // Replace with Project type if available
    isLoading: boolean;
    mode?: 'create' | 'edit';
}

export function CreateContentDialog({
    isOpen,
    onOpenChange,
    contentData,
    onContentDataChange,
    onSubmit,
    projects,
    isLoading,
    mode = 'create'
}: CreateContentDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md rounded-3xl p-6 md:p-8">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
                        {mode === 'create' ? 'İçerik Ekle' : 'İçeriği Düzenle'}
                    </DialogTitle>
                    <DialogDescription className="font-medium text-slate-500">
                        {mode === 'create' ? 'Modüle yeni bir ders veya materyal ekleyin.' : 'İçerik detaylarını güncelleyin.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-6">
                    <div className="space-y-3">
                        <Label className="font-bold text-slate-700">İçerik Türü</Label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'VIDEO', label: 'Video', icon: Video },
                                { id: 'TEST', label: 'Sınav', icon: ClipboardList },
                                { id: 'PDF', label: 'Döküman', icon: FileText }
                            ].map((type) => (
                                <button
                                    key={type.id}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${contentData.type === type.id
                                        ? 'ring-4 ring-orange-50 border-orange-500 bg-orange-50/20'
                                        : 'border-slate-100 hover:bg-slate-50'
                                        }`}
                                    onClick={() => onContentDataChange({ ...contentData, type: type.id as any })}
                                >
                                    <type.icon className={`w-6 h-6 mb-2 ${contentData.type === type.id ? 'text-orange-500' : 'text-slate-400'}`} />
                                    <span className={`text-[10px] font-black uppercase tracking-tight ${contentData.type === type.id ? 'text-orange-600' : 'text-slate-500'}`}>{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="font-bold text-slate-700">İçerik Başlığı</Label>
                        <Input
                            placeholder="..."
                            className="h-11 rounded-xl"
                            value={contentData.title}
                            onChange={e => onContentDataChange({ ...contentData, title: e.target.value })}
                        />
                    </div>

                    {contentData.type !== 'TEST' ? (
                        <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                            <Label className="font-bold text-slate-700">{contentData.type === 'VIDEO' ? 'Video URL' : 'İçerik URL'}</Label>
                            <Input
                                placeholder="https://..."
                                className="h-11 rounded-xl"
                                value={contentData.url}
                                onChange={e => onContentDataChange({ ...contentData, url: e.target.value })}
                            />
                            <p className="text-[10px] text-slate-400 font-bold uppercase py-1">Youtube, Vimeo veya Google Drive Bağlantısı</p>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Eklenecek Sınavı Seç</Label>
                                <Select
                                    value={contentData.projectId}
                                    onValueChange={(val) => {
                                        const p = projects?.find(x => x.id === val);
                                        onContentDataChange({ ...contentData, projectId: val, title: contentData.title || p?.name || "" });
                                    }}
                                >
                                    <SelectTrigger className="h-11 rounded-xl border-slate-200 font-bold">
                                        <SelectValue placeholder="Sınav seçiniz..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-200 z-[200]">
                                        <ScrollArea className="h-[200px]">
                                            {projects?.map(p => (
                                                <SelectItem key={p.id} value={p.id} className="font-bold cursor-pointer">{p.name}</SelectItem>
                                            ))}
                                        </ScrollArea>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-slate-400" /> Süre (Dk)
                                    </Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder="Sınırsız: 0"
                                        className="h-11 rounded-xl font-bold"
                                        value={contentData.duration || ''}
                                        onChange={e => onContentDataChange({
                                            ...contentData,
                                            duration: e.target.value === '' ? 0 : parseInt(e.target.value)
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-slate-400" /> Giriş Hakkı
                                    </Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder="Sınırsız: 0"
                                        className="h-11 rounded-xl font-bold"
                                        value={contentData.attemptLimit || ''}
                                        onChange={e => onContentDataChange({
                                            ...contentData,
                                            attemptLimit: e.target.value === '' ? 0 : parseInt(e.target.value)
                                        })}
                                    />
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Değer girilmezse veya 0 yazılırsa sınırsız olarak kabul edilir.</p>
                        </div>
                    )}
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-3 pt-4">
                    <Button variant="ghost" className="font-bold rounded-xl h-12" onClick={() => onOpenChange(false)}>İptal</Button>
                    <Button
                        className="bg-orange-500 hover:bg-orange-600 text-white font-black h-12 px-8 rounded-xl shadow-lg shadow-orange-100"
                        onClick={onSubmit}
                        disabled={isLoading}
                    >
                        {mode === 'create' ? 'İçeriği Ekle' : 'Değişiklikleri Kaydet'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
