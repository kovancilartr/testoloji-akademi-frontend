"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings, Save, Loader2, QrCode, ClipboardList, Gauge, Layout, BookOpen, FilePlus, Sparkles, Feather, GraduationCap, Award, Type, Layers, Paintbrush } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ApiResponse } from "@/types/auth";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectSettings {
    title?: string;
    subtitle?: string;
    schoolName?: string;
    colCount?: number;
    questionSpacing?: number;
    watermarkText?: string;
    showDebug?: boolean;
    primaryColor?: string;
    fontFamily?: string;
    showDifficulty?: boolean;
    showAnswerKey?: boolean;
    qrCodeUrl?: string;
    template?: string;
    showCoverPage?: boolean;
    coverTitle?: string;
}

interface SettingsDialogProps {
    projectId: string;
    initialSettings?: ProjectSettings;
    onSettingsUpdated?: (settings: ProjectSettings) => void;
}

const COLORS = [
    { label: "Turuncu", value: "#f97316", class: "bg-brand-500" },
    { label: "Mavi", value: "#2563eb", class: "bg-blue-600" },
    { label: "Kırmızı", value: "#dc2626", class: "bg-red-600" },
    { label: "Yeşil", value: "#16a34a", class: "bg-green-600" },
    { label: "Mor", value: "#9333ea", class: "bg-purple-600" },
    { label: "Siyah", value: "#18181b", class: "bg-zinc-900" },
];

const FONTS = [
    { label: "Roboto (Modern & Şık)", value: "Roboto" },
    { label: "Open Sans (Sade & Okunaklı)", value: "Open Sans" },
    { label: "Montserrat (Kurumsal & Zarif)", value: "Montserrat" },
    { label: "Oswald (Modern & Dar)", value: "Oswald" },
];

import { useUpdateProjectSettings } from "@/hooks/use-projects";

export function SettingsDialog({ projectId, initialSettings, onSettingsUpdated }: SettingsDialogProps) {
    const [open, setOpen] = useState(false);
    const updateSettingsMutation = useUpdateProjectSettings();
    const isGuest = projectId?.startsWith('guest_');

    const [formData, setFormData] = useState<ProjectSettings>({
        title: "",
        subtitle: "",
        schoolName: "",
        colCount: 2,
        questionSpacing: 20,
        watermarkText: "",
        showDebug: false,
        primaryColor: "#f97316",
        fontFamily: "Roboto",
        showDifficulty: false,
        showAnswerKey: false,
        qrCodeUrl: "",
        template: "classic",
        showCoverPage: false,
        coverTitle: "",
    });

    useEffect(() => {
        if (open && initialSettings) {
            setFormData(initialSettings);
        }
    }, [open, initialSettings]);

    const handleChange = (key: keyof ProjectSettings, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        updateSettingsMutation.mutate({ id: projectId, settings: formData }, {
            onSuccess: (data) => {
                if (onSettingsUpdated) onSettingsUpdated(data.data);
                setOpen(false);
            }
        });
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    className="border-brand-200 text-brand-600 hover:bg-brand-50 rounded-xl h-10 px-4 font-black text-xs gap-2"
                >
                    <Settings className="h-4 w-4" />
                    Ayarlar
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-xl h-full p-0 flex flex-col shadow-2xl border-l border-brand-50 bg-white">
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <SheetHeader className="p-6 border-b border-gray-50 shrink-0">
                        <div className="space-y-1 text-left">
                            <SheetTitle className="text-xl font-black flex items-center gap-2.5 text-gray-900">
                                <div className="bg-brand-500 p-1.5 rounded-lg shadow-lg shadow-brand-500/20">
                                    <Settings className="h-4 w-4 text-white" />
                                </div>
                                Proje Ayarları
                            </SheetTitle>
                            <SheetDescription className="text-[11px] font-medium text-gray-400 uppercase tracking-widest leading-relaxed">
                                PDF çıktısı için gerekli olan başlık ve mizanpaj ayarları.
                            </SheetDescription>
                        </div>
                    </SheetHeader>

                    {/* Sidebar Content (Scrollable) */}
                    <ScrollArea className="flex-1 min-h-0 bg-gray-50/30">
                        <div className="p-6 space-y-10">
                            {/* Başlık Bilgileri Seksiyonu */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 px-1">
                                    <div className="bg-brand-500/10 p-2 rounded-xl">
                                        <Type className="h-4 w-4 text-brand-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Başlık Bilgileri</h3>
                                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">Döküman üzerinde görünecek metinler</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                    <div className="space-y-2">
                                        <Label htmlFor="schoolName" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Okul / Kurum Adı</Label>
                                        <Input
                                            id="schoolName"
                                            value={formData.schoolName || ""}
                                            onChange={(e) => handleChange("schoolName", e.target.value)}
                                            className="bg-gray-50/50 border-gray-100 shadow-none focus:bg-white focus:border-brand-500/50 transition-all h-11 text-sm rounded-xl font-medium"
                                            placeholder="Örn: Yalçın Fen Lisesi"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sınav Başlığı</Label>
                                            <Input
                                                id="title"
                                                value={formData.title || ""}
                                                onChange={(e) => handleChange("title", e.target.value)}
                                                className="bg-gray-50/50 border-gray-100 shadow-none focus:bg-white focus:border-brand-500/50 transition-all h-11 text-sm rounded-xl font-medium"
                                                placeholder="Örn: 12. Sınıf AYT Denemesi"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subtitle" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Alt Başlık / Kod</Label>
                                            <Input
                                                id="subtitle"
                                                value={formData.subtitle || ""}
                                                onChange={(e) => handleChange("subtitle", e.target.value)}
                                                className="bg-gray-50/50 border-gray-100 shadow-none focus:bg-white focus:border-brand-500/50 transition-all h-11 text-sm rounded-xl font-medium"
                                                placeholder="Örn: Matematik - TYT"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mizanpaj Seksiyonu */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 px-1">
                                    <div className="bg-brand-500/10 p-2 rounded-xl">
                                        <Layers className="h-4 w-4 text-brand-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Dizgi & Mizanpaj</h3>
                                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">PDF yerleşimi ve görsel tasarım</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-6 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="questionSpacing" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Soru Boşluğu (mm)</Label>
                                            <Select
                                                value={String(formData.questionSpacing || 20)}
                                                onValueChange={(val) => handleChange("questionSpacing", parseInt(val))}
                                            >
                                                <SelectTrigger className="bg-gray-50/50 border-gray-100 h-11 rounded-xl text-sm font-medium">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                                    {[5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(v => (
                                                        <SelectItem key={v} value={String(v)} className="text-sm font-medium">{v}mm</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="colCount" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sütun Sayısı</Label>
                                            <Select
                                                value={String(formData.colCount || 2)}
                                                onValueChange={(val) => handleChange("colCount", parseInt(val))}
                                            >
                                                <SelectTrigger className="bg-gray-50/50 border-gray-100 h-11 rounded-xl text-sm font-medium">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                                    <SelectItem value="1" className="text-sm font-medium">Tek Sütun (A4 Tam)</SelectItem>
                                                    <SelectItem value="2" className="text-sm font-medium">Çift Sütun (Klasik)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Paintbrush className="h-3 w-3" />
                                            Tema Rengi
                                            {isGuest && <span className="text-[8px] text-amber-500 font-bold">(Üye Özelliği)</span>}
                                        </Label>
                                        <div className="flex flex-wrap gap-3 p-1">
                                            {COLORS.map((color) => (
                                                <button
                                                    key={color.value}
                                                    type="button"
                                                    onClick={() => !isGuest && handleChange("primaryColor", color.value)}
                                                    disabled={isGuest}
                                                    className={`
                                                        group relative flex items-center justify-center w-8 h-8 rounded-full transition-all shadow-sm
                                                        ${color.class}
                                                        ${isGuest ? 'opacity-30 cursor-not-allowed' : 'hover:scale-125'}
                                                        ${formData.primaryColor === color.value ? 'ring-2 ring-offset-2 ring-brand-500 scale-125' : 'opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0'}
                                                    `}
                                                    title={isGuest ? "Üye olun" : color.label}
                                                >
                                                    {formData.primaryColor === color.value && (
                                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-in zoom-in-50 duration-300"></div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fontFamily" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                Yazı Tipi {isGuest && <span className="text-[8px] text-amber-500 font-bold">(Üye Özelliği)</span>}
                                            </Label>
                                            <Select
                                                value={formData.fontFamily || "Roboto"}
                                                onValueChange={(val) => handleChange("fontFamily", val)}
                                                disabled={isGuest}
                                            >
                                                <SelectTrigger className={`bg-gray-50/50 border-gray-100 h-11 rounded-xl text-sm font-medium ${isGuest ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                                    {FONTS.map((font) => (
                                                        <SelectItem key={font.value} value={font.value} className="text-sm font-medium">
                                                            {font.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="showDebug" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Çalışma Modu</Label>
                                            <Select
                                                value={String(formData.showDebug || false)}
                                                onValueChange={(val) => handleChange("showDebug", val === "true")}
                                            >
                                                <SelectTrigger className={`h-11 rounded-xl text-sm font-bold transition-all ${formData.showDebug ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-gray-50/50 border-gray-100'}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                                    <SelectItem value="false" className="text-sm font-medium">Normal Önizleme</SelectItem>
                                                    <SelectItem value="true" className="text-sm font-bold text-amber-600">Dizgi Uzman Modu (Kılavuzlu)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-gray-100" />

                            {/* Gelişmiş Özellikler Seksiyonu */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 px-1">
                                    <div className="bg-brand-500/10 p-2 rounded-xl">
                                        <Sparkles className="h-4 w-4 text-brand-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Gelişmiş Özellikler</h3>
                                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">Ek içerikler ve yardımcı araçlar</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                    <div className="grid grid-cols-1 gap-3">
                                        {/* Zorluk Seviyesi */}
                                        <div
                                            className={`flex items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-xl transition-colors relative ${isGuest ? 'opacity-60 cursor-not-allowed' : 'hover:border-brand-200 cursor-pointer group'}`}
                                            onClick={() => !isGuest && handleChange("showDifficulty", !formData.showDifficulty)}
                                        >
                                            {isGuest && (
                                                <div className="absolute inset-0 bg-gray-900/5 backdrop-blur-[0.5px] rounded-xl flex items-center justify-center z-10">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                                                        Üye Özelliği
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3">
                                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                                    <Gauge className="h-4 w-4 text-brand-500" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <Label className="text-xs font-bold text-gray-900 group-hover:text-brand-600 transition-colors">Zorluk Seviyeleri</Label>
                                                    <p className="text-[9px] text-gray-400 font-medium font-bold uppercase tracking-tighter leading-none">Soruların yanına P:7 gibi puanlar ekler</p>
                                                </div>
                                            </div>
                                            <Checkbox
                                                checked={formData.showDifficulty || false}
                                                onCheckedChange={(val) => !isGuest && handleChange("showDifficulty", val)}
                                                disabled={isGuest}
                                                className="data-[state=checked]:bg-brand-500 data-[state=checked]:border-brand-500 rounded-md"
                                            />
                                        </div>

                                        {/* Cevap Anahtarı - Guest için açık */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-xl hover:border-brand-200 transition-colors cursor-pointer group" onClick={() => handleChange("showAnswerKey", !formData.showAnswerKey)}>
                                            <div className="flex items-center gap-3">
                                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                                    <ClipboardList className="h-4 w-4 text-brand-500" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <Label className="text-xs font-bold text-gray-900 group-hover:text-brand-600 transition-colors">Cevap Anahtarı</Label>
                                                    <p className="text-[9px] text-gray-400 font-medium font-bold uppercase tracking-tighter leading-none">Döküman sonuna otomatik tablo ekler</p>
                                                </div>
                                            </div>
                                            <Checkbox
                                                checked={formData.showAnswerKey || false}
                                                onCheckedChange={(val) => handleChange("showAnswerKey", val)}
                                                className="data-[state=checked]:bg-brand-500 data-[state=checked]:border-brand-500 rounded-md"
                                            />
                                        </div>

                                        {/* Kapak Sayfası */}
                                        <div
                                            className={`flex items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-xl transition-colors relative ${isGuest ? 'opacity-60 cursor-not-allowed' : 'hover:border-brand-200 cursor-pointer group'}`}
                                            onClick={() => !isGuest && handleChange("showCoverPage", !formData.showCoverPage)}
                                        >
                                            {isGuest && (
                                                <div className="absolute inset-0 bg-gray-900/5 backdrop-blur-[0.5px] rounded-xl flex items-center justify-center z-10">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                                                        Üye Özelliği
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3">
                                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                                    <BookOpen className="h-4 w-4 text-brand-500" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <Label className="text-xs font-bold text-gray-900 group-hover:text-brand-600 transition-colors">Kapak Sayfası</Label>
                                                    <p className="text-[9px] text-gray-400 font-medium font-bold uppercase tracking-tighter leading-none">En öne profesyonel kapak ekler</p>
                                                </div>
                                            </div>
                                            <Checkbox
                                                checked={formData.showCoverPage || false}
                                                onCheckedChange={(val) => !isGuest && handleChange("showCoverPage", val)}
                                                disabled={isGuest}
                                                className="data-[state=checked]:bg-brand-500 data-[state=checked]:border-brand-500 rounded-md"
                                            />
                                        </div>
                                    </div>

                                    {formData.showCoverPage && !isGuest && (
                                        <div className="space-y-2 p-4 bg-brand-50/50 border border-brand-100 rounded-xl animate-in slide-in-from-top-2 duration-300">
                                            <Label htmlFor="coverTitle" className="text-[10px] font-black text-brand-600 uppercase tracking-widest flex items-center gap-2">
                                                <FilePlus className="h-3.5 w-3.5" />
                                                Kapak Sayfası Özel Başlık
                                            </Label>
                                            <Input
                                                id="coverTitle"
                                                value={formData.coverTitle || ""}
                                                onChange={(e) => handleChange("coverTitle", e.target.value)}
                                                className="bg-white border-brand-100 shadow-sm focus:border-brand-500/50 h-10 text-sm rounded-lg font-medium"
                                                placeholder="Boş bırakılırsa sınav başlığı kullanılır"
                                            />
                                        </div>
                                    )}

                                    {/* QR Kod */}
                                    <div className="space-y-3 pt-2 relative">
                                        {isGuest && (
                                            <div className="absolute inset-0 bg-gray-900/5 backdrop-blur-[0.5px] rounded-xl flex items-center justify-center z-10">
                                                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                                                    Üye Özelliği
                                                </span>
                                            </div>
                                        )}
                                        <Label htmlFor="qrCodeUrl" className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <QrCode className="h-3.5 w-3.5" />
                                            Akıllı QR Kod Linki
                                        </Label>
                                        <Input
                                            id="qrCodeUrl"
                                            value={formData.qrCodeUrl || ""}
                                            onChange={(e) => handleChange("qrCodeUrl", e.target.value)}
                                            disabled={isGuest}
                                            className={`bg-gray-50/50 border-gray-100 shadow-none focus:bg-white focus:border-brand-500/50 h-11 text-sm rounded-xl font-medium ${isGuest ? 'opacity-60' : ''}`}
                                            placeholder="Örn: https://testoloji.com/cozum/123"
                                        />
                                    </div>

                                    {/* Filigran */}
                                    <div className="space-y-2 relative">
                                        {isGuest && (
                                            <div className="absolute inset-0 bg-gray-900/5 backdrop-blur-[0.5px] rounded-xl flex items-center justify-center z-10">
                                                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                                                    Üye Özelliği
                                                </span>
                                            </div>
                                        )}
                                        <Label htmlFor="watermarkText" className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Sparkles className="h-3.5 w-3.5" />
                                            Filigran (Orta Çizgi Yazısı)
                                        </Label>
                                        <Input
                                            id="watermarkText"
                                            value={formData.watermarkText || ""}
                                            onChange={(e) => handleChange("watermarkText", e.target.value)}
                                            disabled={isGuest}
                                            className={`bg-gray-50/50 border-gray-100 shadow-none focus:bg-white focus:border-brand-500/50 h-11 text-sm rounded-xl font-medium ${isGuest ? 'opacity-60' : ''}`}
                                            placeholder="Örn: TESTOLOJİ AKADEMİ"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Şablon Seçimi Seksiyonu */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 px-1">
                                    <div className="bg-brand-500/10 p-2 rounded-xl">
                                        <Layout className="h-4 w-4 text-brand-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Tasarım Şablonu</h3>
                                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">Dökümanın genel görsel karakteri</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { id: 'classic', title: 'Klasik', desc: 'İki sütunlu, dengeli ve standart mizanpaj.', icon: Layout, badge: 'Ücretsiz' },
                                        { id: 'modern', title: 'Modern', desc: 'Geniş başlıklar ve minimalist dokunuşlar.', icon: Sparkles, badge: 'Gümüş' },
                                        { id: 'compact', title: 'Kompakt 2.0', desc: 'Maksimum verimlilik ve dar alan kullanımı.', icon: ClipboardList, badge: 'Gümüş' },
                                        { id: 'elegant', title: 'Zarif', desc: 'Yüksek kaliteli tipografi ve ince detaylar.', icon: Feather, badge: 'Altın' },
                                        { id: 'exam', title: 'Kurumsal Sınav', desc: 'Resmi sınav formatında, profesyonel düzen.', icon: GraduationCap, badge: 'Altın' },
                                        { id: 'osym', title: 'ÖSYM Tarzı', desc: 'Resmi ÖSYM döküman formatı ve talimatları.', icon: Award, badge: 'Altın' }
                                    ].map((tmpl) => {
                                        const isDisabled = isGuest && tmpl.id !== 'classic';
                                        return (
                                            <div
                                                key={tmpl.id}
                                                onClick={() => !isDisabled && handleChange("template", tmpl.id)}
                                                className={`
                                                    group flex items-center gap-4 p-4 rounded-2xl border-2 transition-all relative overflow-hidden
                                                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                                    ${formData.template === tmpl.id ? 'border-brand-500 bg-brand-50/30' : 'border-gray-100 bg-white hover:border-brand-200'}
                                                `}
                                            >
                                                {isDisabled && (
                                                    <div className="absolute inset-0 bg-gray-900/5 backdrop-blur-[0.5px] rounded-2xl flex items-center justify-center z-10">
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                                                            {tmpl.badge} Paket Gerekli
                                                        </span>
                                                    </div>
                                                )}
                                                <div className={`p-3 rounded-xl transition-all ${formData.template === tmpl.id ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'bg-gray-50 text-gray-400 group-hover:bg-brand-50 group-hover:text-brand-500'}`}>
                                                    <tmpl.icon className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <p className="text-sm font-black text-gray-900">{tmpl.title}</p>
                                                        <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-tighter ${tmpl.badge === 'Ücretsiz' ? 'bg-gray-100 text-gray-500' :
                                                            tmpl.badge === 'Gümüş' ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'
                                                            }`}>
                                                            {tmpl.badge}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 font-medium font-bold uppercase tracking-tight leading-none">{tmpl.desc}</p>
                                                </div>
                                                {formData.template === tmpl.id && (
                                                    <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center animate-in zoom-in duration-300">
                                                        <div className="w-2 h-2 bg-white rounded-full" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    {/* Sidebar Footer (Sticky) */}
                    <SheetFooter className="p-6 border-t border-gray-50 shrink-0 bg-white/80 backdrop-blur-md">
                        <Button
                            type="submit"
                            onClick={handleSave}
                            disabled={updateSettingsMutation.isPending}
                            className="w-full h-12 gap-2.5 bg-brand-500 hover:bg-brand-600 text-white shadow-xl shadow-brand-500/20 rounded-2xl font-black uppercase tracking-widest text-[11px]"
                        >
                            {updateSettingsMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {updateSettingsMutation.isPending ? "Kaydediliyor..." : "Ayarları Kaydet ve Uygula"}
                        </Button>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}
