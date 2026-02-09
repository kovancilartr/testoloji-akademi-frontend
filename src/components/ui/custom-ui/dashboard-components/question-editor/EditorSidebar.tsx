import React from "react";
import {
    Divide,
    Square,
    Sparkles,
    Type
} from "lucide-react";

interface EditorSidebarProps {
    content: string;
    setContent: (val: string) => void;
    insertMath: (latex: string) => void;
}

export function EditorSidebar({ content, setContent, insertMath }: EditorSidebarProps) {
    const tools = [
        { label: 'Kesir', icon: <Divide className="h-3.5 w-3.5" />, latex: '\\frac{a}{b}' },
        { label: 'Üs', icon: <span className="text-[10px] font-black">X²</span>, latex: 'x^{2}' },
        { label: 'Kök', icon: <Square className="h-3.5 w-3.5" />, latex: '\\sqrt{x}' },
        { label: 'Toplam', icon: <span className="text-[10px] font-black">Σ</span>, latex: '\\sum_{i=1}^{n}' },
        { label: 'Limit', icon: <span className="text-[10px] font-black">lim</span>, latex: '\\lim_{x \\to \\infty}' },
        { label: 'İnt', icon: <span className="text-[10px] font-black">∫</span>, latex: '\\int_{a}^{b}' },
        { label: 'Parantez', icon: <span className="text-[10px] font-black">()</span>, latex: '\\left( x \\right)' },
        { label: 'Çarpı', icon: <span className="text-[10px] font-black">×</span>, latex: '\\times' },
    ];

    return (
        <div className="w-full h-full flex flex-col bg-gray-50/30 overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="space-y-2 sm:space-y-3">
                    <label className="text-[9px] sm:text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Matematiksel Araçlar</label>
                    <div className="grid grid-cols-4 gap-2">
                        {tools.map((tool) => (
                            <button
                                key={tool.label}
                                onClick={() => insertMath(tool.latex)}
                                className="h-10 sm:h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-0.5 sm:gap-1 hover:border-brand-500 hover:text-brand-500 transition-all active:scale-95 group"
                            >
                                <div className="text-gray-400 group-hover:text-brand-500 scale-90 sm:scale-100">{tool.icon}</div>
                                <span className="text-[7px] sm:text-[8px] font-black uppercase text-gray-400 group-hover:text-brand-500">{tool.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                    <label className="text-[9px] sm:text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Soru Metni & LaTeX</label>
                    <div className="relative">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Soru metnini buraya yazın... Matematiksel ifadeler için $...$ veya $$...$$ kullanın."
                            className="w-full h-[300px] sm:h-[400px] bg-white border border-gray-100 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-inner resize-none leading-relaxed"
                        />
                        <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 p-1.5 sm:p-2 bg-gray-50 rounded-lg border border-gray-100">
                            <Type className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto p-4 sm:p-6 bg-white border-t border-gray-50">
                <div className="bg-brand-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-brand-100">
                    <div className="flex gap-2 sm:gap-3">
                        <div className="p-1 sm:p-1.5 bg-brand-500 rounded-lg shrink-0 h-fit">
                            <Sparkles className="h-2.5 sm:h-3 w-2.5 sm:w-3 text-white" />
                        </div>
                        <p className="text-[8px] sm:text-[10px] font-bold text-brand-600 leading-relaxed uppercase">
                            İpucu: LaTeX formüllerini $ simgesi arasına yazarak metin içinde kullanabilirsiniz. Örn: $x + 2 = 5$
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
