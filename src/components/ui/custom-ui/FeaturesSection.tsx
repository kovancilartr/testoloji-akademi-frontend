import { Cpu, FileText, Layout, Sparkles, Scissors, Users, GraduationCap, BarChart3, ShieldCheck } from 'lucide-react'
import React from 'react'

const FeaturesSection = () => {
    return (
        <section id="features" className="py-24 lg:py-32 bg-gray-50/50">
            <div className="container mx-auto px-6 text-center">
                <div className="max-w-3xl mx-auto space-y-6 mb-20">
                    <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-gray-900 leading-tight">
                        Eğitimi Geleceğe Taşıyan <br />
                        <span className="text-brand-500">Dijital Yetenekler</span>
                    </h2>
                    <p className="text-lg text-gray-500 font-medium leading-relaxed">
                        Testoloji Akademi, sadece bir döküman aracı değil; öğretmen ve öğrenciler için uçtan uca dijital bir öğrenim deneyimidir.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "İnteraktif Akademi (LMS)",
                            desc: "Kendi online akademini kurun. Videolar, PDF dökümanlar ve dijital testler ile zenginleştirilmiş kurslar oluşturun.",
                            icon: GraduationCap,
                            color: "indigo"
                        },
                        {
                            title: "Akıllı Koçluk Sistemi",
                            desc: "Öğrencilerinizin gelişimini anlık takip edin. Yapay zeka destekli önerilerle gelişim yolculuklarına rehberlik edin.",
                            icon: Users,
                            color: "brand"
                        },
                        {
                            title: "Sihirli Makas (AI)",
                            desc: "PDF dosyalarındaki soruları yapay zeka ile saniyeler içinde kırpın, dijitalleştirin ve kendi soru bankanızı oluşturun.",
                            icon: Scissors,
                            color: "emerald"
                        },
                        {
                            title: "Gelişmiş Analitik",
                            desc: "Öğrenci bazlı Doğru/Yanlış/Net takibi. Sınıf başarı ortalamaları ve detaylı performans karneleri ile veri odaklı ilerleyin.",
                            icon: BarChart3,
                            color: "rose"
                        },
                        {
                            title: "Profesyonel Yayıncı",
                            desc: "Dijital testlerinizi tek tıkla profesyonel mizanpajlı PDF kitapçıklara dönüştürün. Matbaa kalitesinde çıktılar alın.",
                            icon: FileText,
                            color: "amber"
                        },
                        {
                            title: "Kurumsal Özelleştirme",
                            desc: "Platformu kendi logonuz, renkleriniz ve özel filigranlarınızla (watermark) markanıza özel hale getirin.",
                            icon: ShieldCheck,
                            color: "slate"
                        }
                    ].map((f, i) => (
                        <div key={i} className="group p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-brand-500/5 transition-all duration-500 text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem] -z-10 group-hover:bg-brand-50 transition-colors" />
                            <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-8 bg-slate-900 group-hover:bg-brand-500 transition-all duration-300 shadow-xl shadow-slate-100`}>
                                <f.icon className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-black mb-4 text-slate-900 tracking-tight leading-none">{f.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection