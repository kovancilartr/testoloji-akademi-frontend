"use client";

import { Lock, ArrowLeft, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useState, Suspense } from "react";

const resetPasswordSchema = z.object({
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema)
    });

    const onSubmit = async (data: ResetPasswordValues) => {
        if (!token) {
            toast.error("Geçersiz sıfırlama bağlantısı.");
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', {
                token,
                newPassword: data.password
            });
            setSuccess(true);
            toast.success("Şifreniz başarıyla güncellendi!");
            setTimeout(() => {
                router.push('/auth/login');
            }, 3000);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Bir hata oluştu. Lütfen tekrar deneyin.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-gray-900">Geçersiz Link</h1>
                <p className="text-gray-500 font-medium">
                    Sıfırlama bağlantısı eksik veya geçersiz. Lütfen tekrar şifre sıfırlama isteği oluşturun.
                </p>
                <Link href="/auth/forgot-password" className="inline-flex items-center gap-2 text-brand-600 font-black uppercase tracking-widest text-[10px] bg-brand-50 px-6 py-3 rounded-xl hover:bg-brand-100 transition-colors">
                    YENİ LİNK OLUŞTUR
                </Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className="space-y-6 text-center scale-up-center">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-gray-900">Başarılı!</h1>
                <p className="text-gray-500 font-medium">
                    Şifreniz başarıyla yenilendi. Giriş sayfasına yönlendiriliyorsunuz...
                </p>
                <div className="pt-4 flex justify-center">
                    <Loader2 className="h-6 w-6 text-brand-500 animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                        Yeni Şifre
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-2xl outline-none transition-all duration-200 ${errors.password ? 'border-red-100 bg-red-50 focus:border-red-400' : 'border-transparent focus:border-brand-500 focus:bg-white focus:shadow-xl focus:shadow-brand-500/5'}`}
                            {...register("password")}
                        />
                    </div>
                    {errors.password && (
                        <p className="text-[11px] font-bold text-red-500 ml-1 flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-500 rounded-full" /> {errors.password.message}
                        </p>
                    )}
                </div>

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
                            className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-2xl outline-none transition-all duration-200 ${errors.confirmPassword ? 'border-red-100 bg-red-50 focus:border-red-400' : 'border-transparent focus:border-brand-500 focus:bg-white focus:shadow-xl focus:shadow-brand-500/5'}`}
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

            <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl text-sm font-black text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-300 transform active:scale-[0.98] shadow-xl hover:shadow-2xl"
            >
                {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <span className="flex items-center gap-2">
                        Şifreyi Güncelle <Sparkles className="w-4 h-4 text-brand-400" />
                    </span>
                )}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gray-50/50">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-brand-500/5 p-8 sm:p-12 space-y-8 border border-gray-100">
                <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin text-brand-500" /></div>}>
                    <div className="space-y-3 text-center">
                        <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-brand-100/50">
                            <Lock className="w-8 h-8 text-brand-500" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900">Yeni Şifre Oluştur</h1>
                        <p className="text-gray-500 font-medium leading-relaxed px-4">
                            Lütfen hesabınız için yeni ve güvenli bir şifre belirleyin.
                        </p>
                    </div>

                    <ResetPasswordForm />

                    <div className="pt-4 border-t border-gray-50 flex justify-center">
                        <Link href="/auth/login" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-600 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Vazgeç ve Giriş Yap
                        </Link>
                    </div>
                </Suspense>
            </div>
        </div>
    );
}
