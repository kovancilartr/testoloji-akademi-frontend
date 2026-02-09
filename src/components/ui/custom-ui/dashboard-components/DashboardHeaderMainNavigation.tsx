"use client"

import { LayoutDashboard, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../../button'
import { PricingDialog } from './PricingDialog'
import { SystemGuideDialog } from './SystemGuideDialog'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'

const DashboardHeaderMainNavigation = () => {
    const { user } = useAuth();
    const pathname = usePathname();

    return (
        <nav className="hidden sm:flex items-center gap-1 shrink-0">
            <Link href="/dashboard">
                <Button variant="ghost" className={`gap-2 h-9 px-4 rounded-lg font-bold transition-all text-xs cursor-pointer ${pathname === '/dashboard' ? 'bg-brand-50 text-brand-600' : 'text-gray-600 hover:bg-brand-50 hover:text-brand-600'}`}>
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden lg:inline">Projelerim</span>
                </Button>
            </Link>
            {!pathname.startsWith('/dashboard/project') && (
                <>
                    <PricingDialog />
                    <SystemGuideDialog />
                    {user?.role === "ADMIN" && (
                        <Link href="/dashboard/admin/users">
                            <Button variant="ghost" className={`gap-2 h-9 px-4 rounded-lg font-bold transition-all text-xs cursor-pointer ${pathname === '/dashboard/admin/users' ? 'bg-brand-50 text-brand-600' : 'text-gray-600 hover:bg-brand-50 hover:text-brand-600'}`}>
                                <Users className="h-4 w-4" />
                                <span className="hidden lg:inline">Kullanıcı Yönetimi</span>
                            </Button>
                        </Link>
                    )}
                </>
            )}
        </nav>
    )
}

export default DashboardHeaderMainNavigation