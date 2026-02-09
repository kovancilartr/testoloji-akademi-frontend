"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Check,
    X,
    Zap,
    Crown,
    Star,
    Sparkles,
    ShieldCheck,
    ArrowRight,
    CreditCard,
    Rocket,
    Lock
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PricingDialogProps {
    isMobile?: boolean;
}

export function PricingDialog({ isMobile }: PricingDialogProps) {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

    const handleUpgrade = (planName: string) => {
        const phone = "905457983910";
        const email = user?.email || "Kayıtsız Kullanıcı";
        const cycle = billingCycle === "yearly" ? "Yıllık" : "Aylık";
        const message = `Merhaba, ${email} adresi ile sisteme kayıtlıyım. ${planName} paketi (${cycle}) için bilgi almak ve ödeme yapmak istiyorum.`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
    };

    const plans = [
        {
            name: "Bronz",
            id: "bronze",
            icon: <Star className="h-5 w-5 text-brand-400" />,
            description: "Bireysel deneme için.",
            price: { monthly: 0, yearly: 0 },
            features: [
                { text: "1 Proje Limiti", included: true },
                { text: "15 Soru / Test", included: true },
                { text: "Standart Fontlar", included: true },
                { text: "PDF İndirme", included: true },
                { text: "Özel Logo", included: false },
                { text: "AI Yardımı", included: false }
            ],
            buttonText: "Ücretsiz Başla",
            premium: false
        },
        {
            name: "Gümüş",
            id: "silver",
            icon: <Zap className="h-5 w-5 text-blue-500" />,
            description: "Profesyonel öğretmenler için.",
            price: { monthly: 120, yearly: 40 },
            totalPrice: { monthly: 120, yearly: 480 },
            features: [
                { text: "5 Proje Limiti", included: true },
                { text: "100 Soru / Test", included: true },
                { text: "Özel Fontlar", included: true },
                { text: "Gelişmiş PDF Mizanpajı", included: true },
                { text: "Öncelikli Destek", included: true },
                { text: "AI Desteği", included: true }
            ],
            buttonText: "Hemen Başla",
            premium: true,
            highlight: true
        },
        {
            name: "Altın",
            id: "gold",
            icon: <Crown className="h-5 w-5 text-yellow-500" />,
            description: "Kurumlar için tam paket.",
            price: { monthly: 250, yearly: 100 },
            totalPrice: { monthly: 250, yearly: 1200 },
            features: [
                { text: "15 Proje Limiti", included: true },
                { text: "200 Soru / Test", included: true },
                { text: "Kurum Logosu Ekleme", included: true },
                { text: "Ekip Yönetimi", included: true },
                { text: "7/24 Telefon Desteği", included: true },
                { text: "Özel Entegrasyon", included: true }
            ],
            buttonText: "Hemen Başla",
            premium: true
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {isMobile ? (
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-4 h-12 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-all cursor-pointer"
                    >
                        <CreditCard className="h-4 w-4" />
                        Fiyatlandırma
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        className="flex h-10 px-4 rounded-xl gap-2 text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-all font-bold text-sm cursor-pointer whitespace-nowrap"
                    >
                        <CreditCard className="h-4 w-4" />
                        Fiyatlandırma
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="!max-w-[1100px] w-[98vw] sm:w-[95vw] h-[95vh] sm:h-auto max-h-[95vh] sm:max-h-[90vh] p-0 overflow-hidden border-none shadow-2xl rounded-[1.5rem] sm:rounded-[2.5rem] bg-white flex flex-col font-sans">
                <ScrollArea className="flex-1 w-full overflow-y-auto">
                    {/* Minimal Header */}
                    <div className="px-4 sm:px-8 pt-8 pb-4 text-center shrink-0">
                        <div className="inline-flex py-1 px-3 bg-blue-50 rounded-full border border-blue-100 items-center gap-2 mb-3">
                            <Rocket className="h-3 w-3 text-blue-500" />
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] leading-none">Abonelik Planları</span>
                        </div>

                        <DialogTitle className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter uppercase mb-1">
                            Daha Fazla <span className="text-blue-600">Özellik</span>
                        </DialogTitle>
                        <DialogDescription className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 px-4">
                            Yıllık ödemelerde %75'e varan dev tasarruf
                        </DialogDescription>

                        <Tabs value={billingCycle} onValueChange={(v) => setBillingCycle(v as any)} className="inline-block w-full sm:w-auto px-4 sm:px-0">
                            <TabsList className="bg-gray-100 p-1 rounded-xl h-12 w-full sm:w-[280px]">
                                <TabsTrigger
                                    value="monthly"
                                    className="flex-1 rounded-lg font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                                >
                                    Aylık
                                </TabsTrigger>
                                <TabsTrigger
                                    value="yearly"
                                    className="flex-1 rounded-lg font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
                                >
                                    Yıllık (-%75)
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Compact Cards Grid */}
                    <div className="px-4 sm:px-8 py-6 pb-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
                            {plans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className={`relative bg-white rounded-[2rem] p-6 flex flex-col transition-all duration-300 ${plan.highlight
                                        ? "ring-2 ring-blue-500 shadow-2xl shadow-blue-500/10 z-10"
                                        : "border border-gray-100 shadow-lg shadow-gray-200/20"
                                        }`}
                                >
                                    {plan.highlight && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">
                                            Popüler Seçim
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${plan.id === 'bronze' ? "bg-brand-50" : plan.id === 'silver' ? "bg-blue-50" : "bg-yellow-50"
                                            }`}>
                                            {plan.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight leading-none">{plan.name}</h3>
                                            <p className="text-[10px] text-gray-400 font-bold tracking-tight truncate mt-1">{plan.description}</p>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-gray-900 tracking-tighter">
                                                {(plan as any).totalPrice?.[billingCycle] ?? (plan as any).price[billingCycle]} TL
                                            </span>
                                            <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest">
                                                {billingCycle === 'yearly' ? '/yıl' : '/ay'}
                                            </span>
                                        </div>
                                        {billingCycle === "yearly" && plan.price.monthly > 0 && (
                                            <div className="space-y-1 mt-1">
                                                <p className="text-[10px] font-black text-brand-600 uppercase tracking-tighter italic">
                                                    İndirimli: {plan.price.yearly} TL/ay
                                                </p>
                                                <p className="inline-block bg-green-50 text-green-600 text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest border border-green-100">
                                                    {plan.id === 'silver' ? '960 TL TASARRUF' : '1800 TL TASARRUF'}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2.5 flex-1 mb-6 pr-2">
                                        {plan.features.map((feature, fIdx) => (
                                            <div key={fIdx} className="flex items-center gap-2.5">
                                                {feature.included ? (
                                                    <div className="w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                                        <Check className="h-2.5 w-2.5 text-blue-500" />
                                                    </div>
                                                ) : (
                                                    <div className="w-4 h-4 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                                        <X className="h-2.5 w-2.5 text-gray-300" />
                                                    </div>
                                                )}
                                                <span className={`text-[11px] font-bold tracking-tight leading-none ${feature.included ? 'text-gray-600' : 'text-gray-300'}`}>
                                                    {feature.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        onClick={() => plan.premium ? handleUpgrade(plan.name) : setIsOpen(false)}
                                        className={`w-full h-11 rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 transition-all active:scale-95 ${plan.highlight
                                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                                            : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                                            }`}
                                    >
                                        {plan.buttonText}
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollArea>

                {/* Integrated Footer Bar */}
                <div className="px-6 sm:px-8 py-4 sm:py-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100">
                            <Lock className="h-3.5 w-3.5 text-green-500" />
                        </div>
                        <div className="leading-tight">
                            <p className="text-[10px] font-black text-gray-900 uppercase leading-none">Güvenli Ödeme</p>
                            <p className="text-[9px] font-bold text-gray-400 mt-0.5">256-bit SSL şifreleme ile verileriniz güvende.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 opacity-40">
                        <ShieldCheck className="h-4 w-4" />
                        <CreditCard className="h-4 w-4" />
                        <Sparkles className="h-4 w-4" />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
