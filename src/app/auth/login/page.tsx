"use client";

import { Mail, Lock, Loader2, Sparkles, GraduationCap, BookOpen, Users, BarChart2, Video, BrainCircuit, FileText, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { ApiResponse, AuthResponse } from "@/types/auth";
import { FullPageLoader } from "@/components/ui/custom-ui/FullPageLoader";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
    email: z.string().email("Geçerli bir email adresi giriniz"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const slides = [
    {
        id: "teacher",
        title: "Eğitmenler İçin",
        headline: "Dijital Okulunuzu Kurun",
        description: "Testler hazırlayın, PDF kitaplar oluşturun ve öğrencilerinizi yapay zeka destekli koçluk sistemiyle takip edin.",
        features: [
            { icon: FileText, text: "Soru Bankası & PDF Oluşturma" },
            { icon: Users, text: "Öğrenci Takibi & Analiz" },
            { icon: BrainCircuit, text: "Yapay Zeka Destekli Koçluk" },
        ],
        image: "/images/teacher-bg.png",
        color: "from-orange-900/80 to-red-900/80",
        iconColor: "text-orange-400",
        badge: "EĞİTMEN MODU"
    },
    {
        id: "student",
        title: "Öğrenciler İçin",
        headline: "Hedeflerine Adım Adım Ulaş",
        description: "Kişiselleştirilmiş çalışma programları, video dersler ve detaylı analizlerle eksiklerini gör, başarıya odaklan.",
        features: [
            { icon: BrainCircuit, text: "Online Koçluk & Planlama" },
            { icon: Video, text: "Video Dersler & Kurslar" },
            { icon: BarChart2, text: "Detaylı Gelişim Raporları" },
        ],
        image: "/images/student-bg.png",
        color: "from-blue-900/80 to-indigo-900/80",
        iconColor: "text-blue-400",
        badge: "ÖĞRENCİ MODU"
    }
];

export default function LoginPage() {
    const { login, isAuthenticated, isLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, isLoading, router]);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema)
    });

    const quickLogin = (email: string, pass: string) => {
        setValue("email", email);
        setValue("password", pass);
    };

    const onSubmit = async (data: LoginFormValues) => {
        setLoading(true);
        try {
            const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);

            if (response.data.success) {
                toast.success("Giriş başarılı! Yönlendiriliyorsunuz...");
                login(response.data.data);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Giriş yapılırken bir hata oluştu. Lütfen bilgilerinizi kontrol edin.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading || isAuthenticated) {
        return <FullPageLoader />;
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-white">
            {/* Left Side: Dynamic Slider */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900 items-center justify-center">
                {/* Slides Fade Transition */}
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={cn(
                            "absolute inset-0 transition-opacity duration-1000 ease-in-out z-10",
                            currentSlideIndex === index ? "opacity-100" : "opacity-0 pointer-events-none"
                        )}
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0 z-0">
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                className="object-cover scale-105 transition-transform duration-[10s] ease-linear"
                                style={{
                                    transform: currentSlideIndex === index ? "scale(1.1)" : "scale(1.0)"
                                }}
                                priority
                            />
                        </div>

                        {/* Gradient Overlay */}
                        <div className={cn("absolute inset-0 bg-gradient-to-br mix-blend-multiply z-10", slide.color)} />

                        {/* Content */}
                        <div className="relative z-20 h-full flex flex-col justify-between p-12 text-white">
                            <Link href="/" className="flex items-center gap-2 w-fit">
                                <div className="relative w-10 h-10 bg-white/10 rounded-xl p-1 backdrop-blur-sm border border-white/20">
                                    <Image
                                        src="/images/logo2.png"
                                        alt="Testoloji Logo"
                                        fill
                                        className="object-contain p-1"
                                    />
                                </div>
                                <span className="text-2xl font-black tracking-tighter uppercase drop-shadow-md">Testoloji</span>
                            </Link>

                            <div className="space-y-8 max-w-xl mx-auto">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-widest uppercase">
                                    <Sparkles className={cn("w-3.5 h-3.5", slide.iconColor)} />
                                    {slide.badge}
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-xl font-medium text-white/80">{slide.title}</h2>
                                    <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
                                        {slide.headline}
                                    </h1>
                                    <p className="text-lg text-white/90 leading-relaxed font-medium">
                                        {slide.description}
                                    </p>
                                </div>

                                <div className="space-y-4 pt-4">
                                    {slide.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors">
                                            <div className="shrink-0 p-2 bg-white/20 rounded-lg">
                                                <feature.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="font-bold text-sm tracking-wide">{feature.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <div className="flex gap-2">
                                    {slides.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentSlideIndex(idx)}
                                            className={cn(
                                                "h-1.5 rounded-full transition-all duration-300",
                                                currentSlideIndex === idx ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                                            )}
                                        />
                                    ))}
                                </div>
                                <div className="text-xs text-white/50 font-medium">
                                    © 2026 Testoloji Akademi.
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
                {/* Mobile Logo */}
                <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 lg:hidden">
                    <div className="relative w-8 h-8">
                        <Image
                            src="/images/logo2.png"
                            alt="Testoloji Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-xl font-bold tracking-tighter uppercase">Testoloji</span>
                </Link>

                <div className="w-full max-w-md space-y-10">
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black tracking-tight text-gray-900">Tekrar Hoş Geldiniz!</h2>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Lütfen hesabınıza giriş yapmak için bilgilerinizi girin.
                        </p>

                        {/* Quick Login Section */}
                        {process.env.NEXT_PUBLIC_IS_DEVELOPMENT === 'true' && (
                            <div className="pt-2 flex flex-wrap gap-2">
                                <button
                                    onClick={() => quickLogin("admin@mail.com", "123456")}
                                    type="button"
                                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-100 transition-colors"
                                >
                                    ADMIN
                                </button>
                                <button
                                    onClick={() => quickLogin("teacher@mail.com", "123456")}
                                    type="button"
                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100 hover:bg-blue-100 transition-colors"
                                >
                                    ÖĞRETMEN
                                </button>
                                <button
                                    onClick={() => quickLogin("sercan@mail.com", "Ko1blackno.")}
                                    type="button"
                                    className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-orange-100 hover:bg-orange-100 transition-colors"
                                >
                                    SERCAN
                                </button>
                                <button
                                    onClick={() => quickLogin("soner@mail.com", "123456")}
                                    type="button"
                                    className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-orange-100 hover:bg-orange-100 transition-colors"
                                >
                                    SONER
                                </button>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                                    E-Posta Adresi
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="eposta@adresiniz.com"
                                        className={`w-full pl-11 pr-4 py-3 bg-gray-50 border-2 rounded-2xl outline-none transition-all duration-200 ${errors.email ? 'border-red-100 bg-red-50 focus:border-red-400' : 'border-transparent focus:border-brand-500 focus:bg-white focus:shadow-xl focus:shadow-brand-500/5'}`}
                                        {...register("email")}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-[11px] font-bold text-red-500 ml-1 flex items-center gap-1">
                                        <span className="w-1 h-1 bg-red-500 rounded-full" /> {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">
                                        Şifre
                                    </label>
                                    <Link href="/auth/forgot-password">
                                        <button type="button" className="text-[11px] font-bold text-brand-600 hover:text-brand-700 transition-colors">
                                            Şifremi Unuttum?
                                        </button>
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className={`w-full pl-11 pr-4 py-3 bg-gray-50 border-2 rounded-2xl outline-none transition-all duration-200 ${errors.password ? 'border-red-100 bg-red-50 focus:border-red-400' : 'border-transparent focus:border-brand-500 focus:bg-white focus:shadow-xl focus:shadow-brand-500/5'}`}
                                        {...register("password")}
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-[11px] font-bold text-red-500 ml-1 flex items-center gap-1">
                                        <span className="w-1 h-1 bg-red-500 rounded-full" /> {errors.password.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl text-sm font-black text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-300 transform active:scale-[0.98] shadow-xl hover:shadow-2xl"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Giriş Yap <Sparkles className="w-4 h-4 text-brand-400" />
                                    </span>
                                )}
                            </button>

                            <p className="text-center text-sm text-gray-500 font-medium">
                                Hesabınız yok mu?{" "}
                                <Link href="/auth/register" className="text-brand-600 font-bold hover:underline">
                                    Hemen Kaydolun
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
