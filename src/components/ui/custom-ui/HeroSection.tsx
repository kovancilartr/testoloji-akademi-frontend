"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, CheckCircle2, PlayCircle, Users, GraduationCap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../button";
import { cn } from "@/lib/utils";

const HeroSection = () => {
    const [activeTab, setActiveTab] = useState<"teacher" | "student">("teacher");
    const [isAnimating, setIsAnimating] = useState(false);

    const handleTabChange = (tab: "teacher" | "student") => {
        if (tab === activeTab) return;
        setIsAnimating(true);
        setTimeout(() => {
            setActiveTab(tab);
            setIsAnimating(false);
        }, 300);
    };

    const content = {
        teacher: {
            badge: "EĞİTMENLER İÇİN",
            title: "Dijital Sınıfınızı Yönetin, Geleceği Şekillendirin",
            description: "Soru bankası oluşturun, interaktif testler hazırlayın ve yapay zeka destekli analizlerle öğrencilerinizin başarısını artırın.",
            cta: "Hemen Başla",
            secondaryCta: "Örnek İncele",
            image: "/images/hero-teacher-v2.png",
            features: ["Soru Bankası & PDF", "Öğrenci Analizi", "Online Koçluk"],
            color: "text-brand-600",
            bg: "bg-brand-50",
            border: "border-brand-200",
            gradient: "from-brand-600 to-red-600"
        },
        student: {
            badge: "ÖĞRENCİLER İÇİN",
            title: "Hedeflerine Ulaşmanın En Akıllı Yolu",
            description: "Kişiselleştirilmiş çalışma programları, video dersler ve performans takibi ile eksiklerini gör, potansiyelini keşfet.",
            cta: "Ücretsiz Dene",
            secondaryCta: "Nasıl Çalışır?",
            image: "/images/student-bg.png",
            features: ["Video Dersler", "Akıllı Program", "Detaylı Karne"],
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-200",
            gradient: "from-blue-600 to-indigo-600"
        }
    };

    const currentContent = content[activeTab];

    return (
        <section className="relative pt-28 pb-4 lg:pt-24 lg:pb-0 shadow shadow-gray-100 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 opacity-30 pointer-events-none">
                <div className={cn("absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl transition-colors duration-1000", activeTab === "teacher" ? "bg-brand-100" : "bg-blue-100")} />
                <div className={cn("absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl transition-colors duration-1000", activeTab === "teacher" ? "bg-orange-50" : "bg-indigo-50")} />
            </div>

            <div className="container mx-auto px-6">
                {/* Toggle Switch */}
                <div className="flex justify-center mb-16">
                    <div className="p-1.5 bg-gray-100/80 backdrop-blur-sm rounded-full border border-gray-200 inline-flex shadow-inner">
                        <button
                            onClick={() => handleTabChange("teacher")}
                            className={cn(
                                "px-8 py-3 rounded-full text-sm font-black transition-all duration-300 flex items-center gap-2",
                                activeTab === "teacher"
                                    ? "bg-white text-brand-600 shadow-lg shadow-brand-500/10 scale-105"
                                    : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            <Users className="w-4 h-4" />
                            EĞİTMEN
                        </button>
                        <button
                            onClick={() => handleTabChange("student")}
                            className={cn(
                                "px-8 py-3 rounded-full text-sm font-black transition-all duration-300 flex items-center gap-2",
                                activeTab === "student"
                                    ? "bg-white text-blue-600 shadow-lg shadow-blue-500/10 scale-105"
                                    : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            <GraduationCap className="w-4 h-4" />
                            ÖĞRENCİ
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    {/* Text Content */}
                    <div className={cn("w-full lg:w-1/2 space-y-8 transition-all duration-500", isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0")}>
                        <div className={cn("inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest uppercase transition-colors duration-300", currentContent.bg, currentContent.color, currentContent.border)}>
                            <Sparkles className="w-3.5 h-3.5" />
                            {currentContent.badge}
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-gray-900 leading-[1.1]">
                            {activeTab === "teacher" ? (
                                <>
                                    Sınıfınızı <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-red-600">Dijitalleştirin</span>
                                </>
                            ) : (
                                <>
                                    Potansiyelini <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Keşfet</span>
                                </>
                            )}
                            <br />
                            <span className="text-gray-900">Yönetimi Ele Alın.</span>
                        </h1>

                        <p className="text-xl text-gray-500 leading-relaxed font-medium max-w-lg">
                            {currentContent.description}
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {currentContent.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm text-sm font-bold text-gray-700">
                                    <CheckCircle2 className={cn("w-4 h-4", currentContent.color)} />
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/auth/register">
                                <Button size="lg" className={cn("h-14 px-8 text-base font-black text-white rounded-2xl shadow-xl transition-all hover:scale-105 bg-gradient-to-r", currentContent.gradient)}>
                                    {currentContent.cta}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Button variant="outline" size="lg" className="h-14 px-8 text-base font-bold rounded-2xl border-2 hover:bg-gray-50">
                                <PlayCircle className="mr-2 h-5 w-5 text-gray-900" />
                                {currentContent.secondaryCta}
                            </Button>
                        </div>
                    </div>

                    {/* Image/Visual Content */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className={cn("absolute inset-0 bg-gradient-to-tr opacity-20 blur-[100px] -z-10 transition-colors duration-1000", activeTab === "teacher" ? "from-brand-500 to-orange-500" : "from-blue-500 to-indigo-500")} />

                        <div className={cn("relative rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] border-white transition-all duration-700 transform", isAnimating ? "scale-95 opacity-50 rotate-1" : "scale-100 opacity-100 rotate-0")}>
                            <div className="aspect-[4/3] relative">
                                <Image
                                    src={currentContent.image}
                                    alt="Hero Image"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                {/* Overlay Gradient */}
                                <div className={cn("absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60")} />

                                {/* Floating Badge */}
                                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-white/50 shadow-lg flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br", currentContent.gradient)}>
                                            {activeTab === "teacher" ? <Users className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Toplam Kullanıcı</div>
                                            <div className="text-sm font-black text-gray-900">+1.000 Aktif Üye</div>
                                        </div>
                                    </div>
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Marquee Features */}
                <div className="mt-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-10 pointer-events-none" />
                    <div className="flex gap-8 animate-marquee whitespace-nowrap py-4">
                        {[
                            "🚀 Yeni Nesil Eğitim",
                            "📚 Dijital Kütüphane",
                            "🧠 Yapay Zeka Koçluk",
                            "📊 Performans Analizi",
                            "🎓 Online Sertifika",
                            "📱 Mobil Uyumlu",
                            "🔒 Güvenli Altyapı",
                            "🚀 Hızlı Erişim"
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-gray-100 text-gray-600 font-bold text-xs uppercase tracking-widest shadow-sm"
                            >
                                <Sparkles className="w-3 h-3 text-brand-400" />
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default HeroSection;