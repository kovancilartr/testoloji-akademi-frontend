
"use client";

import { useExam } from "@/hooks/use-exam";
import { useQueryClient } from "@tanstack/react-query";
import { FullPageLoader } from "@/components/ui/custom-ui/FullPageLoader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Trophy,
    XCircle,
    AlertCircle,
    Check,
    X,
    ClipboardList,
    Home,
    RotateCcw
} from "lucide-react";
import { use, useState, useEffect, useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const OPTIONS = ["A", "B", "C", "D", "E"];

export default function ExamPage({ params }: { params: Promise<{ assignmentId: string }> }) {
    const { assignmentId } = use(params);
    const searchParams = useSearchParams();
    const courseId = searchParams.get('courseId');

    const { exam, isLoading, submitExam, isSubmitting } = useExam(assignmentId);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isReviewMode, setIsReviewMode] = useState(false);
    const router = useRouter();
    const queryClient = useQueryClient();

    // Timer Logic
    useEffect(() => {
        if (exam && exam.status !== 'COMPLETED' && exam.duration && exam.duration > 0 && timeLeft === null) {
            setTimeLeft(exam.duration * 60);
        }
    }, [exam, timeLeft]);

    useEffect(() => {
        if (timeLeft === null || isReviewMode) return;
        if (timeLeft <= 0) {
            toast.error("Süre doldu! Sınav otomatik gönderiliyor...");
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => (prev !== null ? prev - 1 : null));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isReviewMode]);

    // Store answers from exam object if completed
    useEffect(() => {
        if (exam?.status === 'COMPLETED' && exam.answers && Object.keys(answers).length === 0) {
            setAnswers(exam.answers);
        }
    }, [exam, answers]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (option: string) => {
        if (isReviewMode || !currentQuestion) return;
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
    };

    const clearAnswer = () => {
        if (isReviewMode || !currentQuestion) return;
        setAnswers(prev => {
            const newAnswers = { ...prev };
            delete newAnswers[currentQuestion.id];
            return newAnswers;
        });
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            await submitExam(answers);
            if (courseId) {
                await queryClient.invalidateQueries({ queryKey: ["my-courses", courseId] });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const questions = useMemo(() => exam?.project?.questions || [], [exam]);
    const currentQuestion = questions[currentIndex];
    const progress = questions.length > 0 ? ((Object.keys(answers).length) / questions.length) * 100 : 0;

    const stats = useMemo(() => {
        if (!exam || exam.status !== 'COMPLETED') return null;
        let correct = 0;
        let wrong = 0;
        const examAnswers = exam.answers || {};

        questions.forEach(q => {
            const studentAnswer = examAnswers[q.id];
            if (studentAnswer) {
                if (studentAnswer === q.correctAnswer) correct++;
                else wrong++;
            }
        });

        const net = correct - (wrong / 4);
        return {
            correct,
            wrong,
            net: parseFloat(net.toFixed(2)),
            total: questions.length
        };
    }, [exam, questions]);

    if (isLoading) return <FullPageLoader message="Sınav yükleniyor..." />;
    if (!exam) return <div className="p-10 text-center font-bold text-slate-500">Sınav bulunamadı.</div>;

    // Redesign: Completion Screen
    if (exam.status === 'COMPLETED' && !isReviewMode) {
        return (
            <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
                <div className="max-w-md w-full space-y-8">
                    <div className="relative mx-auto w-32 h-32">
                        <div className="absolute inset-0 bg-orange-100 rounded-[2.5rem] rotate-6 animate-pulse"></div>
                        <div className="relative z-10 w-32 h-32 bg-orange-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-orange-200">
                            <Trophy className="w-16 h-16 text-white" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Sınav Tamamlandı!</h1>
                        <p className="text-slate-400 font-bold">Harika iş çıkardın, sonuçların hemen burada.</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
                        <div className="space-y-2">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">BAŞARI SKORU</div>
                            <div className="text-7xl font-black text-slate-900 tracking-tighter leading-none">
                                %{exam.grade?.toFixed(0)}
                            </div>
                        </div>

                        {stats && (
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-white p-4 rounded-3xl border border-slate-100 space-y-1">
                                    <div className="flex justify-center"><CheckCircle className="w-4 h-4 text-emerald-500" /></div>
                                    <div className="text-xl font-black text-slate-900">{stats.correct}</div>
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">DOĞRU</div>
                                </div>
                                <div className="bg-white p-4 rounded-3xl border border-slate-100 space-y-1">
                                    <div className="flex justify-center"><XCircle className="w-4 h-4 text-red-500" /></div>
                                    <div className="text-xl font-black text-slate-900">{stats.wrong}</div>
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">YANLIŞ</div>
                                </div>
                                <div className="bg-white p-4 rounded-3xl border border-slate-100 space-y-1">
                                    <div className="flex justify-center"><AlertCircle className="w-4 h-4 text-slate-400" /></div>
                                    <div className="text-xl font-black text-slate-900">{stats.net}</div>
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">NET</div>
                                </div>
                            </div>
                        )}

                        <div className="pt-2">
                            <Badge className={cn(
                                "border-none py-2 px-8 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg",
                                exam.grade && exam.grade >= 70 ? "bg-emerald-500 text-white shadow-emerald-100" : "bg-slate-900 text-white shadow-slate-100"
                            )}>
                                {exam.grade && exam.grade >= 70 ? 'Mükemmel Başarı' : 'Sınav Tamamlandı'}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            onClick={() => setIsReviewMode(true)}
                            variant="outline"
                            className="h-16 rounded-2xl border-2 border-slate-200 font-black text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
                        >
                            <ClipboardList className="w-5 h-5" /> İNCELE
                        </Button>
                        <Button
                            onClick={() => courseId ? router.push(`/dashboard/student/library/${courseId}`) : router.push("/dashboard/student/assignments")}
                            className="h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black transition-all flex items-center gap-2"
                        >
                            <Home className="w-5 h-5" /> {courseId ? "Kursa Dön" : "Ödevlere Dön"}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[200] bg-[#f8fafc] flex flex-col overflow-hidden font-plus-jakarta">
            {/* Redesign: Header */}
            <header className="h-16 md:h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8 shrink-0 relative z-30 shadow-sm">
                <div className="flex items-center gap-3 md:gap-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all"
                        onClick={() => isReviewMode ? setIsReviewMode(false) : router.back()}
                    >
                        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </Button>
                    <div className="hidden sm:block">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-orange-100 text-orange-600 border-none font-black text-[10px] uppercase px-3 py-1 rounded-full">
                                {isReviewMode ? "İnceleme" : "CANLI SINAV"}
                            </Badge>
                            <h1 className="text-sm md:text-lg font-black text-slate-900 tracking-tight line-clamp-1">
                                {exam.project?.name || "Yükleniyor..."}
                            </h1>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                            Soru {currentIndex + 1} / {questions.length}
                        </p>
                    </div>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-6 w-64 lg:w-96 max-w-[30vw]">
                    {!isReviewMode && (
                        <div className="flex-1 space-y-1.5">
                            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span>İlerleme</span>
                                <span>%{progress.toFixed(0)}</span>
                            </div>
                            <Progress value={progress} className="h-1.5 bg-slate-100 [&>div]:bg-orange-500 rounded-full" />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                    {timeLeft !== null && !isReviewMode && (
                        <div className={cn(
                            "h-10 md:h-12 px-3 md:px-6 rounded-xl md:rounded-2xl border-2 flex items-center gap-2 md:gap-3 font-black transition-all",
                            timeLeft < 60 ? "bg-red-50 border-red-500 text-red-600 animate-pulse" : "bg-white border-slate-100 text-slate-900"
                        )}>
                            <Clock className={cn("w-4 h-4 md:w-5 md:h-5", timeLeft < 60 ? "text-red-500" : "text-orange-500")} />
                            <span className="text-sm md:text-xl tabular-nums tracking-tighter">{formatTime(timeLeft)}</span>
                        </div>
                    )}
                    {isReviewMode && (
                        <Button
                            variant="ghost"
                            onClick={() => setIsReviewMode(false)}
                            className="h-10 md:h-12 px-3 md:px-6 rounded-xl md:rounded-2xl border-2 border-slate-100 font-black text-slate-500 hover:text-slate-900 text-xs md:text-sm"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" /> <span className="hidden sm:inline">İNCELEMEYİ BİTİR</span>
                        </Button>
                    )}
                </div>
            </header>

            {/* Redesign: Main Layout */}
            <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
                {/* Left: Question Area */}
                <div className="flex-1 bg-slate-50 p-4 md:p-8 lg:p-12 flex items-center justify-center overflow-auto">
                    {currentQuestion ? (
                        <div className="bg-white shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] p-3 md:p-6 lg:p-8 rounded-[1.5rem] md:rounded-[2.5rem] max-w-5xl w-full border border-slate-100 animate-in zoom-in-95 duration-500">
                            <img
                                src={currentQuestion.imageUrl}
                                alt={`Soru ${currentIndex + 1}`}
                                className="w-full h-auto rounded-xl md:rounded-2xl max-h-[50vh] lg:max-h-[70vh] object-contain mx-auto"
                            />
                        </div>
                    ) : (
                        <div className="text-slate-300 font-black text-xl uppercase tracking-[0.2em]">Soru Hazırlanıyor...</div>
                    )}
                </div>

                {/* Right: Sidebar */}
                <div className="w-full lg:w-[420px] bg-white border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col shrink-0 overflow-hidden shadow-2xl relative z-20">
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
                        <div className="mb-6 lg:mb-8 space-y-1">
                            <div className="flex items-center gap-2 mb-1">
                                <ClipboardList className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                                <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                                    Cevap Anahtarı
                                </h3>
                            </div>
                            <p className="text-xs md:text-sm text-slate-400 font-bold leading-relaxed">
                                Cevaplarınızı işaretleyin
                            </p>
                        </div>

                        {/* Optical Form Style Answer Sheet */}
                        <div className="space-y-2 mb-6">
                            {questions.map((question, idx) => {
                                const questionNumber = idx + 1;
                                const selectedAnswer = answers[question.id];
                                const isCurrentQuestion = currentIndex === idx;
                                const isCorrect = question.correctAnswer === selectedAnswer;
                                const showResult = isReviewMode;

                                return (
                                    <div
                                        key={question.id}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={cn(
                                            "flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer",
                                            isCurrentQuestion ? "bg-orange-50 ring-2 ring-orange-200" : "bg-slate-50 hover:bg-slate-100"
                                        )}
                                    >
                                        {/* Question Number */}
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0",
                                            isCurrentQuestion ? "bg-orange-500 text-white" : "bg-white text-slate-600"
                                        )}>
                                            {questionNumber}
                                        </div>

                                        {/* Answer Bubbles */}
                                        <div className="flex items-center gap-1.5 flex-1">
                                            {OPTIONS.map((option) => {
                                                const isSelected = selectedAnswer === option;
                                                const isThisCorrect = question.correctAnswer === option;

                                                return (
                                                    <button
                                                        key={option}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (!isReviewMode) {
                                                                setAnswers(prev => ({ ...prev, [question.id]: option }));
                                                            }
                                                        }}
                                                        disabled={isReviewMode}
                                                        className={cn(
                                                            "relative w-9 h-9 rounded-full transition-all shrink-0",
                                                            "flex items-center justify-center",
                                                            showResult && isThisCorrect
                                                                ? "bg-emerald-500 ring-2 ring-emerald-300"
                                                                : showResult && isSelected && !isThisCorrect
                                                                    ? "bg-red-500 ring-2 ring-red-300"
                                                                    : isSelected
                                                                        ? "bg-orange-500 ring-2 ring-orange-300"
                                                                        : "bg-white border-2 border-slate-300 hover:border-slate-400"
                                                        )}
                                                    >
                                                        <span className={cn(
                                                            "font-black text-xs",
                                                            isSelected || (showResult && isThisCorrect) ? "text-white" : "text-slate-500"
                                                        )}>
                                                            {option}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Result Indicator */}
                                        {showResult && (
                                            <div className="shrink-0">
                                                {isCorrect ? (
                                                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                                                ) : selectedAnswer ? (
                                                    <XCircle className="w-5 h-5 text-red-500" />
                                                ) : (
                                                    <div className="w-5 h-5" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {isReviewMode && (
                            <div className={cn(
                                "mb-8 p-4 md:p-5 rounded-3xl border flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-4 duration-500",
                                answers[currentQuestion?.id] === currentQuestion?.correctAnswer ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"
                            )}>
                                <div className="flex items-center gap-3">
                                    {answers[currentQuestion?.id] === currentQuestion?.correctAnswer
                                        ? <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0"><Check className="w-5 h-5" /></div>
                                        : <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shrink-0"><X className="w-5 h-5" /></div>
                                    }
                                    <div className="flex-1 min-w-0">
                                        <h4 className={cn("text-base font-black leading-none", answers[currentQuestion?.id] === currentQuestion?.correctAnswer ? "text-emerald-900" : "text-red-900")}>
                                            {answers[currentQuestion?.id] === currentQuestion?.correctAnswer ? "Harika!" : "Gözden Geçir"}
                                        </h4>
                                        <p className={cn("text-[11px] font-bold opacity-70 truncate")}>
                                            {answers[currentQuestion?.id] === currentQuestion?.correctAnswer
                                                ? "Bu soruyu doğru cevapladın."
                                                : answers[currentQuestion?.id] ? "Bu soruda bir hata yaptın." : "Bu soruyu boş bıraktın."}
                                        </p>
                                    </div>
                                </div>
                                <div className="h-px bg-current opacity-10"></div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-black opacity-60 uppercase tracking-widest text-[9px]">DOĞRU SEÇENEK</span>
                                    <span className="text-lg font-black">{currentQuestion?.correctAnswer}</span>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Bottom Actions */}
                    <div className="p-4 md:p-6 border-t border-slate-100 bg-white">
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <Button
                                variant="outline"
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                                className="h-12 md:h-14 rounded-2xl border-2 border-slate-100 font-black text-slate-500 text-xs md:text-sm"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" /> GERİ
                            </Button>
                            <Button
                                onClick={handleNext}
                                disabled={currentIndex === questions.length - 1}
                                className="h-12 md:h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs md:text-sm"
                            >
                                İLERİ <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>

                        {!isReviewMode ? (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full h-14 md:h-16 text-lg md:text-xl font-black shadow-xl shadow-emerald-50 transition-all bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.25rem]"
                            >
                                {isSubmitting ? 'GÖNDERİLİYOR...' : 'SINAVI BİTİR'}
                            </Button>
                        ) : (
                            <Button
                                onClick={() => courseId ? router.push(`/dashboard/student/library/${courseId}`) : router.push("/dashboard/student/assignments")}
                                className="w-full h-14 md:h-16 text-sm md:text-lg font-black bg-slate-900 hover:bg-slate-800 text-white rounded-[1.25rem] flex items-center justify-center gap-2"
                            >
                                <Home className="w-5 h-5" /> {courseId ? "KURSA DÖN" : "ÖDEVLERE DÖN"}
                            </Button>
                        )}
                        {!isReviewMode && (
                            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest pt-3">Sınavı istediğiniz zaman bitirebilirsiniz.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

