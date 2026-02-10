import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../button'
import { ArrowRight } from 'lucide-react'
import { SystemGuideDialog } from './dashboard-components/SystemGuideDialog'
import { UserDropdown } from './dashboard-components/UserDropdown'
import { Role } from '@/types/auth'


interface GlobalHeaderProps {
    isAuthenticated: boolean;
}

const GlobalHeader = ({ isAuthenticated }: GlobalHeaderProps) => {
    return (
        <>
            <header className="fixed top-0 w-full bg-white/70 backdrop-blur-xl border-b border-gray-100 z-50">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="relative w-10 h-10 group-hover:scale-110 transition-transform drop-shadow-lg">
                            <Image
                                src="/images/logo2.png"
                                alt="Testoloji Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-black text-2xl tracking-tighter text-gray-900 uppercase">Testoloji</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
                        <Link href="#features" className="hover:text-brand-500 transition-colors">Özellikler</Link>
                        <Link href="#pricing" className="hover:text-brand-500 transition-colors">Fiyatlandırma</Link>
                        <SystemGuideDialog />

                        <div className="flex items-center gap-4">
                            <Link href="/dashboard">
                                <Button className="bg-brand-500 cursor-pointer hover:bg-brand-600 text-white rounded-xl px-6 h-11 font-black shadow-xl shadow-brand-500/20 group">
                                    {isAuthenticated ? 'İçerik Merkezi' : 'Döküman Oluştur'} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>

                            {isAuthenticated ? (
                                <>
                                    <div className="h-8 w-px bg-gray-100 mx-1" />
                                    <UserDropdown />
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login" className="hover:text-brand-500 transition-colors">Giriş Yap / Kayıt Ol</Link>
                                </>
                            )}
                        </div>
                    </nav>

                    <div className="md:hidden flex items-center gap-2">
                        <Link href="/dashboard">
                            <Button className="bg-brand-500 hover:bg-brand-600 text-white rounded-lg px-4 h-9 text-xs font-black shadow-lg">
                                {isAuthenticated ? 'Panel' : 'Dene'}
                            </Button>
                        </Link>

                        {isAuthenticated ? (
                            <UserDropdown />
                        ) : (
                            <Link href="/auth/login">
                                <Button variant="ghost" size="sm" className="font-bold">Giriş</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>
        </>
    )
}

export default GlobalHeader