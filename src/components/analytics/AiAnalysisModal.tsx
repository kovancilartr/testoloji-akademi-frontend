"use client";

import { useState } from "react";
import { Bot, Loader2, Sparkles, BookOpen, Target, Lightbulb, CheckCircle2, Download } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";
import type { Components } from "react-markdown";
import { pdf } from "@react-pdf/renderer";
import { AiAnalysisPDF } from "@/components/pdf/AiAnalysisPDF";
import { toast } from "sonner";

interface AiAnalysisModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    content: string | null;
    loading: boolean;
}

const markdownComponents: Components = {
    h1: ({ children }) => (
        <div className="flex items-center gap-3 mb-4 mt-6 first:mt-0">
            <div className="w-9 h-9 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
                <BookOpen className="w-4.5 h-4.5 text-white" />
            </div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-tight">{children}</h1>
        </div>
    ),
    h2: ({ children }) => (
        <div className="flex items-center gap-2.5 mb-3 mt-6 first:mt-0">
            <div className="w-7 h-7 bg-linear-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                <Target className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-base font-black text-slate-800 tracking-tight">{children}</h2>
        </div>
    ),
    h3: ({ children }) => (
        <div className="flex items-center gap-2 mb-2 mt-5 first:mt-0">
            <div className="w-1.5 h-5 bg-linear-to-b from-indigo-500 to-purple-500 rounded-full" />
            <h3 className="text-sm font-black text-slate-700 uppercase tracking-wide">{children}</h3>
        </div>
    ),
    h4: ({ children }) => (
        <h4 className="text-sm font-bold text-indigo-600 mb-2 mt-4 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            {children}
        </h4>
    ),
    p: ({ children }) => (
        <p className="text-[13px] leading-relaxed text-slate-600 mb-3">{children}</p>
    ),
    strong: ({ children }) => (
        <strong className="font-extrabold text-indigo-700">{children}</strong>
    ),
    em: ({ children }) => (
        <em className="not-italic text-indigo-600 font-semibold">{children}</em>
    ),
    ul: ({ children }) => (
        <ul className="space-y-1.5 mb-4 pl-0">{children}</ul>
    ),
    ol: ({ children }) => (
        <ol className="space-y-2 mb-4 pl-0 list-none counter-reset-item">{children}</ol>
    ),
    li: ({ children, ...props }) => {
        const isOrdered = props.node?.position && (props as any).ordered !== undefined;
        return (
            <li className="flex items-start gap-2.5 text-[13px] leading-relaxed text-slate-600">
                <div className="mt-1.5 w-1.5 h-1.5 bg-linear-to-br from-indigo-400 to-purple-500 rounded-full shrink-0" />
                <span className="flex-1">{children}</span>
            </li>
        );
    },
    blockquote: ({ children }) => (
        <div className="relative my-4 pl-4 py-3 pr-4 bg-linear-to-r from-indigo-50 via-purple-50/50 to-transparent border-l-4 border-indigo-400 rounded-r-xl">
            <Lightbulb className="absolute top-3 right-3 w-4 h-4 text-indigo-300" />
            <div className="text-[13px] text-indigo-700 font-medium [&>p]:mb-0">{children}</div>
        </div>
    ),
    code: ({ children, className }) => {
        const isBlock = className?.includes("language-");
        if (isBlock) {
            return (
                <div className="my-3 rounded-xl overflow-hidden border border-slate-200">
                    <div className="bg-slate-800 px-4 py-2 flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-2">Kod</span>
                    </div>
                    <pre className="bg-slate-900 px-4 py-3 overflow-x-auto">
                        <code className="text-xs text-emerald-300 font-mono">{children}</code>
                    </pre>
                </div>
            );
        }
        return (
            <code className="px-1.5 py-0.5 bg-slate-100 text-indigo-600 text-xs font-bold rounded-md border border-slate-200">{children}</code>
        );
    },
    table: ({ children }) => (
        <div className="my-4 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <table className="w-full text-sm">{children}</table>
        </div>
    ),
    thead: ({ children }) => (
        <thead className="bg-linear-to-r from-slate-100 to-slate-50">{children}</thead>
    ),
    th: ({ children }) => (
        <th className="px-4 py-2.5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">{children}</th>
    ),
    td: ({ children }) => (
        <td className="px-4 py-2.5 text-[13px] text-slate-600 border-b border-slate-50">{children}</td>
    ),
    hr: () => (
        <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />
            <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-indigo-300" />
                <div className="w-1 h-1 rounded-full bg-purple-300" />
                <div className="w-1 h-1 rounded-full bg-indigo-300" />
            </div>
            <div className="flex-1 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />
        </div>
    ),
    a: ({ children, href }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-500 font-bold underline decoration-indigo-200 underline-offset-2 hover:text-indigo-700 hover:decoration-indigo-400 transition-colors">
            {children}
        </a>
    ),
};

export function AiAnalysisModal({
    open,
    onOpenChange,
    title,
    content,
    loading,
}: AiAnalysisModalProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPdf = async () => {
        if (!content) return;
        setIsDownloading(true);
        try {
            const blob = await pdf(<AiAnalysisPDF title={title} content={content} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `AI_Koc_Analiz_${title.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.success('PDF başarıyla indirildi!');
        } catch (error) {
            console.error('PDF oluşturma hatası:', error);
            toast.error('PDF oluşturulurken bir hata oluştu.');
        } finally {
            setIsDownloading(false);
        }
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false} className="sm:max-w-5xl! max-h-[85vh] overflow-hidden flex flex-col rounded-[2.5rem] border-none shadow-2xl p-0">
                <DialogHeader className="p-5 pb-4 bg-linear-to-br from-indigo-950 via-slate-900 to-purple-950 text-white shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500 rounded-full blur-3xl" />
                    </div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-base font-black tracking-tight">AI Koç Analizi</DialogTitle>
                                <p className="text-[10px] font-bold text-slate-400 mt-0.5">{title}</p>
                            </div>
                        </div>
                        {content && !loading && (
                            <Button
                                onClick={handleDownloadPdf}
                                disabled={isDownloading}
                                variant="ghost"
                                size="sm"
                                className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl gap-1.5 text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                {isDownloading ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Download className="w-3.5 h-3.5" />
                                )}
                                PDF İndir
                            </Button>
                        )}
                    </div>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="h-52 flex flex-col items-center justify-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-400/20 rounded-full blur-xl animate-pulse" />
                                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin relative" />
                            </div>
                            <div className="text-center">
                                <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] block">Analiz yükleniyor</span>
                                <span className="text-[10px] text-slate-400 mt-1 block">Sınav detayları hazırlanıyor...</span>
                            </div>
                        </div>
                    ) : content ? (
                        <div className="p-6 lg:p-8">
                            {/* Üst bilgi kartı */}
                            <div className="flex items-center gap-3 mb-6 p-4 bg-linear-to-r from-indigo-50 via-purple-50/50 to-slate-50 rounded-2xl border border-indigo-100/50">
                                <div className="w-8 h-8 bg-linear-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-sm">
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.15em]">Yapay Zeka Analiz Raporu</p>
                                    <p className="text-xs font-bold text-slate-600">{title}</p>
                                </div>
                            </div>

                            {/* Markdown içerik */}
                            <div className="ai-analysis-content">
                                <ReactMarkdown
                                    remarkPlugins={[remarkMath, remarkGfm]}
                                    rehypePlugins={[rehypeKatex]}
                                    components={markdownComponents}
                                >
                                    {content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ) : (
                        <div className="h-52 flex flex-col items-center justify-center gap-4 text-center p-6">
                            <div className="w-16 h-16 bg-linear-to-br from-indigo-100 to-purple-100 rounded-[1.5rem] flex items-center justify-center shadow-sm">
                                <Sparkles className="w-8 h-8 text-indigo-500" />
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-sm font-black text-slate-700">Henüz AI analizi yapılmamış</p>
                                <p className="text-xs text-slate-400 max-w-[300px] leading-relaxed">
                                    AI Koç sayfasına gidip &quot;Son sınavımı analiz et&quot; diyerek detaylı değerlendirme alabilirsiniz.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
