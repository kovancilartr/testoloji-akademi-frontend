import { ArrowRight, CheckCircle2, Link, Star, Zap, Sparkles, FileText, Users, Clock, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import { Button } from '../button'

const HeroSection = () => {
    const features = [
        "🎓 İnteraktif Akademi",
        "🤝 Akıllı Koçluk Sistemi",
        "📊 Gelişmiş Analitik",
        "✂️ AI Soru Dijitalleştirme",
        "📄 Profesyonel PDF Müfredat",
        "⚡ Anlık Geri Bildirim",
        "📱 Mobil Akademi (PWA)",
        "💎 Kurumsal Çözümler"
    ];

    return (
        <>
            <section className="relative pt-32 pb-20 lg:pt-30 lg:pb-4 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-brand-50/50 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-blue-50/30 rounded-full blur-3xl -z-10" />

                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-8">
                            {/* Animated Badge */}
                            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 border-indigo-100 bg-gradient-to-r from-indigo-50 to-brand-50 text-indigo-700 text-[10px] font-black tracking-widest uppercase mb-2 shadow-lg shadow-indigo-50/50">
                                <Sparkles className="w-4 h-4 text-brand-500" />
                                <span className="bg-gradient-to-r from-indigo-600 to-brand-600 bg-clip-text text-transparent">
                                    Yeni Nesil Eğitim Ekosistemi
                                </span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-gray-900 leading-[1.05]">
                                Eğitimi <br />
                                <span className="text-brand-500 relative">
                                    Dijitalleştirin
                                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
                                    </svg>
                                </span><br />
                                Ve Yönetin.
                            </h1>

                            <p className="text-xl text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                                Soru Bankası, İnteraktif Müfredat ve Akıllı Koçluk bir arada.
                                <span className="text-indigo-600 font-bold ml-1 italic">Testoloji Akademi</span> ile eğitiminizi tek merkezden profesyonelce yönetin.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                                <Link href="/dashboard" className="w-full sm:w-auto">
                                    <Button size="lg" className="h-16 px-10 text-lg font-black bg-slate-900 hover:bg-slate-800 text-white rounded-2xl w-full shadow-2xl shadow-indigo-100 group relative overflow-hidden">
                                        <span className="relative flex items-center">
                                            Hemen Keşfet
                                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </Button>
                                </Link>
                                <div className="flex -space-x-3 items-center ml-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold overflow-hidden ring-4 ring-slate-50">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="User" />
                                        </div>
                                    ))}
                                    <div className="pl-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                        +5000 Aktif Öğrenci
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 relative group">
                            <div className="absolute inset-0 bg-brand-500/10 rounded-[3rem] blur-3xl group-hover:bg-brand-500/20 transition-all -z-10" />
                            <div className="relative bg-white p-4 rounded-[2.5rem] shadow-2xl border border-gray-100 transition-transform duration-700">
                                <Image
                                    src="/images/hero-mockup.png"
                                    alt="Platform Mockup"
                                    width={800}
                                    height={600}
                                    className="rounded-[2rem] shadow-inner"
                                />

                                {/* Floating badges */}
                                <div className="absolute -top-6 -right-6 bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-50 animate-bounce group-hover:scale-110 transition-transform">
                                    <div className="flex flex-col items-center gap-1">
                                        <Users className="w-8 h-8 text-brand-500" />
                                        <span className="text-[10px] font-black text-slate-400">AKADEMİ</span>
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 -left-6 bg-slate-900 text-white p-6 rounded-[2rem] shadow-2xl hidden md:block group-hover:scale-110 transition-transform">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                            <TrendingUp className="w-6 h-6 text-brand-400" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Performans</div>
                                            <div className="text-lg font-black text-white italic">%100 Dijital</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scrolling Features Marquee */}
                <div className="mt-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-10 pointer-events-none" />
                    <div className="flex gap-8 animate-marquee whitespace-nowrap py-2">
                        {[...features, ...features].map((feature, i) => (
                            <div
                                key={i}
                                className="inline-flex items-center px-8 py-4 bg-white rounded-[1.5rem] border border-slate-100 text-slate-700 font-black text-xs shadow-sm uppercase tracking-widest hover:border-brand-200 transition-colors"
                            >
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <style jsx>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </>
    )
}

export default HeroSection