"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export function ForcePasswordChangeModal() {
    const { user, logout } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Eğer kullanıcı yoksa veya şifre değişikliği gerekmiyorsa null dön
    if (!user || user.passwordChangeRequired !== true) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            toast.error("Yeni şifre en az 6 karakter olmalıdır.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Yeni şifreler eşleşmiyor.");
            return;
        }

        if (currentPassword === newPassword) {
            toast.error("Yeni şifre eskisiyle aynı olamaz.");
            return;
        }

        setIsLoading(true);

        try {
            await api.patch("/auth/change-password", {
                currentPassword,
                newPassword
            });

            toast.success("Şifreniz başarıyla güncellendi.");

            // Sayfayı yenileyerek user bilgisini güncelle (veya context'i manuel güncellemek daha iyi olur ama reload en garantisi)
            window.location.reload();

        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Şifre değiştirilirken bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-[425px] [&>button]:hidden pointer-events-auto" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                <DialogHeader>
                    <div className="mx-auto bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="h-6 w-6 text-amber-600" />
                    </div>
                    <DialogTitle className="text-center text-xl font-black text-gray-900">Şifre Değişikliği Gerekli</DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        Güvenliğiniz için varsayılan şifrenizi değiştirmeniz gerekmektedir. Lütfen güçlü bir şifre belirleyin.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="current">Mevcut Şifre (Varsayılan: 123456)</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                id="current"
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="Mevcut şifreniz"
                                className="pl-9 pr-10"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="new">Yeni Şifre</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                id="new"
                                type={showNewPassword ? "text" : "password"}
                                placeholder="En az 6 karakter"
                                className="pl-9 pr-10"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm">Yeni Şifre (Tekrar)</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                id="confirm"
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Şifrenizi doğrulayın"
                                className="pl-9"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-4">
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-bold" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Güncelleniyor...
                                </>
                            ) : (
                                "Şifreyi Güncelle ve Devam Et"
                            )}
                        </Button>
                        <Button type="button" variant="ghost" onClick={logout} className="w-full text-gray-500 font-medium" disabled={isLoading}>
                            Çıkış Yap
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
