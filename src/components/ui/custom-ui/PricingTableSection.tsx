import { CheckCircle2 } from 'lucide-react';
import { Button } from '../button';
import { useState } from 'react';

const PricingTableSection = () => {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <section id="pricing" className="py-24 lg:py-40 relative">
            <div className="container mx-auto px-6 text-center">
                <div className="max-w-3xl mx-auto space-y-6 mb-16">
                    <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-gray-900">
                        Sizin İçin <span className="text-brand-500">Doğru Planı</span> Seçin
                    </h2>
                    <p className="text-lg text-gray-500 font-medium">Bireysel veya kurumsal, her ölçeğe uygun çözümlerimizle tanışın.</p>

                    {/* Monthly/Yearly Toggle */}
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <span className={`text-sm font-black uppercase tracking-widest ${!isYearly ? 'text-gray-900' : 'text-gray-400'}`}>Aylık</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="w-16 h-8 bg-gray-900 rounded-full relative p-1 transition-all duration-300"
                        >
                            <div className={`w-6 h-6 bg-brand-500 rounded-full transition-all duration-300 transform ${isYearly ? 'translate-x-8' : 'translate-x-0'}`} />
                        </button>
                        <span className={`text-sm font-black uppercase tracking-widest ${isYearly ? 'text-gray-900' : 'text-gray-400'}`}>Yıllık</span>
                        <div className="bg-green-100 text-green-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter animate-bounce">
                            %60+ Tasarruf
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {[
                        {
                            name: "Misafir",
                            price: "0",
                            period: "",
                            feat: ["Kayıt Olmadan Dene", "1 Proje Hakkı", "10 Soru / Test", "Logo Fligranlı PDF", "Geçici Tarayıcı Kaydı"],
                            cta: "Hemen Dene",
                            popular: false,
                            color: "gray"
                        },
                        {
                            name: "Bronz (Ücretsiz)",
                            price: "0",
                            period: "",
                            feat: ["3 Proje Hakkı", "20 Soru / Test", "Logo Fligranlı PDF", "Projeleri Kaydetme", "Standart Desteği"],
                            cta: "Ücretsiz Üye Ol",
                            popular: false,
                            color: "brand"
                        },
                        {
                            name: "Gümüş",
                            price: isYearly ? "480" : "120",
                            period: isYearly ? "/yıl" : "/ay",
                            effective: isYearly ? "40 TL/ay" : null,
                            savings: isYearly ? "960 TL Tasarruf" : null,
                            feat: ["10 Proje Hakkı", "100 Soru / Test", "Fligransız (Temiz) PDF", "Özel Tasarım Şablonları", "Öncelikli Destek"],
                            cta: "Hemen Başla",
                            popular: true,
                            color: "brand"
                        },
                        {
                            name: "Altın",
                            price: isYearly ? "1200" : "250",
                            period: isYearly ? "/yıl" : "/ay",
                            effective: isYearly ? "100 TL/ay" : null,
                            savings: isYearly ? "1800 TL Tasarruf" : null,
                            feat: ["25 Proje Hakkı", "250 Soru / Test", "Tüm Şablonlar & Fontlar", "Dosya Birleştirme (Kitap)", "7/24 Telefon Desteği"],
                            cta: "Bize Ulaşın",
                            popular: false,
                            color: "brand"
                        },
                    ].map((p, i) => (
                        <div key={i} className={`p-8 rounded-[2rem] border ${p.popular ? 'border-gray-900 border-4 shadow-2xl relative scale-105 z-10' : 'border-gray-100'} text-left space-y-6 flex flex-col justify-between bg-white transition-all duration-500`}>
                            {p.popular && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-black tracking-widest uppercase px-6 py-2 rounded-full">
                                    En Popüler
                                </div>
                            )}
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">{p.name}</h3>
                                <div className="space-y-1">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-gray-900 text-3xl font-black">₺</span>
                                        <span className="text-5xl font-black tracking-tighter text-gray-900">{p.price}</span>
                                        <span className="text-gray-400 font-bold">{p.period}</span>
                                    </div>
                                    {p.effective && (
                                        <div className="text-brand-600 text-sm font-black uppercase tracking-tighter">
                                            İndirimli: {p.effective}
                                        </div>
                                    )}
                                    {p.savings && (
                                        <div className="inline-block mt-2 bg-green-50 text-green-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest border border-green-100">
                                            {p.savings}
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-4 pt-4">Neler Dahil?</p>
                                <ul className="space-y-4">
                                    {p.feat.map((f, j) => (
                                        <li key={j} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                            <CheckCircle2 className={`w-5 h-5 shrink-0 ${p.popular ? 'text-brand-500' : 'text-green-500'}`} />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="pt-4">
                                <Button
                                    onClick={() => {
                                        if (p.name === "Misafir") {
                                            window.location.href = "/dashboard";
                                        } else if (p.name.includes("Bronz")) {
                                            window.location.href = "/auth/register";
                                        } else {
                                            const phone = "905457983910";
                                            const cycle = isYearly ? "Yıllık" : "Aylık";
                                            const message = `Merhaba, Testoloji sitemiz üzerinden ${p.name} paketi (${cycle}) hakkında bilgi almak ve abone olmak istiyorum.`;
                                            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
                                        }
                                    }}
                                    className={`w-full h-14 rounded-2xl font-black text-lg shadow-xl cursor-pointer ${p.popular ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/20' : 'bg-gray-100 hover:bg-gray-200 text-gray-900 shadow-none'}`}
                                >
                                    {p.cta}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default PricingTableSection