
import React from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    BookOpen,
    Sparkles,
    ChevronRight,
    Crop,
    Move,
    Scan,
    Wand2,
    Settings2
} from "lucide-react";

export function PdfGuideModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-brand-600 hover:bg-brand-50"
                    title="Nasıl Kullanılır?"
                >
                    <BookOpen className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] w-full sm:max-w-2xl bg-white rounded-xl sm:rounded-[2rem] p-4 sm:p-8 border-none shadow-2xl z-[500] max-h-[90vh] flex flex-col">
                <div className="flex flex-col space-y-1.5 text-center sm:text-left shrink-0">
                    <DialogTitle className="text-lg sm:text-xl font-black uppercase tracking-widest text-gray-900 flex items-center justify-center sm:justify-start gap-3">
                        <div className="p-2 bg-brand-100 rounded-xl text-brand-600">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        Kırpma Aracı Kılavuzu
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm font-medium text-gray-600 mt-2">
                        PDF üzerindeki soruları kolayca seçip dijitalleştirebilirsiniz.
                    </DialogDescription>
                </div>

                <div className="flex-1 overflow-y-auto mt-4 sm:mt-6 -mr-2 sm:-mr-4 pr-2 sm:pr-4">
                    <div className="space-y-6 sm:space-y-8 pb-4">
                        <section className="space-y-3 sm:space-y-4">
                            <h3 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                <ChevronRight className="h-4 w-4 text-brand-500" />
                                Temel Araçlar
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                                    <div className="flex items-center gap-2 text-gray-900 font-bold text-xs sm:text-sm uppercase">
                                        <div className="p-1.5 bg-white rounded-lg shadow-sm text-brand-500"><Crop className="h-4 w-4" /></div>
                                        Kırpma Modu
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed font-medium">Parmağınızla veya mouse ile bir kare çizerek soruyu seçmenizi sağlar.</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                                    <div className="flex items-center gap-2 text-gray-900 font-bold text-xs sm:text-sm uppercase">
                                        <div className="p-1.5 bg-white rounded-lg shadow-sm text-brand-500"><Move className="h-4 w-4" /></div>
                                        Kaydırma Modu
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed font-medium">Sayfa içinde özgürce gezinmenizi sağlar. Zoom yaptığınızda kullanışlıdır.</p>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-3 sm:space-y-4">
                            <h3 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                <ChevronRight className="h-4 w-4 text-brand-500" />
                                Akıllı Seçim Araçları
                            </h3>
                            <div className="space-y-3">
                                <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-100 flex items-start gap-4">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                                        <Wand2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs sm:text-sm font-black text-blue-900 uppercase mb-1">Sihirli Makas (Magic Scan)</h4>
                                        <p className="text-xs text-blue-800 leading-relaxed font-medium">
                                            Bu modu açıp herhangi bir soruya tıklayın, yapay zeka sorunun sınırlarını algılayıp sizin için otomatik seçecektir.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-4">
                                    <div className="p-2 bg-white text-gray-500 rounded-lg shrink-0 shadow-sm">
                                        <Scan className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs sm:text-sm font-black text-gray-900 uppercase mb-1">Otomatik Alan Seçimi</h4>
                                        <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                            Sihirli makasın bulmakta zorlandığı alanları, etrafında kabaca bir çerçeve çizerek otomatik düzeltebilirsiniz.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-3 sm:space-y-4">
                            <h3 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                <ChevronRight className="h-4 w-4 text-brand-500" />
                                İpuçları & Ayarlar
                            </h3>
                            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-100 grid gap-4">
                                <div className="flex items-start gap-3">
                                    <Settings2 className="h-4 w-4 text-brand-500 mt-0.5" />
                                    <div>
                                        <p className="text-xs sm:text-sm font-bold text-gray-900">Gelişmiş Ayarlar</p>
                                        <p className="text-xs text-gray-600 mt-1 font-medium">Sağ üstteki ayarlar ikonuna tıklayarak <span className="font-bold text-gray-900">Zoom (Yakınlaştırma)</span>, <span className="font-bold text-gray-900">Render Kalitesi</span> ve <span className="font-bold text-gray-900">Akıllı Odak</span> özelliklerini açabilirsiniz.</p>
                                    </div>
                                </div>
                                <div className="h-px bg-gray-200" />
                                <div className="flex items-start gap-3">
                                    <Sparkles className="h-4 w-4 text-brand-500 mt-0.5" />
                                    <div>
                                        <p className="text-xs sm:text-sm font-bold text-gray-900">Akıllı Odak Nedir?</p>
                                        <p className="text-xs text-gray-600 mt-1 font-medium">Mıknatıs etkisi yaratarak seçiminizi en yakın metin bloklarına ve görsellere yapıştırır. Hassas kırpma sağlar.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <div className="mt-1 sm:mt-6 flex justify-end shrink-0">
                    <DialogTrigger asChild>
                        <Button className="bg-gray-900 text-white rounded-xl h-10 px-6 font-black text-xs uppercase  sm:w-auto">
                            ANLADIM
                        </Button>
                    </DialogTrigger>
                </div>
            </DialogContent>
        </Dialog>
    );
}
