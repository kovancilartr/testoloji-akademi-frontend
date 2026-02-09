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
    ChevronRight
} from "lucide-react";

export function EditorGuideModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-10 px-4 rounded-xl text-brand-600 hover:bg-brand-50 font-black text-xs gap-2"
                >
                    <BookOpen className="h-4 w-4" />
                    Kılavuz
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white rounded-[2rem] p-8 border-none shadow-2xl z-[500]">
                <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                    <DialogTitle className="text-xl font-black uppercase tracking-widest text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-brand-100 rounded-xl text-brand-600">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        Soru Yazım Kılavuzu
                    </DialogTitle>
                    <DialogDescription className="text-sm font-medium text-gray-500 mt-2 uppercase tracking-tighter">
                        {"Matematiksel ifadeleri $ simgesi ile yazabilirsiniz."}
                    </DialogDescription>
                </div>

                <ScrollArea className="h-[500px] mt-6 pr-4">
                    <div className="space-y-8 pb-8">
                        <section className="space-y-4">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                <ChevronRight className="h-4 w-4 text-brand-500" />
                                Metin İçi Formüller
                            </h3>
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-3">
                                <p className="text-xs font-medium text-gray-600 leading-relaxed">
                                    Metinle aynı hizada olan formüller için tek <code className="bg-white px-1.5 py-0.5 rounded border font-bold text-brand-600">$</code> işareti kullanın.
                                </p>
                                <div className="bg-white p-4 rounded-xl border border-gray-100 font-mono text-xs">
                                    {"Soru: $x + y = 10$ ise x kaçtır?"}
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                <ChevronRight className="h-4 w-4 text-brand-500" />
                                Büyük (Blok) Formüller
                            </h3>
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-3">
                                <p className="text-xs font-medium text-gray-600 leading-relaxed">
                                    Satırı ortalayan büyük formüller için çift <code className="bg-white px-1.5 py-0.5 rounded border font-bold text-brand-600">$$</code> işareti kullanın.
                                </p>
                                <div className="bg-white p-4 rounded-xl border border-gray-100 font-mono text-xs text-center">
                                    {"$$ \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a} $$"}
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                <ChevronRight className="h-4 w-4 text-brand-500" />
                                Sık Kullanılan Komutlar
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { name: 'Kesir', cmd: '\\frac{a}{b}' },
                                    { name: 'Kareköklü', cmd: '\\sqrt{x}' },
                                    { name: 'Üslü', cmd: 'x^{2}' },
                                    { name: 'Alt İndis', cmd: 'x_{i}' },
                                    { name: 'Toplam', cmd: '\\sum' },
                                    { name: 'İntegral', cmd: '\\int' },
                                    { name: 'Büyük/Küçük', cmd: '\\ge , \\le' },
                                    { name: 'Yunan Harf', cmd: '\\alpha , \\beta' },
                                ].map((item) => (
                                    <div key={item.name} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <span className="text-[10px] font-black text-gray-500 uppercase">{item.name}</span>
                                        <code className="text-[10px] font-bold text-brand-600">{item.cmd}</code>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="p-4 bg-brand-50 rounded-2xl border border-brand-100">
                            <p className="text-[10px] font-bold text-brand-700 uppercase leading-relaxed">
                                Profesyonel İpucu: Soldaki "Matematiksel Araçlar" panelindeki butonlara basarak bu kodları otomatik olarak ekleyebilirsiniz.
                            </p>
                        </div>
                    </div>
                </ScrollArea>
                <div className="mt-6 flex justify-end px-1">
                    <DialogTrigger asChild>
                        <Button className="bg-gray-900 text-white rounded-xl h-10 px-6 font-black text-xs uppercase">
                            ANLADIM
                        </Button>
                    </DialogTrigger>
                </div>
            </DialogContent>
        </Dialog>
    );
}
