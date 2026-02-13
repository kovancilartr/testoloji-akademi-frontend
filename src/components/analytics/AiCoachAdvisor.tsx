"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
    Bot,
    Sparkles,
    Zap,
    Loader2,
    TrendingUp,
    Target,
    AlertCircle,
    BrainCircuit,
    Send,
    CheckCircle2,
    Copy,
    Check,
    GraduationCap,
    BookOpen,
    ChevronUp,
    Clock,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useCoachingHistory, useCoachingUsage } from "@/hooks/use-analytics";
import { useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: Date;
}

const PRESET_PROMPTS = [
    {
        id: "eval",
        label: "Genel Değerlendirme",
        query: "Sınav sonuçlarımı genel olarak analiz et ve gelişmem için 3 somut öneri ver.",
        icon: TrendingUp,
        color: "bg-indigo-50 text-indigo-600 border-indigo-100",
        gradient: "from-indigo-500 to-blue-500"
    },
    {
        id: "weak",
        label: "Zayıf Noktalarım",
        query: "Sınavlarımdaki yanlışlarımı ve zayıf olduğum alanları tespit et.",
        icon: AlertCircle,
        color: "bg-rose-50 text-rose-600 border-rose-100",
        gradient: "from-rose-500 to-pink-500"
    },
    {
        id: "trend",
        label: "Başarı Trendim",
        query: "Son sınavlardaki başarı trendim nasıl? Artış veya azalışın sebepleri ne olabilir?",
        icon: Target,
        color: "bg-emerald-50 text-emerald-600 border-emerald-100",
        gradient: "from-emerald-500 to-teal-500"
    },
    {
        id: "strategy",
        label: "Sınav Stratejisi",
        query: "Sonuçlarıma göre sınav anında süreyi daha iyi yönetmek için ne yapmalıyım?",
        icon: BrainCircuit,
        color: "bg-amber-50 text-amber-600 border-amber-100",
        gradient: "from-amber-500 to-orange-500"
    }
];

// Markdown + LaTeX render eden bileşen
function MarkdownMessage({ content }: { content: string }) {
    const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedBlock(text);
        setTimeout(() => setCopiedBlock(null), 2000);
    };

    return (
        <ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
            components={{
                h1: ({ children }) => (
                    <h1 className="text-lg font-black text-slate-900 mt-4 mb-2 pb-2 border-b border-slate-200 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-indigo-500 shrink-0" />
                        {children}
                    </h1>
                ),
                h2: ({ children }) => (
                    <h2 className="text-base font-extrabold text-slate-800 mt-3 mb-1.5 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                        {children}
                    </h2>
                ),
                h3: ({ children }) => (
                    <h3 className="text-sm font-bold text-slate-700 mt-2.5 mb-1 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full shrink-0" />
                        {children}
                    </h3>
                ),
                h4: ({ children }) => (
                    <h4 className="text-xs font-bold text-slate-600 mt-2 mb-1">{children}</h4>
                ),
                p: ({ children }) => (
                    <p className="text-[13px] text-slate-600 leading-relaxed mb-2 last:mb-0">{children}</p>
                ),
                strong: ({ children }) => (
                    <strong className="font-extrabold text-slate-800">{children}</strong>
                ),
                em: ({ children }) => (
                    <em className="text-indigo-600 not-italic font-semibold">{children}</em>
                ),
                ul: ({ children }) => (
                    <ul className="space-y-1 my-2 ml-1">{children}</ul>
                ),
                ol: ({ children }) => (
                    <ol className="space-y-1.5 my-2 ml-1 list-none">{children}</ol>
                ),
                li: ({ children }) => (
                    <li className="flex items-start gap-2 text-[13px] text-slate-600 leading-relaxed">
                        <span className="mt-1 shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        </span>
                        <span className="flex-1">{children}</span>
                    </li>
                ),
                code: ({ className, children }) => {
                    const isInline = !className;
                    const codeContent = String(children).replace(/\n$/, '');

                    if (isInline) {
                        return (
                            <code className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-md text-xs font-mono font-bold border border-indigo-100/50">
                                {children}
                            </code>
                        );
                    }

                    return (
                        <div className="relative group my-3 rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                            <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    {className?.replace('language-', '') || 'kod'}
                                </span>
                                <button
                                    onClick={() => handleCopy(codeContent)}
                                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors"
                                >
                                    {copiedBlock === codeContent ? (
                                        <><Check className="w-3 h-3" /> Kopyalandı</>
                                    ) : (
                                        <><Copy className="w-3 h-3" /> Kopyala</>
                                    )}
                                </button>
                            </div>
                            <pre className="p-4 overflow-x-auto">
                                <code className="text-xs font-mono text-slate-300 leading-relaxed">{children}</code>
                            </pre>
                        </div>
                    );
                },
                table: ({ children }) => (
                    <div className="my-3 rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-xs">{children}</table>
                    </div>
                ),
                thead: ({ children }) => <thead className="bg-slate-50">{children}</thead>,
                th: ({ children }) => (
                    <th className="px-3 py-2 text-left font-bold text-slate-700 border-b border-slate-200 text-xs">{children}</th>
                ),
                td: ({ children }) => (
                    <td className="px-3 py-2 text-slate-600 border-b border-slate-100 text-xs">{children}</td>
                ),
                a: ({ children, href }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 underline decoration-indigo-200 underline-offset-2 font-semibold transition-colors">
                        {children}
                    </a>
                ),
                blockquote: ({ children }) => (
                    <blockquote className="my-2 pl-3 border-l-[3px] border-indigo-400 bg-indigo-50/50 py-2 pr-3 rounded-r-lg italic text-slate-600">
                        {children}
                    </blockquote>
                ),
                hr: () => (
                    <hr className="my-3 border-none h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
}

export function AiCoachAdvisor() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [historyLoaded, setHistoryLoaded] = useState(false);

    const isStudent = user?.role === 'STUDENT';

    // React Query ile cache'lenmiş history ve usage
    const { data: historyData } = useCoachingHistory(isOpen && isStudent, 1, 1);
    const { data: usageData } = useCoachingUsage(isOpen && isStudent);

    const usage = usageData || { count: 0, limit: 10, remaining: 10 };

    // History verisini mesajlara dönüştür (sadece ilk yüklemede)
    useEffect(() => {
        if (historyData?.items && !historyLoaded && isOpen) {
            const history = historyData.items
                .map((h: any) => ([
                    { id: h.id + '-q', role: 'user' as const, content: h.query, createdAt: new Date(h.createdAt) },
                    { id: h.id + '-r', role: 'assistant' as const, content: h.response, createdAt: new Date(h.createdAt) }
                ])).flat()
                .sort((a: any, b: any) => a.createdAt.getTime() - b.createdAt.getTime());

            setMessages(history);
            setHasMore(historyData.hasMore || false);
            setTotalPages(historyData.totalPages || 1);
            setCurrentPage(1);
            setHistoryLoaded(true);
        }
    }, [historyData, isOpen, historyLoaded]);

    // Modal kapanınca historyLoaded'u sıfırla
    useEffect(() => {
        if (!isOpen) {
            setHistoryLoaded(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current && !isLoadingMore) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isAiLoading]);

    // Sadece öğrenciler için göster (hook'lardan sonra olmalı!)
    if (!isStudent) return null;

    /**
     * Önceki konuşmaları yükle
     */
    const loadMoreHistory = async () => {
        if (isLoadingMore || !hasMore) return;
        setIsLoadingMore(true);

        try {
            const nextPage = currentPage + 1;
            const response = await api.get(`/coaching/history?page=${nextPage}&limit=5`);
            const data = response.data?.data;

            if (data?.items && data.items.length > 0) {
                const olderMessages = data.items
                    .map((h: any) => ([
                        { id: h.id + '-q', role: 'user' as const, content: h.query, createdAt: new Date(h.createdAt) },
                        { id: h.id + '-r', role: 'assistant' as const, content: h.response, createdAt: new Date(h.createdAt) }
                    ])).flat()
                    .sort((a: any, b: any) => a.createdAt.getTime() - b.createdAt.getTime());

                // Eski mesajları başa ekle
                setMessages(prev => [...olderMessages, ...prev]);
                setCurrentPage(nextPage);
                setHasMore(data.hasMore || false);
            }
        } catch (error) {
            console.error(error);
            toast.error("Önceki mesajlar yüklenemedi.");
        } finally {
            setIsLoadingMore(false);
        }
    };

    const askAi = async (query: string) => {
        if (!query.trim() || isAiLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: query,
            createdAt: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsAiLoading(true);

        try {
            const response = await api.post('/coaching/analyze-progress', { query });
            const responseData = response.data?.data;

            if (!responseData) {
                throw new Error("AI yanıtı alınamadı.");
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseData.analysis,
                createdAt: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);

            // Cache'leri invalidate et (yeni mesaj eklendi, usage değişti)
            queryClient.invalidateQueries({ queryKey: ["coaching", "history"] });
            queryClient.invalidateQueries({ queryKey: ["coaching", "usage"] });
            // AI analizi yapıldıysa analytics cache'ini de yenile (hasAiAnalysis değişmiş olabilir)
            queryClient.invalidateQueries({ queryKey: ["analytics"] });

            if (responseData.cached) {
                toast.info("Bu sınavın analizi daha önce yapılmıştı. Kayıtlı analiz gösteriliyor.");
            } else {
                toast.success("AI Koçun yanıtladı!");
            }
        } catch (error: any) {
            const message = error.response?.data?.message || "AI analizi sırasında bir hata oluştu.";
            toast.error(message);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleSend = () => {
        askAi(inputValue);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-100 group">
                    <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 via-purple-500 to-orange-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                    <Button
                        className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-900 border-none shadow-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300"
                    >
                        <Bot className="w-7 h-7 md:w-8 md:h-8 text-white group-hover:rotate-12 transition-transform" />
                        <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-black w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center border-2 border-white">
                            AI
                        </div>
                        <span className="absolute right-20 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all shadow-xl pointer-events-none translate-x-4 group-hover:translate-x-0 hidden md:block">
                            KoçAi Çevrimiçi ✨
                        </span>
                    </Button>
                </div>
            </DialogTrigger>

            <DialogContent className="max-w-full h-screen md:max-w-[500px] md:h-[650px] flex flex-col p-0 overflow-hidden rounded-none md:rounded-[2.5rem] border-none shadow-2xl bg-white fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:top-auto md:left-auto translate-x-0 translate-y-0">
                {/* Header */}
                <DialogHeader className="p-5 pb-4 bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shrink-0 border-none relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500 rounded-full blur-3xl" />
                    </div>

                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-base font-black tracking-tight">KoçAi Danışman</DialogTitle>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Şu an aktif</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/5">
                                <Zap className="w-3 h-3 text-orange-400 fill-orange-400" />
                                <span className="text-[10px] font-black text-slate-300">{usage.remaining} / {usage.limit} Hak</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="md:hidden w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
                                aria-label="Kapat"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </div>
                </DialogHeader>

                {/* Chat Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-5 space-y-4 bg-linear-to-b from-slate-50/80 to-white"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}
                >
                    {/* Önceki Konuşmaları Yükle Butonu */}
                    {hasMore && messages.length > 0 && (
                        <div className="flex justify-center mb-4">
                            <button
                                onClick={loadMoreHistory}
                                disabled={isLoadingMore}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all active:scale-95 shadow-sm disabled:opacity-50"
                            >
                                {isLoadingMore ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <ChevronUp className="w-3.5 h-3.5" />
                                )}
                                {isLoadingMore ? "Yükleniyor..." : "Önceki Konuşmalar"}
                                {!isLoadingMore && (
                                    <Clock className="w-3 h-3 text-slate-400" />
                                )}
                            </button>
                        </div>
                    )}

                    {messages.length === 0 && !isAiLoading && (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 px-4">
                            <div className="relative">
                                <div className="w-20 h-20 bg-linear-to-br from-indigo-100 to-purple-100 rounded-[2rem] flex items-center justify-center">
                                    <Sparkles className="w-10 h-10 text-indigo-500 animate-pulse" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-linear-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-black text-slate-900 text-base">Selam! Ben senin AI Koçunum.</h4>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[280px]">
                                    Sınav analizi mi istersin yoksa genel koçluk tavsiyesi mi? İstediğini sor!
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 w-full">
                                {PRESET_PROMPTS.map((prompt) => (
                                    <button
                                        key={prompt.id}
                                        onClick={() => askAi(prompt.query)}
                                        className={cn(
                                            "p-4 rounded-2xl border-2 text-left transition-all hover:scale-[1.03] active:scale-95 bg-white shadow-sm flex flex-col gap-2 hover:shadow-md",
                                            prompt.color
                                        )}
                                    >
                                        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center bg-linear-to-br text-white shadow-sm", prompt.gradient)}>
                                            <prompt.icon className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-[11px] leading-tight">{prompt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex w-full",
                                msg.role === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            {msg.role === 'assistant' && (
                                <div className="w-7 h-7 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shrink-0 mr-2 mt-1 shadow-sm shadow-indigo-500/20">
                                    <Bot className="w-3.5 h-3.5" />
                                </div>
                            )}
                            <div
                                className={cn(
                                    "max-w-[85%] rounded-2xl shadow-sm",
                                    msg.role === 'user'
                                        ? "bg-linear-to-br from-slate-800 to-slate-900 text-white rounded-tr-md px-4 py-3"
                                        : "bg-white text-slate-700 border border-slate-100/80 rounded-tl-md px-4 py-3"
                                )}
                            >
                                {msg.role === 'user' ? (
                                    <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                ) : (
                                    <div className="ai-message-content">
                                        <MarkdownMessage content={msg.content} />
                                    </div>
                                )}
                                <div className={cn(
                                    "text-[9px] font-bold mt-2 tracking-wide",
                                    msg.role === 'user' ? "text-slate-400 text-right" : "text-slate-300 text-left"
                                )}>
                                    {msg.createdAt.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isAiLoading && (
                        <div className="flex justify-start">
                            <div className="w-7 h-7 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shrink-0 mr-2 mt-1 shadow-sm">
                                <Bot className="w-3.5 h-3.5" />
                            </div>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-md border border-slate-100 flex items-center gap-3 shadow-sm">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analiz Ediliyor...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                    {messages.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-3 mb-1"
                            style={{ scrollbarWidth: 'none' }}>
                            {PRESET_PROMPTS.map((prompt) => (
                                <button
                                    key={prompt.id}
                                    onClick={() => askAi(prompt.query)}
                                    className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all whitespace-nowrap active:scale-95"
                                >
                                    {prompt.label}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="relative flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Bir şey sor..."
                            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-2xl px-5 pr-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 transition-all placeholder:text-slate-400"
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!inputValue.trim() || isAiLoading}
                            size="icon"
                            className="absolute right-1.5 w-9 h-9 bg-linear-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-40 disabled:shadow-none"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                    <p className="text-[9px] text-center text-slate-300 font-bold uppercase tracking-widest mt-3">
                        Testoloji AI Koçluk Sistemi 2026
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
