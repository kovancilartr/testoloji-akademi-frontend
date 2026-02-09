"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Download, Loader2, Sparkles, X, Layout, FileText, CheckCircle2, User, Palette } from "lucide-react";
import { api } from "@/lib/api";
import { pdf } from "@react-pdf/renderer";
import { PDFDocument } from "@/components/pdf/PDFTemplate";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";

interface BookMergeDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedProjectIds: string[];
    projects: any[];
}

export function BookMergeDialog({ isOpen, onOpenChange, selectedProjectIds, projects }: BookMergeDialogProps) {
    const { user } = useAuth();
    const [isGenerating, setIsGenerating] = useState(false);
    const [bookTitle, setBookTitle] = useState("Yeni Soru Kitapçığı");
    const [schoolName, setSchoolName] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [watermarkText, setWatermarkText] = useState("");
    const [coverTemplate, setCoverTemplate] = useState<'modern_gradient' | 'minimalist_shapes' | 'creative_pattern'>('modern_gradient');
    const [contentTemplate, setContentTemplate] = useState<'classic' | 'modern' | 'compact'>('modern');
    const [showCoverPage, setShowCoverPage] = useState(true);
    const [allQuestions, setAllQuestions] = useState<any[]>([]);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

    const selectedProjects = projects.filter(p => selectedProjectIds.includes(p.id));

    useEffect(() => {
        if (isOpen && selectedProjectIds.length > 0) {
            fetchSelectedQuestions();
        }
    }, [isOpen, selectedProjectIds]);

    const fetchSelectedQuestions = async () => {
        setIsLoadingQuestions(true);
        try {
            const questionsArray: any[] = [];
            for (let i = 0; i < selectedProjectIds.length; i++) {
                const id = selectedProjectIds[i];
                const response = await api.get(`/projects/${id}`);
                if (response.data?.data?.questions) {
                    const projectQuestions = response.data.data.questions.map((q: any) => ({
                        ...q,
                        projectIndex: i // Track which test/file it belongs to
                    }));
                    questionsArray.push(...projectQuestions);
                }
            }
            setAllQuestions(questionsArray);
        } catch (error) {
            console.error(error);
            toast.error("Sorular yüklenirken bir hata oluştu.");
        } finally {
            setIsLoadingQuestions(false);
        }
    };

    const handleGenerateBook = async () => {
        if (allQuestions.length === 0) {
            toast.error("Kitapta soru bulunamadı.");
            return;
        }

        setIsGenerating(true);
        try {
            const blob = await pdf(
                <PDFDocument
                    questions={allQuestions}
                    projectName={bookTitle}
                    settings={{
                        title: bookTitle,
                        schoolName: schoolName,
                        authorName: authorName,
                        watermarkText: watermarkText,
                        colCount: 2,
                        questionSpacing: 20,
                        showAnswerKey: true,
                        template: contentTemplate,
                        showCoverPage: showCoverPage,
                        coverTemplate: coverTemplate,
                        coverTitle: bookTitle
                    }}
                    userRole={user?.role}
                />
            ).toBlob();

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${bookTitle}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Kitap başarıyla oluşturuldu!");
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error("Kitap oluşturulamadı.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white w-[95vw] h-[90vh] sm:h-[85vh]">
                <div className="flex flex-col h-full">
                    <div className="p-8 pb-4 space-y-4">
                        <DialogHeader className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="bg-brand-50 w-12 h-12 rounded-lg flex items-center justify-center shadow-inner ring-1 ring-brand-100/50">
                                    <BookOpen className="h-8 w-8 text-brand-600 animate-pulse" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kapak Sayfası</span>
                                    <button
                                        onClick={() => setShowCoverPage(!showCoverPage)}
                                        className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${showCoverPage ? 'bg-brand-500' : 'bg-gray-200'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${showCoverPage ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <DialogTitle className="text-lg font-black tracking-tight text-gray-900 leading-tight">
                                    Premium Kitap Dizgisi
                                </DialogTitle>
                                <DialogDescription className="font-bold text-xs text-gray-400 tracking-widest">
                                    {selectedProjectIds.length} Test • {allQuestions.length} Soru • Profesyonel Şablonlar
                                </DialogDescription>
                            </div>
                        </DialogHeader>
                    </div>

                    <ScrollArea className="flex-1 px-8">
                        <div className="space-y-8 pb-8">
                            <Tabs defaultValue="genel" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-50/50 p-1 rounded-xl mb-6">
                                    <TabsTrigger value="genel" className="rounded-lg font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                        Genel Bilgiler
                                    </TabsTrigger>
                                    <TabsTrigger value="tasarim" className="rounded-lg font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                        Kapak & Filigran
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="genel" className="space-y-2 mt-0">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Kitap Adı</Label>
                                            <div className="relative">
                                                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    value={bookTitle}
                                                    onChange={(e) => setBookTitle(e.target.value)}
                                                    placeholder="örn: 1. Dönem Deneme Sınavı"
                                                    className="h-12 pl-11 rounded-xl border-gray-100 bg-gray-50/50 font-bold focus:bg-white transition-all text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Okul / Kurum Adı</Label>
                                            <div className="relative">
                                                <Layout className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    value={schoolName}
                                                    onChange={(e) => setSchoolName(e.target.value)}
                                                    placeholder="örn: Atatürk Anadolu Lisesi"
                                                    className="h-12 pl-11 rounded-xl border-gray-100 bg-gray-50/50 font-bold focus:bg-white transition-all text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Birleştirilecek Dosyalar ({selectedProjectIds.length})</Label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {selectedProjects.map((p, idx) => (
                                                <div key={p.id} className="flex items-center justify-between bg-gray-50/50 px-4 py-3 rounded-xl border border-gray-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[10px] font-black text-brand-500 border border-brand-100">
                                                            {idx + 1}
                                                        </div>
                                                        <span className="text-[11px] font-bold text-gray-700 uppercase truncate max-w-[120px]">{p.name}</span>
                                                    </div>
                                                    <span className="text-[9px] font-black text-gray-400 uppercase">{p._count?.questions || 0} Soru</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="tasarim" className="space-y-2 mt-0">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between px-1">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dış Görünüm (Kapak)</Label>
                                            {showCoverPage && <span className="text-[9px] font-bold text-brand-500 bg-brand-50 px-2 py-0.5 rounded-full uppercase">Aktif</span>}
                                        </div>
                                        {showCoverPage ? (
                                            <div className="grid grid-cols-3 gap-3">
                                                {[
                                                    { id: 'modern_gradient', label: 'Modern', icon: Palette, color: 'from-orange-400 to-rose-400' },
                                                    { id: 'minimalist_shapes', label: 'Minimal', icon: Layout, color: 'from-blue-400 to-indigo-400' },
                                                    { id: 'creative_pattern', label: 'Kreatif', icon: Sparkles, color: 'from-emerald-400 to-teal-400' }
                                                ].map((t) => (
                                                    <button
                                                        key={t.id}
                                                        type="button"
                                                        onClick={() => setCoverTemplate(t.id as any)}
                                                        className={`relative group h-24 rounded-2xl border-2 transition-all overflow-hidden ${coverTemplate === t.id ? 'border-brand-500 ring-4 ring-brand-50' : 'border-gray-100 hover:border-brand-200'}`}
                                                    >
                                                        <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-10 group-hover:opacity-20`} />
                                                        <div className="relative h-full flex flex-col items-center justify-center gap-2">
                                                            <t.icon className={`h-6 w-6 ${coverTemplate === t.id ? 'text-brand-600' : 'text-gray-400'}`} />
                                                            <span className={`text-[10px] font-black uppercase tracking-wider ${coverTemplate === t.id ? 'text-brand-600' : 'text-gray-500'}`}>{t.label}</span>
                                                        </div>
                                                        {coverTemplate === t.id && (
                                                            <div className="absolute top-1.5 right-1.5 h-3 w-3 bg-brand-500 rounded-full border-2 border-white" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center px-6">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm">
                                                    <X className="h-5 w-5 text-gray-300" />
                                                </div>
                                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">Kapak Sayfası Devre Dışı</p>
                                                <p className="text-[9px] font-medium text-gray-400 mt-2">Döküman doğrudan ilk test ile başlayacaktır.</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">İçerik Tasarımı (Header/Footer)</Label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { id: 'modern', label: 'Modern', desc: 'Renkli & Şık' },
                                                { id: 'classic', label: 'Klasik', desc: 'Resmi & Net' },
                                                { id: 'compact', label: 'Kompakt', desc: 'Minimalist' }
                                            ].map((t) => (
                                                <button
                                                    key={t.id}
                                                    type="button"
                                                    onClick={() => setContentTemplate(t.id as any)}
                                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${contentTemplate === t.id ? 'border-brand-500 bg-brand-50/30 ring-4 ring-brand-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                                >
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${contentTemplate === t.id ? 'text-brand-600' : 'text-gray-900'}`}>{t.label}</span>
                                                    <span className="text-[8px] font-bold text-gray-400 uppercase leading-none">{t.desc}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Hazırlayan (Yazar)</Label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    value={authorName}
                                                    onChange={(e) => setAuthorName(e.target.value)}
                                                    placeholder="Adınız Soyadınız"
                                                    className="h-12 pl-11 rounded-xl border-gray-100 bg-gray-50/50 font-bold focus:bg-white transition-all text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Filigran (Watermark) Metni</Label>
                                            <div className="relative">
                                                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    value={watermarkText}
                                                    onChange={(e) => setWatermarkText(e.target.value)}
                                                    placeholder="örn: @hocaniz"
                                                    className="h-12 pl-11 rounded-xl border-gray-100 bg-gray-50/50 font-bold focus:bg-white transition-all text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className="p-5 bg-brand-50 rounded-2xl border border-brand-100 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-brand-600 uppercase tracking-widest leading-none mb-1">Dinamik Header Sistemi</div>
                                    <p className="text-[11px] font-bold text-gray-600 leading-tight">
                                        Her proje otomatik olarak "Test 1, Test 2..." şeklinde başlıklandırılacaktır. Sayfa geçişleri akıllı dizgi motoruyla hesaplanır.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    <div className="p-8 pt-4 flex flex-col gap-3 text-center shrink-0 bg-white relative z-20 shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.05)] border-t border-gray-100">
                        <Button
                            onClick={handleGenerateBook}
                            disabled={isGenerating || isLoadingQuestions || allQuestions.length === 0}
                            className="w-full h-14 bg-brand-500 hover:bg-brand-600 text-white rounded-[1.25rem] font-black text-base shadow-xl shadow-brand-500/20 gap-3 transition-all active:scale-95 disabled:grayscale"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Dizgi Hazırlanıyor...
                                </>
                            ) : (
                                <>
                                    <Download className="h-5 w-5" />
                                    Kitabı Oluştur ve İndir
                                </>
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="w-full h-10 rounded-xl font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all uppercase text-[9px] tracking-widest"
                        >
                            Vazgeç
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
