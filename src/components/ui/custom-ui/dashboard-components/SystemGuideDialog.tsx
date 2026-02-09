"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    X,
    ChevronRight,
    LayoutDashboard,
    Layers,
    Crop,
    Calculator,
    Settings2,
    Eye,
    Sparkles,
    ArrowRight,
    Youtube,
    Play,
    ListVideo,
    Tv
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SystemGuideDialogProps {
    isMobile?: boolean;
}

export function SystemGuideDialog({ isMobile }: SystemGuideDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const videoPlaylist = [
        {
            id: 1,
            title: "Testoloji'ye Genel Bakış ve İlk Sınav",
            duration: "12:45",
            thumbnail: "https://img.youtube.com/vi/NjVFTmJc8aM/maxresdefault.jpg",
            videoId: "NjVFTmJc8aM",
            description: "Sistemin genel işleyişi, proje oluşturma ve hızlı soru ekleme adımlarına dair temel rehber."
        },
        {
            id: 2,
            title: "PDF'den Soru Kırpma Teknolojisi",
            duration: "08:30",
            thumbnail: "https://img.youtube.com/vi/o4quRK1eEcg/maxresdefault.jpg",
            videoId: "o4quRK1eEcg",
            description: "Mevcut PDF'lerinizden saniyeler içinde soru ayıklamanın ve kütüphanenizi oluşturmanın püf noktaları."
        },
        {
            id: 3,
            title: "LaTeX ve Matematiksel Formül Yazımı",
            duration: "15:20",
            thumbnail: "https://img.youtube.com/vi/0Hxg18HrB4A/maxresdefault.jpg",
            videoId: "0Hxg18HrB4A",
            description: "Karmaşık matematiksel ifadeleri AI desteğiyle veya standart komutlarla profesyonelce yazın."
        }
    ];

    const [activeVideoId, setActiveVideoId] = useState(videoPlaylist[0].videoId);
    const activeVideo = videoPlaylist.find(v => v.videoId === activeVideoId) || videoPlaylist[0];

    const sections = [
        {
            title: "1. Dashboard (Ana Panel)",
            icon: <LayoutDashboard className="h-5 w-5 text-blue-500" />,
            content: "Uygulamaya giriş yaptığınızda sizi temiz bir dashboard karşılar. Burada mevcut projelerinizi görebilir, toplam soru istatistiklerinizi takip edebilir ve yeni bir çalışmaya başlayabilirsiniz.",
            image: "/guide/dashboard.png",
            bullets: [
                "Yeni Proje Oluştur: Sağ üstteki buton ile saniyeler içinde yeni bir sınav projesi başlatın.",
                "Proje Listesi: Her projenin altında soru sayısı ve son güncelleme tarihi gibi bilgileri görebilirsiniz."
            ]
        },
        {
            title: "2. Proje Detay Sayfası",
            icon: <Layers className="h-5 w-5 text-brand-500" />,
            content: "Bir projeye tıkladığınızda yönetici ekranına ulaşırsınız. Burası sınavınızın mutfağıdır.",
            image: "/guide/project_detail.png",
            bullets: [
                "Dizgiye Dahil Sorular: Eklediğiniz sorular burada listelenir.",
                "Sıralama: Soruları sürükle-bırak yöntemiyle sınav kağıdında görünecekleri sıraya dizebilirsiniz.",
                "Mizanpaj Ayarları: Her sorunun altındaki boşluğu (mm) ve zorluk seviyesini bağımsız olarak ayarlayabilirsiniz."
            ]
        },
        {
            title: "3. PDF'den Soru Kırpma Aracı",
            icon: <Crop className="h-5 w-5 text-green-500" />,
            content: "Elinizdeki mevcut PDF dokümanlarından soru ayıklamak hiç bu kadar kolay olmamıştı.",
            image: "/guide/pdf_cropper.png",
            bullets: [
                "PDF Yükle: Sisteme bir veya birden fazla PDF dosyası yükleyin.",
                "Kırpma: Fareniz ile soru alanını seçin.",
                "Kuyruğa Ekle: Kırptığınız bölge anında soldaki soru kuyruğuna eklenir."
            ]
        },
        {
            title: "4. Dijital Soru Editörü",
            icon: <Calculator className="h-5 w-5 text-purple-500" />,
            content: "Kendi sorularınızı yazmak veya yapay zeka ile matematiksel ifadeler oluşturmak için bu panel kullanılır.",
            image: "/guide/question_editor.png",
            bullets: [
                "Matematiksel Araçlar: Üst paneldeki butonlarla kesir, kök, integral gibi karmaşık formülleri tek tıkla ekleyin.",
                "Canlı Önizleme: Yazdığınız her şey sağ taraftaki 'Dijital Kağıt' üzerinde anlık olarak render edilir."
            ]
        },
        {
            title: "5. Soru Yazım Kılavuzu",
            icon: <Sparkles className="h-5 w-5 text-yellow-500" />,
            content: "Matematiksel formülleri nasıl yazacağınızı merak ediyorsanız, editör içindeki 'Kılavuz' butonu yanınızda.",
            image: "/guide/question_guide.png",
            bullets: [
                "$ simgesi: Metin içi ve blok formüller için standart LaTeX sözdizimini öğrenebilirsiniz.",
                "Örnekler: Sık kullanılan komutlar ve canlı örneklerle hızlıca profesyonelleşin."
            ]
        },
        {
            title: "6. Proje Ayarları",
            icon: <Settings2 className="h-5 w-5 text-gray-500" />,
            content: "Sınav kağıdının kurumsal kimliğini ve teknik detaylarını sağ taraftaki ayarlar panelinden yönetin.",
            image: "/guide/project_settings.png",
            bullets: [
                "Okul & Sınav Bilgileri: Başlık, alt başlık ve okul adını tanımlayın.",
                "Görünüm: Tek sütun veya çift sütun mizanpajı seçin.",
                "Gelişmiş: Otomatik cevap anahtarı ve QR kod özelliklerini aktifleştirin."
            ]
        },
        {
            title: "7. Canlı Önizleme ve Çıktı",
            icon: <Eye className="h-5 w-5 text-red-500" />,
            content: "En sonunda, hazırladığınız dökümanın baskıya nasıl yansıyacağını tam ekran görünümünde inceleyin.",
            image: "/guide/live_preview.png",
            bullets: [
                "Mizanpaj Kontrolü: Sayfa geçişlerini ve soru dizilimlerini kontrol edin.",
                "İndir: 'Dökümanı İndir' butonuyla yüksek çözünürlüklü PDF'nizi alın."
            ]
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {isMobile ? (
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-4 h-12 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-all cursor-pointer"
                    >
                        <BookOpen className="h-4 w-4" />
                        Kullanma Kılavuzu
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        className="flex h-10 px-4 rounded-xl gap-2 text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-all font-bold text-sm cursor-pointer whitespace-nowrap"
                    >
                        <BookOpen className="h-4 w-4" />
                        Kullanma Kılavuzu
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="!max-w-[1400px] w-[98vw] sm:w-[90vw] h-[95vh] sm:h-[90vh] p-0 overflow-hidden border-none shadow-2xl rounded-[1.5rem] sm:rounded-[2.5rem] bg-white flex flex-col font-sans">
                <DialogHeader className="h-20 sm:h-16 px-4 sm:px-8 border-b border-gray-100 flex flex-row items-center justify-between bg-white shrink-0 z-10 space-y-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-500 rounded-xl shadow-lg shadow-brand-500/20">
                            <BookOpen className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex flex-col text-left">
                            <DialogTitle className="text-xs sm:text-sm font-black uppercase tracking-widest text-gray-900 leading-none">
                                Testoloji Bilgi Merkezi
                            </DialogTitle>
                            <DialogDescription className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">
                                Görsel ve Video Rehberlerle Sistemi Keşfedin
                            </DialogDescription>
                        </div>
                    </div>
                    <Button
                        variant="ghost" size="icon"
                        className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gray-50 text-gray-400 border border-gray-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                <Tabs defaultValue="visual" className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-4 sm:px-8 border-b border-gray-50 bg-white/50 backdrop-blur-sm shrink-0 overflow-x-auto custom-scrollbar-hide">
                        <TabsList className="h-14 bg-transparent p-0 gap-4 sm:gap-8 flex-nowrap">
                            <TabsTrigger
                                value="visual"
                                className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-brand-500 data-[state=active]:bg-transparent data-[state=active]:text-brand-600 text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-widest transition-all whitespace-nowrap"
                            >
                                <div className="flex items-center gap-2">
                                    <Eye className="h-4 w-4" />
                                    Görsel Rehber
                                </div>
                            </TabsTrigger>
                            <TabsTrigger
                                value="video"
                                className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-brand-500 data-[state=active]:bg-transparent data-[state=active]:text-brand-600 text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-widest transition-all whitespace-nowrap"
                            >
                                <div className="flex items-center gap-2">
                                    <Youtube className="h-4 w-4" />
                                    Video Eğitimler
                                </div>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="visual" className="flex-1 m-0 overflow-hidden outline-none">
                        <ScrollArea className="h-full p-6 sm:p-12">
                            <div className="max-w-5xl mx-auto space-y-12 sm:space-y-20 pb-20">
                                {/* Hero Section */}
                                <div className="text-center space-y-4">
                                    <h1 className="text-2xl sm:text-4xl font-black tracking-tighter text-gray-900 uppercase">
                                        🚀 Sınav Hazırlamak <span className="text-brand-500">Artık Çok Kolay</span>
                                    </h1>
                                    <p className="text-sm sm:text-lg text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
                                        Testoloji ile saniyeler içinde profesional matematik testleri ve sınav kağıtları oluşturun.
                                        Apple estetiğiyle tasarlanmış bu rehberde tüm özellikleri keşfedin.
                                    </p>
                                </div>

                                {/* Content Sections */}
                                <div className="space-y-20 sm:space-y-32">
                                    {sections.map((section, idx) => (
                                        <div key={idx} className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 sm:gap-12 items-center`}>
                                            <div className="flex-1 w-full space-y-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                                                        {section.icon}
                                                    </div>
                                                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight">
                                                        {section.title}
                                                    </h2>
                                                </div>
                                                <p className="text-gray-600 font-medium leading-relaxed text-base sm:text-lg italic border-l-4 border-brand-500/20 pl-6">
                                                    {section.content}
                                                </p>
                                                <ul className="space-y-3">
                                                    {section.bullets.map((bullet, bIdx) => (
                                                        <li key={bIdx} className="flex items-start gap-3 group">
                                                            <ChevronRight className="h-5 w-5 text-brand-500 mt-1 shrink-0 transition-transform group-hover:translate-x-1" />
                                                            <span className="text-sm font-bold text-gray-500 tracking-tight leading-snug">
                                                                {bullet}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="flex-1 w-full">
                                                <div className="relative group">
                                                    <div className="absolute -inset-4 bg-brand-500/5 rounded-[2.5rem] blur-2xl group-hover:bg-brand-500/10 transition-colors" />
                                                    <div className="relative bg-white rounded-[2rem] border-4 sm:border-8 border-white shadow-2xl overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
                                                        <img src={section.image} alt={section.title} className="w-full h-auto" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer CTA */}
                                <div className="bg-gray-900 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 text-center space-y-6 shadow-2xl shadow-gray-900/20 border border-white/10">
                                    <div className="inline-flex p-4 bg-white/10 rounded-2xl backdrop-blur-xl mb-4">
                                        <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-brand-500" />
                                    </div>
                                    <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight">
                                        Hazırsanız <span className="text-brand-500">Hemen Başlayın!</span>
                                    </h2>
                                    <p className="text-sm sm:text-gray-400 font-medium max-w-xl mx-auto px-4">
                                        Testoloji ile sınav hazırlamak artık bir angarya değil, büyük bir keyif.
                                        Soru bankanızı hemen oluşturmaya başlayın.
                                    </p>
                                    <div className="pt-4">
                                        <Button
                                            onClick={() => setIsOpen(false)}
                                            className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white rounded-2xl px-10 h-14 font-black uppercase text-[10px] sm:text-sm gap-3 shadow-xl shadow-brand-500/20 transition-all active:scale-95"
                                        >
                                            KAPAT VE BAŞLA
                                            <ArrowRight className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="video" className="flex-1 m-0 overflow-hidden outline-none bg-gray-50/50">
                        <div className="flex flex-col lg:flex-row h-full overflow-hidden">
                            {/* Main Video View */}
                            <div className="flex-1 p-4 sm:p-8 flex flex-col gap-6 overflow-y-auto">
                                <div className="relative aspect-video bg-gray-950 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden group border-4 sm:border-[12px] border-white shrink-0">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=0&rel=0&modestbranding=1`}
                                        title={activeVideo.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="absolute inset-0"
                                    ></iframe>
                                </div>

                                <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-50 rounded-2xl flex items-center justify-center shrink-0">
                                        <Youtube className="h-6 w-6 sm:h-8 sm:w-8 text-brand-500" />
                                    </div>
                                    <div className="space-y-1 text-center sm:text-left">
                                        <h4 className="text-base sm:text-lg font-black text-gray-900 uppercase leading-tight">{activeVideo.title}</h4>
                                        <p className="text-sm sm:text-gray-500 font-medium leading-relaxed">
                                            {activeVideo.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Playlist Sidebar */}
                            <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-gray-100 bg-white/50 backdrop-blur-xl p-6 sm:p-8 flex flex-col gap-6 h-auto lg:h-full overflow-hidden shrink-0">
                                <div className="flex items-center justify-between shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-900 rounded-lg">
                                            <ListVideo className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-gray-900">Eğitim Listesi</span>
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-1 rounded-md uppercase tracking-widest">{videoPlaylist.length} Bölüm</span>
                                </div>

                                <div className="flex-1 min-h-0">
                                    <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto pb-4 lg:pb-0 h-full scroll-smooth custom-scrollbar-hide">
                                        {videoPlaylist.map((video) => (
                                            <div
                                                key={video.id}
                                                onClick={() => setActiveVideoId(video.videoId)}
                                                className={`p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] border transition-all cursor-pointer group flex flex-col gap-3 shrink-0 lg:shrink-1 w-[240px] sm:w-[280px] lg:w-full ${activeVideoId === video.videoId
                                                    ? "bg-white border-brand-500 shadow-2xl shadow-brand-500/10 ring-4 ring-brand-50"
                                                    : "bg-white/50 border-gray-100 hover:bg-white hover:border-gray-200"
                                                    }`}
                                            >
                                                <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 bg-gray-100">
                                                    <img
                                                        src={video.thumbnail}
                                                        className={`w-full h-full object-cover transition-transform duration-500 ${activeVideoId !== video.videoId && "grayscale opacity-50"} group-hover:scale-110`}
                                                        alt={video.title}
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Play className="h-8 w-8 text-white fill-white" />
                                                    </div>
                                                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-black text-white">
                                                        {video.duration}
                                                    </div>
                                                </div>
                                                <div className="px-1 py-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${activeVideoId === video.videoId ? "text-brand-500" : "text-gray-400"}`}>Bölüm {video.id}</span>
                                                        {activeVideoId === video.videoId && <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />}
                                                    </div>
                                                    <h5 className={`text-xs sm:text-sm font-black leading-tight line-clamp-2 ${activeVideoId === video.videoId ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600"}`}>
                                                        {video.title}
                                                    </h5>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
