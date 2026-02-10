import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Maximize2, Minimize2, Play,
    ArrowLeft, ArrowRight, Trophy, RotateCcw,
    ClipboardList, LayoutGrid, Clock, Info, Layers, Ticket, CheckCircle
} from "lucide-react";
import { VideoPlayer } from "./VideoPlayer";
import { Badge } from "@/components/ui/badge";

interface ActiveContentPlayerProps {
    activeContent: any;
    isCinemaMode: boolean;
    onToggleCinemaMode: () => void;
    onStartExam: () => void;
    onReviewExam?: () => void;
    isStartingTest: boolean;
    onNext: () => void;
    onPrev: () => void;
    onComplete: (contentId: string) => void;
    onUndoComplete: (contentId: string) => void;
    isCompleting: boolean;
    hasPrev: boolean;
    hasNext: boolean;
    isCompleted: boolean;
    courseFinished: boolean; // stats.percent === 100
}

export function ActiveContentPlayer({
    activeContent,
    isCinemaMode,
    onToggleCinemaMode,
    onStartExam,
    onReviewExam,
    isStartingTest,
    onNext,
    onPrev,
    onComplete,
    onUndoComplete,
    isCompleting,
    hasPrev,
    hasNext,
    isCompleted,
    courseFinished
}: ActiveContentPlayerProps) {
    // Helper vars
    const attemptLimit = activeContent?.attemptLimit || 0;
    const attemptCount = activeContent?.assignment?.attemptCount || 0;
    const hasAttemptsLeft = attemptLimit === 0 || attemptCount < attemptLimit;
    const isExamCompleted = activeContent?.assignment?.status === 'COMPLETED';

    return (
        <main className="flex-1 flex flex-col min-w-0 h-full bg-[#f1f5f9] relative">

            {/* Size Toggle (Cinema vs Card) */}
            <div className="absolute top-4 right-4 z-[100] hidden md:flex items-center gap-2">
                <Button
                    variant="secondary"
                    size="sm"
                    className={cn(
                        "h-10 px-4 rounded-xl font-black text-[10px] cursor-pointer uppercase tracking-widest shadow-lg transition-all border border-slate-200",
                        isCinemaMode ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 hover:bg-slate-50"
                    )}
                    onClick={onToggleCinemaMode}
                >
                    {isCinemaMode ? <><Minimize2 className="w-4 h-4 mr-2" /> ODAK MODUNDAN ÇIK</> : <><Maximize2 className="w-4 h-4 mr-2" /> ODAK MODU (TAM)</>}
                </Button>
            </div>

            <div className={cn(
                "flex-1 flex flex-col relative transition-all duration-700 ease-in-out",
                isCinemaMode || activeContent?.type === 'TEST' ? "p-0" : "p-3 md:p-8 lg:p-12",
                isCinemaMode ? "bg-black overflow-hidden" : "overflow-y-auto"
            )}>
                <div className={cn(
                    "mx-auto w-full transition-all duration-700 ease-in-out flex flex-col",
                    isCinemaMode || activeContent?.type === 'TEST' ? "h-full max-w-none gap-0" : "max-w-6xl gap-8"
                )}>
                    {!activeContent ? (
                        <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-6 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl animate-in fade-in duration-1000">
                            <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-slate-200">
                                <Play className="w-12 h-12" />
                            </div>
                            <div className="text-center space-y-1">
                                <h4 className="text-slate-900 font-black text-lg uppercase tracking-widest">BİR DERS SEÇİN</h4>
                                <p className="text-slate-400 font-bold text-sm">Eğitime başlamak için müfredatı kullanabilirsin.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Main Content Card */}
                            <div className={cn(
                                "w-full transition-all duration-700 overflow-hidden flex flex-col",
                                isCinemaMode || activeContent.type === 'TEST'
                                    ? "h-full rounded-none border-none shadow-none"
                                    : "rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border border-slate-200 bg-white"
                            )}>
                                {/* Player Area */}
                                <div
                                    className={cn(
                                        "w-full relative overflow-hidden flex items-center justify-center",
                                        isCinemaMode || activeContent.type === 'TEST' ? "h-full flex-1" : "bg-black"
                                    )}
                                    style={(!isCinemaMode && activeContent.type === 'VIDEO') ? { aspectRatio: '21/10' } : {}}
                                >
                                    {activeContent.type === 'VIDEO' && activeContent.url && (
                                        <VideoPlayer
                                            url={activeContent.url}
                                            isCompleted={isCompleted}
                                        />
                                    )}

                                    {activeContent.type === 'TEST' && (
                                        <div className="w-full h-full flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-slate-50 via-white to-orange-50/30 overflow-y-auto">
                                            <div className="max-w-4xl w-full text-center space-y-6 md:space-y-8 animate-in zoom-in-95 duration-700 py-4">
                                                <div className="relative space-y-6 md:space-y-8">
                                                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/5 to-orange-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-500/5 to-emerald-500/5 rounded-full -ml-24 -mb-24 blur-3xl"></div>

                                                    <div className="relative z-10 space-y-6 md:space-y-8">
                                                        <div className="flex justify-center">
                                                            <div className="relative">
                                                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-2xl shadow-emerald-200 relative z-10 animate-in zoom-in duration-500">
                                                                    <ClipboardList className="w-10 h-10 md:w-12 md:h-12" />
                                                                </div>
                                                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-[2rem] rotate-6 blur-xl opacity-40 animate-pulse"></div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3 md:space-y-4">
                                                            <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                                                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                                                <span className="text-emerald-700 font-black text-xs uppercase tracking-wider">Akademik Değerlendirme</span>
                                                            </div>
                                                            <h4 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight tracking-tight px-4">
                                                                {activeContent.title}
                                                            </h4>
                                                            <p className="text-slate-500 font-semibold text-sm md:text-base max-w-md mx-auto leading-relaxed">
                                                                Hazır olduğunuzda başlayın.
                                                            </p>
                                                        </div>

                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                                                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-100 shadow-lg">
                                                                <div className="flex items-center justify-center gap-2 mb-2">
                                                                    <LayoutGrid className="w-4 h-4 text-emerald-600" />
                                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sorular</span>
                                                                </div>
                                                                <div className="text-xl md:text-2xl font-black text-slate-900">Karma</div>
                                                            </div>
                                                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-100 shadow-lg">
                                                                <div className="flex items-center justify-center gap-2 mb-2">
                                                                    <Clock className="w-4 h-4 text-emerald-600" />
                                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Süre</span>
                                                                </div>
                                                                <div className="text-xl md:text-2xl font-black text-slate-900">
                                                                    {activeContent.duration && activeContent.duration > 0 ? `${activeContent.duration} Dk.` : 'Sınırsız'}
                                                                </div>
                                                            </div>
                                                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-100 shadow-lg col-span-2 md:col-span-1">
                                                                <div className="flex items-center justify-center gap-2 mb-2">
                                                                    <Ticket className="w-4 h-4 text-emerald-600" />
                                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Giriş Hakkı</span>
                                                                </div>
                                                                <div className="text-xl md:text-2xl font-black text-slate-900">
                                                                    {attemptLimit > 0
                                                                        ? `${Math.max(0, attemptLimit - attemptCount)} / ${attemptLimit} Hak`
                                                                        : 'Sınırsız'}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3 pt-2">
                                                            {isExamCompleted ? (
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                    <Button
                                                                        variant="outline"
                                                                        className="h-14 md:h-16 rounded-2xl border-2 border-slate-200 text-slate-600 font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                                                                        onClick={onReviewExam}
                                                                    >
                                                                        <ClipboardList className="w-5 h-5" />
                                                                        <span>SONUÇLARI İNCELE</span>
                                                                    </Button>

                                                                    <Button
                                                                        className={cn(
                                                                            "h-14 md:h-16 rounded-2xl font-black text-white transition-all flex items-center justify-center gap-3 shadow-xl",
                                                                            hasAttemptsLeft
                                                                                ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:scale-[1.02]"
                                                                                : "bg-slate-300 cursor-not-allowed"
                                                                        )}
                                                                        onClick={onStartExam}
                                                                        disabled={isStartingTest || !hasAttemptsLeft}
                                                                    >
                                                                        {isStartingTest ? (
                                                                            <>
                                                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                                                <span>Hazırlanıyor...</span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <RotateCcw className="w-5 h-5" />
                                                                                <span>{hasAttemptsLeft ? "TEKRAR ÇÖZ" : "HAKKINIZ BİTTİ"}</span>
                                                                            </>
                                                                        )}
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <Button
                                                                    className="w-full h-14 md:h-16 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black text-base md:text-lg hover:scale-[1.02] active:scale-95 shadow-2xl shadow-emerald-200/50 transition-all flex items-center justify-center gap-3 group"
                                                                    onClick={onStartExam}
                                                                    disabled={isStartingTest}
                                                                >
                                                                    {isStartingTest ? (
                                                                        <>
                                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                                            <span>Sınav Hazırlanıyor...</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                                            <span>SINAVI ŞİMDİ BAŞLAT</span>
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            )}
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                                                <Info className="w-3 h-3" />
                                                                Sınav yeni bir pencerede açılacaktır
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeContent.type === 'PDF' && (
                                        <div className="w-full h-full flex flex-col bg-slate-800 relative group/pdf">
                                            {activeContent.url ? (
                                                <>
                                                    <iframe
                                                        src={`${activeContent.url}#toolbar=0&navpanes=0&scrollbar=0`}
                                                        className="w-full h-full border-none bg-slate-900"
                                                        title={activeContent.title}
                                                    />
                                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover/pdf:opacity-100 transition-opacity duration-300 pointer-events-none">
                                                        <div className="bg-slate-900/80 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 flex items-center gap-4 pointer-events-auto shadow-2xl">
                                                            <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                                                                <Layers className="w-4 h-4 text-orange-500" />
                                                                <span className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">{activeContent.title}</span>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 text-[9px] font-black text-slate-300 hover:text-white uppercase tracking-tighter"
                                                                onClick={() => window.open(activeContent.url, '_blank')}
                                                            >
                                                                TAM EKRAN AÇ
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 text-[9px] font-black text-slate-300 hover:text-white uppercase tracking-tighter bg-white/5"
                                                                onClick={async () => {
                                                                    const response = await fetch(activeContent.url);
                                                                    const blob = await response.blob();
                                                                    const url = window.URL.createObjectURL(blob);
                                                                    const a = document.createElement('a');
                                                                    a.href = url;
                                                                    a.download = `${activeContent.title}.pdf`;
                                                                    a.click();
                                                                }}
                                                            >
                                                                İNDİR
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-white space-y-6">
                                                    <Info className="w-16 h-16 text-slate-600" />
                                                    <div className="space-y-2">
                                                        <h3 className="text-xl font-black">Döküman Bulunamadı</h3>
                                                        <p className="text-slate-400 text-sm font-bold">Bu derse ait döküman linki hatalı veya eksik.</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Action Bar - Always placed below content in non-cinema mode */}
                                {!isCinemaMode && activeContent.type !== 'TEST' && (
                                    <div className="h-20 bg-white border-t border-slate-100 flex items-center justify-between px-6 md:px-10 gap-x-4">
                                        <Button
                                            variant="ghost"
                                            className="text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest gap-2 flex-1 md:flex-none justify-start px-2 h-12 rounded-xl"
                                            onClick={onPrev}
                                            disabled={!hasPrev}
                                        >
                                            <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Önceki Ders</span>
                                        </Button>

                                        <div className="flex-1 flex justify-center">
                                            {!isCompleted ? (
                                                <Button
                                                    className="bg-orange-500 hover:bg-orange-600 text-white font-black h-12 px-6 md:px-10 rounded-xl md:rounded-2xl shadow-lg shadow-orange-100 transition-all active:scale-95 flex items-center gap-2 md:gap-3 text-xs md:text-sm whitespace-nowrap group"
                                                    onClick={() => onComplete(activeContent.id)}
                                                    disabled={isCompleting}
                                                >
                                                    {isCompleting ? (
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    ) : <CheckCircle className="w-4 h-4 transition-transform group-hover:scale-110" />}
                                                    BİTİRDİM
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    className="h-12 px-6 md:px-10 rounded-xl md:rounded-2xl border-2 border-emerald-500 text-emerald-600 font-black shadow-lg shadow-emerald-50 transition-all hover:bg-emerald-50 flex items-center gap-2 md:gap-3 text-xs md:text-sm whitespace-nowrap group"
                                                    onClick={() => onUndoComplete(activeContent.id)}
                                                    disabled={isCompleting}
                                                >
                                                    {isCompleting ? (
                                                        <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                                                    ) : <RotateCcw className="w-4 h-4 transition-transform group-hover:rotate-[-45deg]" />}
                                                    TAMAMLANDI
                                                </Button>
                                            )}
                                        </div>

                                        <Button
                                            variant="ghost"
                                            className="text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest gap-2 flex-1 md:flex-none justify-end px-2 h-12 rounded-xl"
                                            onClick={onNext}
                                            disabled={!hasNext}
                                        >
                                            <span className="hidden sm:inline">Sıradaki Ders</span> <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Content Brief (Footer Info) - Outside the main content card */}
                            {!isCinemaMode && activeContent.type !== 'TEST' && (
                                <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000">
                                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 bg-white/60 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/40 shadow-xl text-center md:text-left">
                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                                            <Info className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-lg md:text-xl font-black text-slate-900 leading-none">{activeContent.title}</h3>
                                            <p className="text-slate-500 font-medium text-xs md:text-sm leading-relaxed max-w-3xl">
                                                Şuan izlediğiniz/incelediğiniz bu bölüm eğitimin kritik bir parçasıdır.
                                                Lütfen içeriği tamamladıktan sonra "BİTİRDİM" butonuna basarak ilerlemeni kaydetmeyi unutma.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
