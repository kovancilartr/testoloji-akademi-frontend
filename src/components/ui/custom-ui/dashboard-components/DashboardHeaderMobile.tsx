"use client";
import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '../../sheet'
import { Button } from '../../button'
import { LayoutDashboard, Menu, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { PricingDialog } from './PricingDialog'
import { SystemGuideDialog } from './SystemGuideDialog'
import { usePathname } from 'next/navigation'

interface DashboardHeaderMobileProps {
    // Editor specific props (only used in project page)
    isProjectPage?: boolean;
    editorActions?: {
        imageUploadDialog?: React.ReactNode;
        pdfCropper?: React.ReactNode;
        questionEditor?: React.ReactNode;
    }
}

const DashboardHeaderMobile = ({ isProjectPage = false, editorActions }: DashboardHeaderMobileProps) => {
    const pathname = usePathname();
    return (
        <>
            {/* Mobile Menu Trigger */}
            <div className="sm:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-gray-50">
                            <Menu className="h-5 w-5 text-gray-500" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[280px] p-0 border-none bg-white">
                        <div className="flex flex-col h-full bg-white">
                            <SheetHeader className="p-6 border-b border-gray-50">
                                {/* Hidden Title for Accessibility compliance */}
                                <SheetTitle className="sr-only">Navigasyon Menüsü</SheetTitle>
                                <SheetDescription className="sr-only">Mobil Menü ve Navigasyon</SheetDescription>

                                {/* Visual Header Content */}
                                <div className="flex items-center gap-3">
                                    <div className="relative w-8 h-8">
                                        <Image src="/images/logo2.png" alt="Logo" fill className="object-contain" />
                                    </div>
                                    <span className="font-black text-xl tracking-tighter text-gray-900">TESTOLOJİ</span>
                                </div>
                            </SheetHeader>

                            <div className="flex-1 overflow-y-auto">
                                <div className="px-2 py-2">
                                    <Link href="/dashboard">
                                        <Button variant="ghost" className={`w-full justify-start gap-4 h-12 rounded-2xl font-black text-xs uppercase tracking-widest ${pathname === '/dashboard' ? 'bg-brand-50 text-brand-600' : 'text-gray-500'}`}>
                                            <LayoutDashboard className="h-4 w-4" />
                                            Projelerim
                                        </Button>
                                    </Link>
                                </div>

                                {isProjectPage && editorActions && (
                                    <div className="px-2 py-2 border-t border-gray-50 pt-4">
                                        <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 px-2">Proje Araçları</div>
                                        <div className="flex flex-col gap-2 px-2 mobile-menu-tools">
                                            {editorActions.imageUploadDialog}
                                            {editorActions.pdfCropper}
                                            {editorActions.questionEditor}
                                        </div>
                                    </div>
                                )}

                                <div className="px-2 py-4 border-t border-gray-50 sm:border-none">
                                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4 px-2">Hızlı Menü</div>
                                    <div className="space-y-1">
                                        <PricingDialog isMobile />
                                        <SystemGuideDialog isMobile />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    )
}

export default DashboardHeaderMobile