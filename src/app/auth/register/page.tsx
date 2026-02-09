"use client";

import { useState } from "react";
import { Mail, Lock, Loader2, Sparkles, User, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useEffect } from "react";
import { ApiResponse, AuthResponse } from "@/types/auth";
import { FullPageLoader } from "@/components/ui/custom-ui/FullPageLoader";

const registerSchema = z.object({
    name: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır"),
    email: z.string().email("Geçerli bir email adresi giriniz"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const { login, isAuthenticated, isLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, isLoading, router]);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setLoading(true);
        try {
            const { confirmPassword, ...registerData } = data;
            const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', registerData);

            if (response.data.success) {
                toast.success("Kayıt başarılı! Hoş geldin.");
                login(response.data.data);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Kayıt sırasında bir hata oluştu. Lütfen bilgilerinizi kontrol edin.";
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
            {/* Left Side: Visual & Branding */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-black/60 z-10" />
                <Image
                    src="/images/login-bg.png"
                    alt="Education Background"
                    fill
                    className="object-cover scale-105 hover:scale-100 transition-transform duration-10000"
                    priority
                />

                {/* Brand Overlay Content */}
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-12 text-white">
                    <Link href="/auth/login" className="flex items-center gap-2 group">
                        <div className="relative w-10 h-10 group-hover:scale-110 transition-transform">
                            <Image
                                src="/images/logo2.png"
                                alt="Testoloji Logo"
                                fill
                                className="object-contain drop-shadow-lg"
                            />
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase">Testoloji</span>
                    </Link>

                    <div className="space-y-6 max-w-lg">
                        <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
                            Geleceğin <span className="text-brand-400">Öğretmenleri</span> Arasında Yerini Al.
                        </h1>
                        <p className="text-lg text-gray-200 leading-relaxed font-medium">
                            Dakikalar içinde profesyonel testler hazırlayarak öğrencilerinize en iyisini sunun. Üstelik tamamen karakter dostu fontlarla!
                        </p>

                        <div className="flex gap-4 pt-4 text-sm font-semibold">
                            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                Modern Tasarım
                            </div>
                            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                Sınırsız Soru
                            </div>
                            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                Ücretsiz Başla
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-gray-400 font-medium">
                        © 2026 Testoloji. Tüm hakları saklıdır.
                    </div>
                </div>
            </div>

            {/* Right Side: Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative overflow-y-auto">
                <div className="absolute top-8 left-8 flex items-center gap-2 lg:hidden">
                    <div className="relative w-8 h-8">
                        <Image
                            src="/images/logo2.png"
                            alt="Testoloji Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-xl font-bold tracking-tighter uppercase">Testoloji</span>
                </div>

                <div className="w-full max-w-md space-y-8 py-12">
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black tracking-tight text-gray-900">Aramıza Katılın!</h2>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Yeni bir hesap oluşturarak testlerinizi hazırlamaya başlayın.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-4">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                                    Ad Soyad
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Adınız Soyadınız"
                                        className={`w-full pl-11 pr-4 py-3 bg-gray-50 border-2 rounded-2xl outline-none transition-all duration-200 ${errors.name ? 'border-red-100 bg-red-50 focus:border-red-400' : 'border-transparent focus:border-brand-500 focus:bg-white focus:shadow-xl focus:shadow-brand-500/5'}`}
                                        {...register("name")}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-[11px] font-bold text-red-500 ml-1 flex items-center gap-1">
                                        <span className="w-1 h-1 bg-red-500 rounded-full" /> {errors.name.message}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
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

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                                    Şifre
                                </label>
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

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                                    Şifre Tekrar
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className={`w-full pl-11 pr-4 py-3 bg-gray-50 border-2 rounded-2xl outline-none transition-all duration-200 ${errors.confirmPassword ? 'border-red-100 bg-red-50 focus:border-red-400' : 'border-transparent focus:border-brand-500 focus:bg-white focus:shadow-xl focus:shadow-brand-500/5'}`}
                                        {...register("confirmPassword")}
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-[11px] font-bold text-red-500 ml-1 flex items-center gap-1">
                                        <span className="w-1 h-1 bg-red-500 rounded-full" /> {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl text-sm font-black text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-300 transform active:scale-[0.98] shadow-xl hover:shadow-2xl"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Kayıt Ol <Sparkles className="w-4 h-4 text-brand-400" />
                                    </span>
                                )}
                            </button>

                            <p className="text-center text-sm text-gray-500 font-medium">
                                Zaten bir hesabınız var mı?{" "}
                                <Link href="/auth/login" className="text-brand-600 font-bold hover:underline">
                                    Giriş Yapın
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
