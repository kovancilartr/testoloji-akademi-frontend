"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    Maximize2, Minimize2, Play, Video,
    ClipboardList, LayoutGrid, Clock, Info, Layers,
    ArrowLeft, ArrowRight, CheckCircle, Trophy, Ticket, RotateCcw
} from "lucide-react";

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
            <div className="absolute top-4 right-4 z-40 hidden md:flex items-center gap-2">
                <Button
                    variant="secondary"
                    size="sm"
                    className={cn(
                        "h-10 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all border border-slate-200",
                        isCinemaMode ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 hover:bg-slate-50"
                    )}
                    onClick={onToggleCinemaMode}
                >
                    {isCinemaMode ? <><Minimize2 className="w-4 h-4 mr-2" /> ODAK MODUNDAN ÇIK</> : <><Maximize2 className="w-4 h-4 mr-2" /> ODAK MODU (TAM)</>}
                </Button>
            </div>

            <div className={cn(
                "flex-1 flex flex-col relative transition-all duration-700 ease-in-out overflow-hidden",
                isCinemaMode ? "p-0 bg-black" : activeContent?.type === 'TEST' ? "p-0" : "p-3 md:p-8 lg:p-12"
            )}>
                <div className={cn(
                    "mx-auto w-full transition-all duration-700 ease-in-out overflow-hidden flex flex-col",
                    isCinemaMode
                        ? "h-full max-w-none rounded-none border-none shadow-none"
                        : activeContent?.type === 'TEST'
                            ? "h-full max-w-none rounded-none border-none shadow-none"
                            : "max-w-6xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border border-slate-200 bg-white"
                )}
                    style={!isCinemaMode && activeContent?.type !== 'TEST' ? { aspectRatio: '21/10' } : {}}>
                    {!activeContent ? (
                        <div className="w-full h-full flex flex-col items-center justify-center space-y-6 bg-white animate-in fade-in duration-1000">
                            <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-slate-200">
                                <Play className="w-12 h-12" />
                            </div>
                            <div className="text-center space-y-1">
                                <h4 className="text-slate-900 font-black text-lg uppercase tracking-widest">BİR DERS SEÇİN</h4>
                                <p className="text-slate-400 font-bold text-sm">Eğitime başlamak için müfredatı kullanabilirsin.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col relative">
                            <div className="flex-1 relative bg-black overflow-hidden group">
                                {activeContent.type === 'VIDEO' && activeContent.url && (
                                    <div className="w-full h-full flex items-center justify-center bg-black">
                                        {activeContent.url.includes('youtube.com') || activeContent.url.includes('youtu.be') ? (
                                            <iframe
                                                src={activeContent.url.replace('watch?v=', 'embed/').split('&')[0] + "?autoplay=1&rel=0&modestbranding=1&color=white&vq=hd1080"}
                                                className="w-full h-full absolute inset-0 border-none shadow-2xl"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center gap-6 p-12 text-center bg-slate-900">
                                                <Video className="w-16 h-16 text-orange-500 animate-pulse" />
                                                <div className="space-y-4">
                                                    <h3 className="text-2xl font-black text-white">Harici Kaynak Hazır</h3>
                                                    <Button
                                                        className="h-14 px-10 rounded-2xl bg-white text-black font-black shadow-xl hover:scale-105 active:scale-95 transition-all"
                                                        onClick={() => window.open(activeContent.url, '_blank')}
                                                    >
                                                        ŞİMDİ İZLE
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeContent.type === 'TEST' && (
                                    <div className="w-full h-full flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-slate-50 via-white to-orange-50/30 overflow-y-auto">
                                        <div className="max-w-4xl w-full text-center space-y-6 md:space-y-8 animate-in zoom-in-95 duration-700 py-4">
                                            {/* Main Content - No Frame */}
                                            <div className="relative space-y-6 md:space-y-8">
                                                {/* Decorative Background Elements */}
                                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/5 to-orange-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-500/5 to-emerald-500/5 rounded-full -ml-24 -mb-24 blur-3xl"></div>

                                                <div className="relative z-10 space-y-6 md:space-y-8">
                                                    {/* Icon */}
                                                    <div className="flex justify-center">
                                                        <div className="relative">
                                                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-2xl shadow-emerald-200 relative z-10 animate-in zoom-in duration-500">
                                                                <ClipboardList className="w-10 h-10 md:w-12 md:h-12" />
                                                            </div>
                                                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-[2rem] rotate-6 blur-xl opacity-40 animate-pulse"></div>
                                                        </div>
                                                    </div>

                                                    {/* Title & Description */}
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

                                                    {/* Stats */}
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                                                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-100 shadow-lg hover:shadow-xl transition-all">
                                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                                <LayoutGrid className="w-4 h-4 text-emerald-600" />
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sorular</span>
                                                            </div>
                                                            <div className="text-xl md:text-2xl font-black text-slate-900">Karma</div>
                                                        </div>
                                                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-100 shadow-lg hover:shadow-xl transition-all">
                                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                                <Clock className="w-4 h-4 text-emerald-600" />
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Süre</span>
                                                            </div>
                                                            <div className="text-xl md:text-2xl font-black text-slate-900">
                                                                {activeContent.duration && activeContent.duration > 0 ? `${activeContent.duration} Dk.` : 'Sınırsız'}
                                                            </div>
                                                        </div>
                                                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-100 shadow-lg hover:shadow-xl transition-all col-span-2 md:col-span-1">
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

                                                    {/* Start Button */}
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
                                    <div className="w-full h-full flex items-center justify-center p-6 md:p-12 bg-slate-50">
                                        <div className="max-w-md w-full p-10 md:p-14 rounded-[3.5rem] bg-white text-center space-y-10 shadow-2xl border border-slate-100">
                                            <div className="w-24 h-24 rounded-[2.5rem] bg-orange-500 text-white flex items-center justify-center mx-auto shadow-2xl shadow-orange-100 rotate-[8deg]">
                                                <Layers className="w-10 h-10" />
                                            </div>
                                            <div className="space-y-4">
                                                <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[10px] uppercase px-4 py-1.5 rounded-full">Döküman & PDF</Badge>
                                                <h4 className="text-3xl font-black text-slate-900 leading-none tracking-tight">{activeContent.title}</h4>
                                                <p className="text-slate-400 font-bold">Bu derse ait çalışma notlarını görüntüleyebilirsin.</p>
                                            </div>
                                            <Button
                                                className="w-full h-18 rounded-2xl bg-slate-900 text-white font-black text-lg hover:bg-slate-800 transition-all shadow-xl"
                                                onClick={() => window.open(activeContent.url, '_blank')}
                                            >
                                                DÖKÜMANI AÇ
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Bar (Below Content) - Hide for TEST */}
                            {activeContent?.type !== 'TEST' && (
                                <div className="h-16 md:h-20 shrink-0 bg-white border-t border-slate-100 flex items-center justify-between px-4 md:px-10 gap-2">
                                    <Button
                                        variant="ghost"
                                        className="text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest gap-2 flex-1 md:flex-none justify-start px-2"
                                        onClick={onPrev}
                                        disabled={!hasPrev}
                                    >
                                        <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Önceki Ders</span>
                                    </Button>

                                    <div className="flex-[2] flex justify-center">
                                        {!isCompleted ? (
                                            <Button
                                                className="bg-orange-500 hover:bg-orange-600 text-white font-black h-10 md:h-12 px-4 md:px-10 rounded-xl md:rounded-2xl shadow-lg shadow-orange-100 transition-all active:scale-95 flex items-center gap-2 md:gap-3 text-xs md:text-sm whitespace-nowrap"
                                                onClick={() => onComplete(activeContent.id)}
                                                disabled={isCompleting}
                                            >
                                                <span className="hidden xs:inline">BU DERSİ</span> BİTİRDİM <ArrowRight className="w-4 h-4 hidden sm:inline" />
                                            </Button>
                                        ) : courseFinished ? (
                                            <div className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                                                <Trophy className="w-4 h-4" />
                                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">KURS BİTTİ</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 md:gap-3 px-4 md:px-8 py-2 md:py-3 rounded-full bg-slate-900 text-white shadow-lg">
                                                <CheckCircle className="w-4 h-4 text-orange-500" />
                                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">TAMAMLANDI</span>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        variant="ghost"
                                        className="text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest gap-2 flex-1 md:flex-none justify-end px-2"
                                        onClick={onNext}
                                        disabled={!hasNext}
                                    >
                                        <span className="hidden sm:inline">Sıradaki Ders</span> <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Brief (Footer Info) - Hide for TEST and Cinema Mode */}
            {!isCinemaMode && activeContent && activeContent.type !== 'TEST' && (
                <div className="px-4 md:px-12 pb-12 animate-in fade-in duration-700">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 bg-white/50 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200/50 text-center md:text-left">
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
        </main>
    );
}
