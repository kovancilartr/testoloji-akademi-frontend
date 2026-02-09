import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const GlobalFooter = () => {
    return (
        <>
            <footer className="py-20 bg-white border-t border-gray-50">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="flex flex-col items-center md:items-start gap-2 border p-2 border-gray-100 rounded-lg shadow-sm scale-95 hover:scale-100 transition-transform duration-300 cursor-pointer">
                            <div className="flex items-center gap-2.5">
                                <div className="relative w-10 h-10 group-hover:scale-110 transition-transform">
                                    <Image
                                        src="/images/logo2.png"
                                        alt="Testoloji Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <span className="font-black text-2xl tracking-tighter text-gray-900 uppercase">Testoloji</span>
                            </div>
                            <p className="max-w-xs text-center md:text-left text-sm font-bold text-gray-400 leading-relaxed  tracking-wider">
                                Eğitimciler için dijital soru bankası ve test oluşturma çözümü.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-10 text-sm font-black text-gray-500 tracking-widest">
                            <Link href="#" className="hover:text-brand-500 transition-colors">KVKK</Link>
                            <Link href="#" className="hover:text-brand-500 transition-colors">Şartlar</Link>
                            <a
                                href={`https://wa.me/905457983910?text=${encodeURIComponent("Merhaba, Testoloji hakkında bilgi almak istiyorum.")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-brand-500 transition-colors cursor-pointer"
                            >
                                İletişim
                            </a>
                        </div>
                    </div>
                    <div className="mt-20 pt-10 border-t border-gray-50 flex flex-col items-center gap-4">
                        <div className="text-center text-xs font-black text-gray-300 tracking-[0.2em] cursor-pointer">
                            © 2026 TESTOLOJİ <span className='text-brand-500'>Kovancılar Yazılım</span> Tarafından Geliştirilmiştir.
                        </div>
                        <div className="flex items-center gap-4 text-[9px] font-black text-gray-400 uppercase cursor-pointer tracking-widest bg-gray-50/50 px-4 py-1.5 rounded-full border border-gray-100/50">
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
                                Frontend: v0.5.4
                            </span>
                            <span className="w-px h-2 bg-gray-200" />
                            <span>Backend: v1.2.0</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default GlobalFooter