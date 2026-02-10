import { FileText, Sparkles, Scissors, Users, GraduationCap, BarChart3, Video, BrainCircuit, Target, ShieldCheck } from 'lucide-react'
import React from 'react'
import { cn } from "@/lib/utils";

const FeaturesSection = () => {
    const teacherFeatures = [
        {
            title: "Sihirli Makas (AI)",
            desc: "PDF dosyasındaki soruları yapay zeka ile otomatik olarak ayrıştırın ve dijital soru bankanıza ekleyin.",
            icon: Scissors,
            color: "text-orange-500",
            bg: "bg-orange-50"
        },
        {
            title: "Akıllı Koçluk",
            desc: "Öğrencilerinizin performansını anlık izleyin, eksik konuları tespit edin ve otomatik ödevlendirme yapın.",
            icon: BrainCircuit,
            color: "text-indigo-500",
            bg: "bg-indigo-50"
        },
        {
            title: "PDF Yayıncılık",
            desc: "Hazırladığınız dijital testleri tek tıkla profesyonel mizanpajlı, baskıya hazır PDF kitapçıklara dönüştürün.",
            icon: FileText,
            color: "text-red-500",
            bg: "bg-red-50"
        }
    ];

    const studentFeatures = [
        {
            title: "Kişisel Çalışma Planı",
            desc: "Hedefine ve seviyene uygun, yapay zeka destekli haftalık çalışma programı ile düzenli ilerle.",
            icon: Target,
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            title: "Video Dersler & Kurslar",
            desc: "Eksik olduğun konularda öğretmeninin hazırladığı video dersleri izle, interaktif testlerle pekiştir.",
            icon: Video,
            color: "text-purple-500",
            bg: "bg-purple-50"
        },
        {
            title: "Detaylı Gelişim Raporu",
            desc: "Hangi konuda ne kadar iyisin? Doğru/Yanlış ve Net analizlerinle gelişimini grafiklerle takip et.",
            icon: BarChart3,
            color: "text-emerald-500",
            bg: "bg-emerald-50"
        }
    ];

    return (
        <section id="features" className="py-24 lg:py-32 bg-gray-50/50">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto text-center space-y-6 mb-20">
                    <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-gray-900 leading-tight">
                        Eğitimi Geleceğe Taşıyan <br />
                        <span className="text-brand-500">Dijital Yetenekler</span>
                    </h2>
                    <p className="text-lg text-gray-500 font-medium leading-relaxed">
                        Testoloji Akademi, hem öğretmenler hem de öğrenciler için özelleştirilmiş araçlarla
                        eğitimde verimliliği en üst seviyeye çıkarır.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Teacher Column */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-2xl bg-orange-100 text-orange-600">
                                <Users className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">Eğitmenler İçin</h3>
                        </div>

                        <div className="grid gap-6">
                            {teacherFeatures.map((f, i) => (
                                <div key={i} className="group p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 flex gap-6 items-start">
                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform", f.bg)}>
                                        <f.icon className={cn("w-7 h-7", f.color)} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h4>
                                        <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                            {f.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Student Column */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-2xl bg-blue-100 text-blue-600">
                                <GraduationCap className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">Öğrenciler İçin</h3>
                        </div>

                        <div className="grid gap-6">
                            {studentFeatures.map((f, i) => (
                                <div key={i} className="group p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex gap-6 items-start">
                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform", f.bg)}>
                                        <f.icon className={cn("w-7 h-7", f.color)} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h4>
                                        <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                            {f.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection