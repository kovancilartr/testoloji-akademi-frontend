"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { useThemeColors } from "@/contexts/ThemeContext";

interface ContactStudentDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    studentName: string;
    studentPhone?: string;
}

export function ContactStudentDialog({
    isOpen,
    onOpenChange,
    studentName,
    studentPhone
}: ContactStudentDialogProps) {
    const colors = useThemeColors();
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (!studentPhone) {
            toast.error("Öğrencinin telefon numarası kayıtlı değil.");
            return;
        }

        if (!message.trim()) {
            toast.error("Lütfen bir mesaj yazın.");
            return;
        }

        // Telefon numarasını temizle (Sadece rakamlar kalsın)
        const cleanPhone = studentPhone.replace(/\D/g, '');

        // Eğer başında 0 varsa kaldır, 90 yoksa ekle gibi basit bir mantık kurabiliriz
        // Genelde cleanPhone direk kullanılır ama TR numaraları için 90 eklenebilir
        let formattedPhone = cleanPhone;
        if (cleanPhone.startsWith('0')) {
            formattedPhone = '90' + cleanPhone.substring(1);
        } else if (!cleanPhone.startsWith('90') && cleanPhone.length === 10) {
            formattedPhone = '90' + cleanPhone;
        }

        const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        onOpenChange(false);
        setMessage("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="mx-auto bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <DialogTitle className="text-center text-xl font-black text-gray-900">
                        WhatsApp Mesajı Gönder
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        {studentName} adlı öğrenciye mesaj gönderin.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <Textarea
                        placeholder="Mesajınızı buraya yazın..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[120px] font-medium resize-none"
                    />

                    {!studentPhone && (
                        <div className="text-xs text-red-500 font-medium text-center bg-red-50 p-2 rounded-lg">
                            Uyarı: Öğrencinin telefon numarası sistemde kayıtlı değil.
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="cursor-pointer mr-2"
                    >
                        İptal
                    </Button>
                    <Button
                        onClick={handleSend}
                        className="bg-green-600 hover:bg-green-700 font-bold cursor-pointer text-white gap-2"
                        disabled={!studentPhone || !message.trim()}
                    >
                        <Send className="w-4 h-4" />
                        WhatsApp ile Gönder
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
