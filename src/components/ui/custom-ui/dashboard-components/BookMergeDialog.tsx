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
import { PDFDocument } from "@/components/pdf/PDFTemplate";
import { PDFViewer } from "@react-pdf/renderer";
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
    const [coverTemplate, setCoverTemplate] = useState<'modern_gradient' | 'minimalist_shapes' | 'creative_pattern' | 'premium_vdk'>('modern_gradient');
    const [contentTemplate, setContentTemplate] = useState<'classic' | 'modern' | 'compact' | 'elegant'>('modern');
    const [showCoverPage, setShowCoverPage] = useState(true);
    const [allQuestions, setAllQuestions] = useState<any[]>([]);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
    const [showMobilePreview, setShowMobilePreview] = useState(false);

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
            const { pdf } = await import("@react-pdf/renderer");
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
        <>
            {/* DESKTOP FLOATING PREVIEW - Hidden on Mobile */}
            {isOpen && (
                <div
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    className="pdf-preview-container hidden sm:flex fixed bottom-10 right-10 w-[300px] h-[450px] bg-white rounded-[2.5rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.45)] border border-white/50 z-[10000] flex flex-col overflow-hidden animate-in slide-in-from-bottom-20 fade-in duration-1000 hover:scale-[1.02] transition-transform pointer-events-auto"
                >
                    <div className="p-4 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Canlı Önizleme</span>
                        </div>
                        <Sparkles className="h-4 w-4 text-brand-500" />
                    </div>

                    <div className="flex-1 bg-gray-50/20 p-4 overflow-hidden relative">
                        <div className="w-full h-full bg-white rounded-2xl shadow-inner overflow-hidden border border-gray-100/50">
                            {allQuestions.length > 0 ? (
                                <PDFViewer width="100%" height="100%" showToolbar={false} className="border-none">
                                    <PDFDocument
                                        questions={allQuestions.slice(0, 10)}
                                        projectName={bookTitle}
                                        settings={{
                                            title: bookTitle,
                                            schoolName: schoolName,
                                            authorName: authorName,
                                            watermarkText: watermarkText,
                                            colCount: 2,
                                            questionSpacing: 20,
                                            showAnswerKey: false,
                                            template: contentTemplate,
                                            showCoverPage: showCoverPage,
                                            coverTemplate: coverTemplate,
                                            coverTitle: bookTitle,
                                            primaryColor: '#f97316'
                                        }}
                                        userRole={user?.role}
                                    />
                                </PDFViewer>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                                    <Loader2 className="h-8 w-8 text-brand-200 animate-spin mb-3" />
                                    <p className="font-black text-gray-900 uppercase text-[9px] tracking-widest leading-none">Dizgi Hazırlanıyor</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="px-5 py-3 bg-white/90 backdrop-blur-md text-center border-t border-gray-100/50">
                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none block">Döküman İçinde Kaydırma Yapabilirsiniz</span>
                    </div>
                </div>
            )}

            <Dialog open={isOpen} onOpenChange={(open) => {
                // Prevent closing if full preview is active or if we're in the middle of generation
                if (!open && showMobilePreview) return;
                onOpenChange(open);
            }}>
                <DialogContent
                    onPointerDownOutside={(e) => {
                        // DESKTOP: Prevent closing if clicking on the floating preview container
                        const target = e.target as HTMLElement;
                        if (target?.closest('.pdf-preview-container')) {
                            e.preventDefault();
                        }
                    }}
                    onInteractOutside={(e) => {
                        if (showMobilePreview) e.preventDefault();
                    }}
                    className="sm:max-w-[550px] rounded-[2rem] sm:rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden bg-white w-[96vw] h-[90dvh] sm:h-auto"
                >
                    <div className="flex flex-col h-full relative">
                        <div className="p-5 sm:p-8 pb-3 sm:pb-4 space-y-3 sm:space-y-4 shrink-0">
                            <DialogHeader className="space-y-3 sm:space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="bg-brand-50 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shadow-inner ring-1 ring-brand-100/50">
                                        <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-brand-600 animate-pulse" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">Kapak Sayfası</span>
                                        <button
                                            onClick={() => setShowCoverPage(!showCoverPage)}
                                            className={`w-10 h-5 sm:w-12 sm:h-6 rounded-full p-1 transition-all duration-300 ${showCoverPage ? 'bg-brand-500' : 'bg-gray-200'}`}
                                        >
                                            <div className={`w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full transition-transform duration-300 ${showCoverPage ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <DialogTitle className="text-base sm:text-lg font-black tracking-tight text-gray-900 leading-tight">
                                        Premium Kitap Dizgisi
                                    </DialogTitle>
                                    <DialogDescription className="font-bold text-[10px] sm:text-xs text-gray-400 tracking-widest">
                                        {selectedProjectIds.length} Test • {allQuestions.length} Soru
                                    </DialogDescription>
                                </div>
                            </DialogHeader>
                        </div>

                        <ScrollArea className="flex-1 px-5 sm:px-8 min-h-0">
                            <div className="space-y-6 sm:space-y-8 pb-6 sm:pb-8">
                                <Tabs defaultValue="genel" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 h-10 sm:h-12 bg-gray-50/50 p-1 rounded-xl mb-4 sm:mb-6">
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
                                            <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Birleştirilecek Dosyalar ({selectedProjectIds.length})</Label>
                                            <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto pr-1">
                                                {selectedProjects.map((p, idx) => (
                                                    <div key={idx} className="flex items-center justify-between bg-gray-50/50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-100">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-white flex items-center justify-center text-[9px] sm:text-[10px] font-black text-brand-500 border border-brand-100">
                                                                {idx + 1}
                                                            </div>
                                                            <span className="text-[10px] sm:text-[11px] font-bold text-gray-700 uppercase truncate max-w-[140px] sm:max-w-none">{p.name}</span>
                                                        </div>
                                                        <span className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase">{p._count?.questions || 0} Soru</span>
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
                                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                                    {[
                                                        { id: 'modern_gradient', label: 'Modern', icon: Palette, color: 'from-orange-400 to-rose-400' },
                                                        { id: 'premium_vdk', label: 'Premium VDK', icon: Sparkles, color: 'from-blue-600 to-blue-800' },
                                                        { id: 'minimalist_shapes', label: 'Minimal', icon: Layout, color: 'from-blue-400 to-indigo-400' },
                                                        { id: 'creative_pattern', label: 'Kreatif', icon: Sparkles, color: 'from-emerald-400 to-teal-400' }
                                                    ].map((t) => (
                                                        <button
                                                            key={t.id}
                                                            type="button"
                                                            onClick={() => setCoverTemplate(t.id as any)}
                                                            className={`relative group h-14 sm:h-20 rounded-2xl border-2 transition-all overflow-hidden ${coverTemplate === t.id ? 'border-brand-500 ring-4 ring-brand-50' : 'border-gray-100 hover:border-brand-200'}`}
                                                        >
                                                            <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-10 group-hover:opacity-20`} />
                                                            <div className="relative h-full flex flex-col items-center justify-center gap-1">
                                                                <t.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${coverTemplate === t.id ? 'text-brand-600' : 'text-gray-400'}`} />
                                                                <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider ${coverTemplate === t.id ? 'text-brand-600' : 'text-gray-500'}`}>{t.label}</span>
                                                            </div>
                                                            {coverTemplate === t.id && (
                                                                <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 h-2 w-2 sm:h-3 sm:w-3 bg-brand-500 rounded-full border border-white" />
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="py-6 sm:py-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center px-6">
                                                    <p className="text-[9px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">Kapak Sayfası Devre Dışı</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">İçerik Tasarımı (Header/Footer)</Label>
                                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                                {[
                                                    { id: 'modern', label: 'Modern', desc: 'Renkli & Şık' },
                                                    { id: 'elegant', label: 'Zarif', desc: 'Dizgi Uzmanı' },
                                                    { id: 'classic', label: 'Klasik', desc: 'Resmi & Net' },
                                                    { id: 'compact', label: 'Kompakt', desc: 'Minimalist' }
                                                ].map((t) => (
                                                    <button
                                                        key={t.id}
                                                        type="button"
                                                        onClick={() => setContentTemplate(t.id as any)}
                                                        className={`p-2 sm:p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${contentTemplate === t.id ? 'border-brand-500 bg-brand-50/30 ring-4 ring-brand-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                                    >
                                                        <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest ${contentTemplate === t.id ? 'text-brand-600' : 'text-gray-900'}`}>{t.label}</span>
                                                        <span className="text-[6px] sm:text-[7px] font-bold text-gray-400 uppercase leading-none">{t.desc}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Hazırlayan</Label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        value={authorName}
                                                        onChange={(e) => setAuthorName(e.target.value)}
                                                        placeholder="Adınız"
                                                        className="h-10 sm:h-12 pl-11 rounded-xl border-gray-100 bg-gray-50/50 font-bold focus:bg-white transition-all text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Filigran</Label>
                                                <div className="relative">
                                                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        value={watermarkText}
                                                        onChange={(e) => setWatermarkText(e.target.value)}
                                                        placeholder="@metni"
                                                        className="h-10 sm:h-12 pl-11 rounded-xl border-gray-100 bg-gray-50/50 font-bold focus:bg-white transition-all text-sm"
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

                        <div className="p-5 sm:p-8 pt-3 sm:pt-4 flex flex-col gap-3 text-center shrink-0 bg-white relative z-20 shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.05)] border-t border-gray-100">
                            <Button
                                onClick={handleGenerateBook}
                                disabled={isGenerating || isLoadingQuestions || allQuestions.length === 0}
                                className="w-full h-12 sm:h-14 bg-brand-500 hover:bg-brand-600 text-white rounded-xl sm:rounded-[1.25rem] font-black text-sm sm:text-base shadow-xl shadow-brand-500/20 gap-2 sm:gap-3 transition-all active:scale-95 disabled:grayscale"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                                        Dizgi Hazırlanıyor...
                                    </>
                                ) : (
                                    <>
                                        <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                                        Kitabı Oluştur ve İndir
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="w-full h-8 sm:h-10 rounded-xl font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all uppercase text-[8px] sm:text-[9px] tracking-widest"
                            >
                                Vazgeç
                            </Button>
                        </div>

                        {!showMobilePreview && (
                            <Button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowMobilePreview(true);
                                }}
                                className="sm:hidden fixed bottom-28 right-6 w-14 h-14 rounded-full bg-brand-500 shadow-[0_15px_40px_-10px_rgba(249,115,22,0.5)] z-[100] p-0 animate-in zoom-in duration-300 border-2 border-white pointer-events-auto"
                            >
                                <Palette className="h-6 w-6 text-white" />
                            </Button>
                        )}

                        {showMobilePreview && (
                            <div className="sm:hidden absolute inset-0 bg-white z-[110] flex flex-col animate-in slide-in-from-bottom duration-500 pointer-events-auto">
                                <div className="p-4 bg-white border-b flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Mobil Önizleme</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setShowMobilePreview(false);
                                        }}
                                        className="rounded-full h-10 w-10 p-0 hover:bg-gray-100"
                                    >
                                        <X className="h-5 w-5 text-gray-500" />
                                    </Button>
                                </div>
                                <div className="flex-1 bg-gray-50 p-4">
                                    <div className="w-full h-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
                                        {allQuestions.length > 0 ? (
                                            <PDFViewer width="100%" height="100%" showToolbar={false} className="border-none">
                                                <PDFDocument
                                                    questions={allQuestions.slice(0, 5)}
                                                    projectName={bookTitle}
                                                    settings={{
                                                        title: bookTitle,
                                                        schoolName: schoolName,
                                                        authorName: authorName,
                                                        watermarkText: watermarkText,
                                                        colCount: 2,
                                                        questionSpacing: 20,
                                                        showAnswerKey: false,
                                                        template: contentTemplate,
                                                        showCoverPage: showCoverPage,
                                                        coverTemplate: coverTemplate,
                                                        coverTitle: bookTitle,
                                                        primaryColor: '#f97316'
                                                    }}
                                                    userRole={user?.role}
                                                />
                                            </PDFViewer>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center">
                                                <Loader2 className="h-8 w-8 text-brand-200 animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 bg-white border-t text-center">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Görünümü Kapatmak İçin Kapat Butonuna Tıklayınız</p>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
