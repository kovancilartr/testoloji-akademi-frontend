"use client";

import { useState, useEffect } from "react";
import {
    Settings,
    Save,
    Key,
    Eye,
    EyeOff,
    ShieldCheck,
    Cpu,
    Loader2,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AiUsageDashboard } from "@/components/ui/custom-ui/dashboard-components/admin/AiUsageDashboard";
import { useSystemSettings, useAiUsageStats, useSaveApiKey, useSaveModel } from "@/hooks/use-system-settings";

export default function AdminSettingsPage() {
    const { data: settingsData, isLoading } = useSystemSettings();
    const { data: usageStats } = useAiUsageStats();
    const saveApiKeyMutation = useSaveApiKey();
    const saveModelMutation = useSaveModel();

    const [apiKey, setApiKey] = useState("");
    const [showKey, setShowKey] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedModel, setSelectedModel] = useState("gemini-2.0-flash");
    const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);

    // Cache'ten gelen ayarları local state'e senkronize et
    useEffect(() => {
        if (settingsData) {
            setApiKey(settingsData.apiKey);
            setSelectedModel(settingsData.selectedModel);
            setIsEditing(!settingsData.hasExistingKey);
        }
    }, [settingsData]);

    const hasExistingKey = settingsData?.hasExistingKey ?? false;
    const isSaving = saveApiKeyMutation.isPending || saveModelMutation.isPending;

    const handleSaveApiKey = async () => {
        if (!apiKey.trim()) {
            toast.error("Lütfen geçerli bir API anahtarı girin.");
            return;
        }

        try {
            await saveApiKeyMutation.mutateAsync(apiKey);
            toast.success("API Anahtarı başarıyla kaydedildi.");
            setIsEditing(false);
            setIsApiKeyDialogOpen(false);
        } catch (error) {
            console.error("Failed to save API Key:", error);
            toast.error("API Anahtarı kaydedilirken bir hata oluştu.");
        }
    };

    const handleSaveModel = async () => {
        try {
            await saveModelMutation.mutateAsync(selectedModel);
            toast.success("Model tercihi başarıyla kaydedildi.");
        } catch (error) {
            console.error("Failed to save model:", error);
            toast.error("Model tercihi kaydedilirken bir hata oluştu.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    const models = [
        {
            id: 'gemini-2.0-flash',
            name: 'Gemini 2.0 Flash ⭐',
            desc: 'En dengeli model - Yüksek kota (Önerilen)',
            stats: { rpm: '15', tpm: '1M', rpd: '1.500' },
            color: 'blue'
        },
        {
            id: 'gemini-2.0-flash-lite',
            name: 'Gemini 2.0 Flash-Lite',
            desc: 'En hafif ve hızlı model - En yüksek kota',
            stats: { rpm: '30', tpm: '1M', rpd: '14.400' },
            color: 'green'
        },
        {
            id: 'gemini-2.5-flash',
            name: 'Gemini 2.5 Flash',
            desc: 'Gelişmiş akıl yürütme (Düşük kota)',
            stats: { rpm: '10', tpm: '250K', rpd: '500' },
            color: 'orange'
        },
        {
            id: 'gemini-2.5-flash-lite',
            name: 'Gemini 2.5 Flash-Lite',
            desc: '2.5 serisinin hafif versiyonu',
            stats: { rpm: '30', tpm: '1M', rpd: '14.400' },
            color: 'purple'
        },
    ];

    return (
        <div className="p-4 md:p-8 w-full space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <div className="bg-blue-100 p-2.5 rounded-2xl shadow-sm border border-blue-50">
                            <Settings className="w-7 h-7 text-blue-600" />
                        </div>
                        Sistem Ayarları
                    </h1>
                    <p className="text-gray-500 font-bold ml-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        Platformun merkez yapılandırmalarını buradan yönetin.
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Model Selection Section */}
                <Card className="border-none shadow-2xl shadow-blue-500/5 rounded-[2.5rem] overflow-hidden bg-white border border-gray-100 flex flex-col">
                    <CardHeader className="px-4 md:px-8 py-5 md:py-6 border-b border-gray-50 bg-linear-to-b from-gray-50/50 to-white">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-black text-gray-900 flex items-center gap-3">
                                    <div className="bg-purple-50 p-2 rounded-xl">
                                        <Cpu className="w-5 h-5 text-purple-500" />
                                    </div>
                                    Model Yapılandırması
                                </CardTitle>
                                <CardDescription className="font-bold text-gray-400 text-xs pl-1">
                                    Aktif yapay zeka modelini seçin.
                                </CardDescription>
                            </div>

                            <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="cursor-pointer border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold gap-2 rounded-xl h-10 px-4">
                                        <Key className="w-4 h-4" />
                                        APIKEY Yönetimi
                                        {hasExistingKey && (
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 ml-1 animate-pulse" />
                                        )}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md rounded-[2rem] border-0 shadow-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-black flex items-center gap-2">
                                            <Key className="w-5 h-5 text-blue-500" />
                                            API Anahtarı Yönetimi
                                        </DialogTitle>
                                        <DialogDescription className="font-bold text-gray-400">
                                            Google AI Studio'dan aldığınız anahtarı girin.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-4 py-4">
                                        {!hasExistingKey && (
                                            <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl flex items-center gap-3 text-orange-700 font-bold text-xs">
                                                <AlertCircle className="w-4 h-4" />
                                                Kayıtlı anahtar bulunamadı.
                                            </div>
                                        )}

                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors">
                                                <Key className="w-4 h-4" />
                                            </div>
                                            <Input
                                                type={showKey ? "text" : "password"}
                                                value={apiKey}
                                                onChange={(e) => {
                                                    setApiKey(e.target.value);
                                                    setIsEditing(true);
                                                }}
                                                readOnly={!isEditing && hasExistingKey}
                                                placeholder="AI API Key buraya girin..."
                                                className={cn(
                                                    "h-12 pl-12 pr-12 rounded-xl border-2 font-bold text-gray-700 transition-all text-sm",
                                                    (isEditing || !hasExistingKey)
                                                        ? "border-blue-500 bg-white ring-4 ring-blue-500/5 focus:ring-blue-500/10"
                                                        : "border-gray-100 bg-gray-50/30"
                                                )}
                                            />
                                            <button
                                                onClick={() => setShowKey(!showKey)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                                            >
                                                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            {hasExistingKey && !isEditing && (
                                                <Button variant="ghost" onClick={() => setIsEditing(true)} size="sm" className="text-orange-500 hover:text-orange-600 hover:bg-orange-50">
                                                    Değiştir
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    <DialogFooter className="flex-col sm:flex-row gap-2">
                                        <Button variant="outline" onClick={() => setIsApiKeyDialogOpen(false)} className="rounded-xl font-bold border-gray-200">
                                            Kapat
                                        </Button>
                                        <Button
                                            onClick={handleSaveApiKey}
                                            disabled={isSaving || (!isEditing && hasExistingKey)}
                                            className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white gap-2"
                                        >
                                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Kaydet
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Desktop Table */}
                        <div className="hidden md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-gray-100">
                                        <TableHead className="w-[50px] pl-6"></TableHead>
                                        <TableHead className="font-black text-gray-400 text-xs uppercase tracking-wider">Model Adı</TableHead>
                                        <TableHead className="font-black text-gray-400 text-xs uppercase tracking-wider">RPM / TPM / RPD</TableHead>
                                        <TableHead className="text-right pr-6 font-black text-gray-400 text-xs uppercase tracking-wider">Durum</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {models.map((model) => (
                                        <TableRow
                                            key={model.id}
                                            className={cn(
                                                "cursor-pointer transition-colors border-gray-50",
                                                selectedModel === model.id ? `bg-${model.color}-50/30 hover:bg-${model.color}-50/50` : "hover:bg-gray-50"
                                            )}
                                            onClick={() => setSelectedModel(model.id)}
                                        >
                                            <TableCell className="pl-6 py-4">
                                                <div className={cn(
                                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                                    selectedModel === model.id ? `border-${model.color}-500 bg-${model.color}-500` : "border-gray-200 bg-white"
                                                )}>
                                                    {selectedModel === model.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-lg flex items-center justify-center border shrink-0",
                                                        selectedModel === model.id ? `bg-${model.color}-100 border-${model.color}-200 text-${model.color}-600` : "bg-gray-50 border-gray-100 text-gray-400"
                                                    )}>
                                                        <Cpu className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 text-sm">{model.name}</div>
                                                        <div className="text-xs text-gray-500 font-medium">{model.desc}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">{model.stats.rpm}</span>
                                                    <span className="text-gray-300">-</span>
                                                    <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">{model.stats.tpm}</span>
                                                    <span className="text-gray-300">-</span>
                                                    <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">{model.stats.rpd}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-6 py-4">
                                                {selectedModel === model.id && (
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black border",
                                                        `bg-${model.color}-50 text-${model.color}-600 border-${model.color}-100`
                                                    )}>
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        Seçili
                                                    </span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-50">
                            {models.map((model) => (
                                <div
                                    key={model.id}
                                    onClick={() => setSelectedModel(model.id)}
                                    className={cn(
                                        "p-4 cursor-pointer transition-all active:bg-gray-50",
                                        selectedModel === model.id && `bg-${model.color}-50/30`
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                                            selectedModel === model.id ? `border-${model.color}-500 bg-${model.color}-500` : "border-gray-200 bg-white"
                                        )}>
                                            {selectedModel === model.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                        </div>
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center border shrink-0",
                                            selectedModel === model.id ? `bg-${model.color}-100 border-${model.color}-200 text-${model.color}-600` : "bg-gray-50 border-gray-100 text-gray-400"
                                        )}>
                                            <Cpu className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-gray-900 text-sm truncate">{model.name}</div>
                                            <div className="text-[11px] text-gray-500 font-medium">{model.desc}</div>
                                        </div>
                                        {selectedModel === model.id && (
                                            <CheckCircle2 className={cn("w-5 h-5 shrink-0", `text-${model.color}-500`)} />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button
                        onClick={handleSaveModel}
                        disabled={isSaving}
                        className={cn(
                            "h-12 md:h-14 px-6 md:px-8 rounded-2xl font-black text-sm md:text-base shadow-xl active:scale-95 transition-all flex items-center gap-2 w-full sm:w-auto",
                            "bg-gray-900 hover:bg-black text-white shadow-gray-500/20"
                        )}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Kaydediliyor...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Tercihi Kaydet
                            </>
                        )}
                    </Button>
                </div>

                {/* AI Usage Dashboard */}
                <AiUsageDashboard stats={usageStats ?? null} />

                {/* Status Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center space-y-3 hover:shadow-md transition-shadow group">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Servis Durumu</p>
                            <p className="text-sm font-black text-gray-900">Google Gemini Aktif</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center space-y-3 hover:shadow-md transition-shadow group">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Kripto Motoru</p>
                            <p className="text-sm font-black text-gray-900">AES-256 Devrede</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center space-y-3 hover:shadow-md transition-shadow group md:col-span-2 lg:col-span-1">
                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100 group-hover:scale-110 transition-transform">
                            <Settings className="w-6 h-6 text-orange-500" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Versiyon</p>
                            <p className="text-sm font-black text-gray-900">v2.4 Core System</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
