import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react'

const GlobalFooter = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group w-fit">
                            <div className="relative w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                                <Image
                                    src="/images/logo2.png"
                                    alt="Testoloji Logo"
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-black text-2xl tracking-tighter text-gray-900 uppercase">Testoloji</span>
                        </Link>
                        <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-xs">
                            Eğitim süreçlerinizi dijitalleştirin. Yapay zeka destekli analizler ve interaktif içeriklerle geleceğin eğitim teknolojilerini bugünden kullanın.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-brand-50 hover:text-brand-500 transition-all">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-brand-50 hover:text-brand-500 transition-all">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-brand-50 hover:text-brand-500 transition-all">
                                <Linkedin className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div>
                        <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-6">Platform</h4>
                        <ul className="space-y-4 text-sm font-bold text-gray-500">
                            <li><Link href="#features" className="hover:text-brand-500 transition-colors">Özellikler</Link></li>
                            <li><Link href="#pricing" className="hover:text-brand-500 transition-colors">Fiyatlandırma</Link></li>
                            <li><Link href="#" className="hover:text-brand-500 transition-colors">Nasıl Çalışır?</Link></li>
                            <li><Link href="#" className="hover:text-brand-500 transition-colors">SSS</Link></li>
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-6">Kaynaklar</h4>
                        <ul className="space-y-4 text-sm font-bold text-gray-500">
                            <li><Link href="#" className="hover:text-brand-500 transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-brand-500 transition-colors">Kullanım Kılavuzu</Link></li>
                            <li><Link href="#" className="hover:text-brand-500 transition-colors">Destek Merkezi</Link></li>
                            <li><Link href="#" className="hover:text-brand-500 transition-colors">Gizlilik Politikası</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-6">İletişim</h4>
                        <ul className="space-y-4 text-sm font-medium text-gray-500">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                                <span>Teknokent Ofisleri, B Blok No:12<br />İzmir, Türkiye</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                                <a href="tel:+905457983910" className="hover:text-brand-500 transition-colors">+90 545 798 39 10</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-brand-500 shrink-0" />
                                <a href="mailto:info@testoloji.com" className="hover:text-brand-500 transition-colors">info@testoloji.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs font-bold text-gray-400 tracking-wider">
                        © 2026 TESTOLOJİ. Tüm hakları saklıdır.
                    </p>

                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                        <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sistem Aktif</span>
                        </div>
                        <span className="w-px h-3 bg-gray-300 mx-1" />
                        <span className="text-[10px] font-bold text-gray-400">v1.2.0</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default GlobalFooter