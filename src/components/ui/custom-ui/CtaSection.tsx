import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const CtaSection = () => {
    return (
        <section className="container mx-auto px-6 pb-20">
            <div className="bg-gray-900 rounded-[3rem] p-12 lg:p-24 text-center space-y-10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-64 h-64 bg-brand-500 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 opacity-20" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3 opacity-20" />

                <h2 className="text-4xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto z-10 relative">
                    Modern Eğitim Yolculuğuna <span className="text-brand-500 underline decoration-8 decoration-brand-500/20 underline-offset-8">Bugün Başlayın.</span>
                </h2>
                <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto z-10 relative leading-relaxed">
                    Yüzlerce kurum ve binlerce eğitmen eğitim süreçlerini Testoloji ile dijitalleştiriyor. Hemen ücretsiz hesabınızı oluşturun.
                </p>
                <div className="z-10 relative pt-4">
                    <Link href="/auth/register">
                        <Button size="lg" className="h-20 px-12 text-xl font-black bg-brand-500 hover:bg-brand-600 text-white rounded-[2rem] shadow-2xl shadow-brand-500/30 group cursor-pointer">
                            Hemen Başla <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default CtaSection