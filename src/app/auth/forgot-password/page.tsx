"use client";

import { Mail, ArrowLeft, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

const forgotPasswordSchema = z.object({
    email: z.string().email("Geçerli bir email adresi giriniz"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema)
    });

    const onSubmit = async (data: ForgotPasswordValues) => {
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', data);
            setSubmitted(true);
            toast.success("Sıfırlama bağlantısı gönderildi!");
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Bir hata oluştu. Lütfen tekrar deneyin.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gray-50/50">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-brand-500/5 p-8 sm:p-12 space-y-8 border border-gray-100">
                <div className="space-y-3 text-center">
                    <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-brand-100/50">
                        <Mail className="w-8 h-8 text-brand-500" />
                    </div>

                    {!submitted ? (
                        <>
                            <h1 className="text-3xl font-black tracking-tight text-gray-900">Şifremi Unuttum</h1>
                            <p className="text-gray-500 font-medium leading-relaxed px-4">
                                Merak etmeyin! E-posta adresinizi girin, size şifrenizi sıfırlamanız için bir bağlantı gönderelim.
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-3xl font-black tracking-tight text-gray-900">Kontrol Edin!</h1>
                            <p className="text-gray-500 font-medium leading-relaxed px-4">
                                E-posta adresinize bir sıfırlama bağlantısı gönderdik. Lütfen gelen kutunuzu (ve gereksiz kutusunu) kontrol edin.
                            </p>
                        </>
                    )}
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                                    className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-2xl outline-none transition-all duration-200 ${errors.email ? 'border-red-100 bg-red-50 focus:border-red-400' : 'border-transparent focus:border-brand-500 focus:bg-white focus:shadow-xl focus:shadow-brand-500/5'}`}
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-[11px] font-bold text-red-500 ml-1 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-red-500 rounded-full" /> {errors.email.message}
                                </p>
                            )}
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
                                    Bağlantı Gönder <Sparkles className="w-4 h-4 text-brand-400" />
                                </span>
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                            <p className="text-xs font-bold text-green-700">Link başarılı bir şekilde simüle edildi (Backend konsoluna bakınız).</p>
                        </div>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="w-full py-4 text-sm font-black text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            Tekrar Dene
                        </button>
                    </div>
                )}

                <div className="pt-4 border-t border-gray-50 flex justify-center">
                    <Link href="/auth/login" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-600 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Giriş Sayfasına Dön
                    </Link>
                </div>
            </div>
        </div>
    );
}
