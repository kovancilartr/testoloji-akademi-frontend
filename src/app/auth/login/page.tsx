"use client";

import { Mail, Lock, Loader2, Sparkles } from "lucide-react";
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

const loginSchema = z.object({
    email: z.string().email("Geçerli bir email adresi giriniz"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { login, isAuthenticated, isLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
                // Success
                toast.success("Giriş başarılı! Yönlendiriliyorsunuz...");
                // login function in AuthContext will handle the redirect
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
                    <Link href="/" className="flex items-center gap-2 w-fit">
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
                            Eğitimi <span className="text-brand-400">Teknolojiyle</span> Yeniden Şekillendirin.
                        </h1>
                        <p className="text-lg text-gray-200 leading-relaxed font-medium">
                            Profesyonel soru bankası ve test oluşturma platformu ile saniyeler içinde kaliteli içerikler hazırlayın.
                        </p>

                        <div className="flex gap-4 pt-4 text-sm font-semibold">
                            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                +10k Soru
                            </div>
                            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                Akıllı Mizanpaj
                            </div>
                            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                PDF Export
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-gray-400 font-medium">
                        © 2026 Testoloji. Tüm hakları saklıdır.
                    </div>
                </div>
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
