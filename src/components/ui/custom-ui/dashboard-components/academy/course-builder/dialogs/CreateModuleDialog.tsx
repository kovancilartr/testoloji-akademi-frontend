"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateModuleDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    moduleTitle: string;
    onModuleTitleChange: (title: string) => void;
    onSubmit: () => void;
    isLoading: boolean;
    mode?: 'create' | 'edit';
}

export function CreateModuleDialog({
    isOpen,
    onOpenChange,
    moduleTitle,
    onModuleTitleChange,
    onSubmit,
    isLoading,
    mode = 'create'
}: CreateModuleDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-3xl p-8">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
                        {mode === 'create' ? 'Yeni Bölüm Oluştur' : 'Bölümü Düzenle'}
                    </DialogTitle>
                    <DialogDescription className="font-medium text-slate-500">
                        {mode === 'create' ? 'Müfredatınız için yeni bir başlık ekleyin.' : 'Bölüm adını güncelleyin.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-6 space-y-4">
                    <div className="space-y-2">
                        <Label className="font-bold text-slate-700">Bölüm Adı</Label>
                        <Input
                            placeholder="Örn: Bölüm 4 - Integral Uygulamaları"
                            className="h-12 rounded-xl"
                            value={moduleTitle}
                            onChange={e => onModuleTitleChange(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-3">
                    <Button variant="ghost" className="font-bold rounded-xl h-12" onClick={() => onOpenChange(false)}>İptal</Button>
                    <Button
                        className="bg-orange-500 hover:bg-orange-600 text-white font-black h-12 px-8 rounded-xl shadow-lg shadow-orange-100"
                        onClick={onSubmit}
                        disabled={isLoading}
                    >
                        {mode === 'create' ? 'Bölümü Oluştur' : 'Değişiklikleri Kaydet'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
