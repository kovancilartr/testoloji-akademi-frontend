"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, Loader2, Sparkles, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { toast } from "sonner";

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Mevcut şifrenizi giriniz"),
    newPassword: z.string().min(6, "Yeni şifre en az 6 karakter olmalıdır"),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Yeni şifreler eşleşmiyor",
    path: ["confirmPassword"],
});

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ChangePasswordModal({ isOpen, onOpenChange }: ChangePasswordModalProps) {
    const [loading, setLoading] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordValues>({
        resolver: zodResolver(changePasswordSchema)
    });

    const onSubmit = async (data: ChangePasswordValues) => {
        setLoading(true);
        try {
            await api.post('/auth/change-password', {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            });
            toast.success("Şifreniz başarıyla değiştirildi.");
            onOpenChange(false);
            reset();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Şifre değiştirilemedi.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-400" />

                <div className="p-8 space-y-8">
                    <DialogHeader>
                        <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-brand-100/50">
                            <ShieldCheck className="w-8 h-8 text-brand-500" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight text-gray-900">Şifre Değiştir</DialogTitle>
                        <DialogDescription className="text-gray-500 font-medium leading-relaxed">
                            Hesap güvenliğiniz için mevcut şifrenizi doğrulamanız ve yeni bir şifre belirlemeniz gerekmektedir.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            {/* Current Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                                    Mevcut Şifre
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                                    </div>
                                    <input
                                        type={showCurrent ? "text" : "password"}
                                        placeholder="••••••••"
                                        className={`w-full pl-11 pr-12 py-3 bg-gray-50 border-2 rounded-2xl outline-none transition-all duration-200 ${errors.currentPassword ? 'border-red-100 bg-red-50 focus:border-red-400' : 'border-transparent focus:border-brand-500 focus:bg-white focus:shadow-xl focus:shadow-brand-500/5'}`}
                                        {...register("currentPassword")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrent(!showCurrent)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-500 transition-colors"
                                    >
                                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.currentPassword && (
                                    <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1">
                                        <span className="w-1 h-1 bg-red-500 rounded-full" /> {errors.currentPassword.message}
                                    </p>
                                )}
                            </div>

                            <div className="h-px bg-gray-100 my-2" />

                            {/* New Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                                    Yeni Şifre
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Sparkles className="h-4 w-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                                    </div>
                                    <input
                                        type={showNew ? "text" : "password"}
                                        placeholder="••••••••"
                                        className={`w-full pl-11 pr-12 py-3 bg-gray-50 border-2 rounded-2xl outline-none transition-all duration-200 ${errors.newPassword ? 'border-red-100 bg-red-50 focus:border-red-400' : 'border-transparent focus:border-brand-500 focus:bg-white focus:shadow-xl focus:shadow-brand-500/5'}`}
                                        {...register("newPassword")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNew(!showNew)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-500 transition-colors"
                                    >
                                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.newPassword && (
                                    <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1">
                                        <span className="w-1 h-1 bg-red-500 rounded-full" /> {errors.newPassword.message}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                                    Yeni Şifre (Tekrar)
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className={`w-full pl-11 pr-4 py-3 bg-gray-50 border-2 rounded-2xl outline-none transition-all duration-200 ${errors.confirmPassword ? 'border-red-100 bg-red-50 focus:border-red-400' : 'border-transparent focus:border-brand-500 focus:bg-white focus:shadow-xl focus:shadow-brand-500/5'}`}
                                        {...register("confirmPassword")}
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1">
                                        <span className="w-1 h-1 bg-red-500 rounded-full" /> {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
                            >
                                Vazgeç
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-[1.5] h-12 rounded-2xl bg-gray-900 hover:bg-black text-white font-black uppercase tracking-widest text-[10px] transition-all shadow-xl hover:shadow-black/10 transform active:scale-[0.98]"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Şifreyi Güncelle <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
