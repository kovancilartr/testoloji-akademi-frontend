
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FolderOpen,
    GraduationCap,
    Users,
    CalendarDays,
    BookOpenCheck,
    BookOpen,
    Settings,
    LogOut,
    ChevronLeft,
    BarChart3,
    TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserDropdown } from "@/components/ui/custom-ui/dashboard-components/UserDropdown";
import { useThemeColors } from "@/contexts/ThemeContext";
import { NotificationPopover } from "@/components/ui/custom-ui/dashboard-components/NotificationPopover";

interface SidebarProps {
    className?: string;
}

export function AppSidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const colors = useThemeColors();

    const isAdmin = user?.role === "ADMIN";
    const isTeacher = user?.role === "TEACHER";
    const isStudent = user?.role === "STUDENT";

    // Admin Menüsü
    const adminMenuItems = [
        {
            title: "Yönetici Paneli",
            items: [
                {
                    label: "Sistem Özeti",
                    href: "/dashboard/admin",
                    icon: LayoutDashboard,
                },
                {
                    label: "Kullanıcı Yönetimi",
                    href: "/dashboard/admin/users",
                    icon: Users,
                },
                {
                    label: "Kursları Yönet",
                    href: "/dashboard/admin/courses",
                    icon: BookOpen,
                },
                {
                    label: "Ayarlar",
                    href: "/dashboard/admin/settings",
                    icon: Settings,
                },
            ],
        },
    ];

    // Öğretmen Menüsü
    const teacherMenuItems = [
        {
            title: "Öğretmen Paneli",
            items: [
                {
                    label: "Ana Sayfa",
                    href: "/dashboard",
                    icon: LayoutDashboard,
                },
                {
                    label: "Dosyalarım & PDF",
                    href: "/dashboard/projects",
                    icon: FolderOpen,
                },
            ],
        },
        {
            title: "Akademi (Koçluk)",
            items: [
                {
                    label: "Öğrencilerim",
                    href: "/dashboard/academy/students",
                    icon: Users,
                },
                {
                    label: "Öğrenci Analizleri",
                    href: "/dashboard/academy/analytics",
                    icon: TrendingUp,
                },
                {
                    label: "Kurslar & Müfredat",
                    href: "/dashboard/academy/courses",
                    icon: BookOpen,
                },
                {
                    label: "Ders Programı",
                    href: "/dashboard/academy/schedule",
                    icon: CalendarDays,
                },
                {
                    label: "Ödevler",
                    href: "/dashboard/academy/assignments",
                    icon: BookOpenCheck,
                },
            ],
        },
    ];

    // Öğrenci Menüsü
    const studentMenuItems = [
        {
            title: "Öğrenci Paneli",
            items: [
                {
                    label: "Ana Sayfa",
                    href: "/dashboard",
                    icon: LayoutDashboard,
                },
                {
                    label: "Kurslar",
                    href: "/dashboard/student/library",
                    icon: BookOpen,
                },

                {
                    label: "Ders Programım",
                    href: "/dashboard/student/schedule",
                    icon: CalendarDays,
                },
                {
                    label: "Ödevlerim",
                    href: "/dashboard/student/assignments",
                    icon: BookOpenCheck,
                },
                {
                    label: "Analiz Raporlarım",
                    href: "/dashboard/student/analytics",
                    icon: BarChart3,
                },

            ],
        },
    ];

    const menuItems = isAdmin ? adminMenuItems : (isTeacher ? teacherMenuItems : studentMenuItems);

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    return (
        <div
            className={cn(
                "relative flex flex-col h-screen border-r border-gray-200 bg-white transition-all duration-300",
                isCollapsed ? "w-[80px]" : "w-[280px]",
                className
            )}
        >
            {/* Logo Alanı */}
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <Link href="/" className="flex items-center gap-3 overflow-hidden group">
                    <div className="relative w-8 h-8 shrink-0 transition-transform duration-300 group-hover:scale-110">
                        <Image
                            src="/images/logo2.png"
                            alt="Testoloji Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    {!isCollapsed && (
                        <span className="font-black text-xl tracking-tighter text-gray-900 whitespace-nowrap">
                            Testoloji Akademi
                        </span>
                    )}
                </Link>
            </div>

            {/* Menü */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
                {menuItems.map((section, idx) => (
                    <div key={idx} className="space-y-2">
                        {!isCollapsed && (
                            <h4 className="px-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                {section.title}
                            </h4>
                        )}
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                                return (
                                    <Link key={item.href} href={item.href}>
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                "w-full cursor-pointer justify-start h-11 gap-3 rounded-xl transition-all duration-200",
                                                isActive
                                                    ? "bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                                isCollapsed && "justify-center px-0"
                                            )}
                                        >
                                            <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-orange-500" : "text-gray-500")} />
                                            {!isCollapsed && <span className="font-semibold text-sm">{item.label}</span>}
                                        </Button>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Alt Kısım: Profil ve Ayarlar */}
            <div className={cn(
                "p-2 border-t border-gray-100 bg-gray-50/50 flex gap-2",
                isCollapsed ? "flex-col items-center py-6" : "items-center"
            )}>
                <NotificationPopover side="right" align="end" />
                <UserDropdown
                    side="right"
                    align="end"
                    trigger={
                        <div className={cn("flex w-full items-center gap-3 p-2 rounded-xl border border-gray-200 bg-white cursor-pointer hover:bg-gray-50 transition-colors group", isCollapsed && "justify-center border-none p-0 bg-transparent")}>
                            <Avatar className="w-9 h-9 border border-gray-100 shrink-0">
                                <AvatarFallback className="bg-orange-100 text-orange-600 font-bold">
                                    {user?.name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>

                            {!isCollapsed && (
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-bold text-gray-900 truncate">{user?.name || "Kullanıcı"}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate">{user?.tier || "BRONZ"}</p>
                                </div>
                            )}

                            {!isCollapsed && (
                                <div className="text-gray-400 group-hover:text-gray-600">
                                    <Settings className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                    }
                />
            </div>

            {/* Collapse Button (Mobil Harici) - Modern Design */}
            <div className="absolute -right-4 top-8 hidden sm:flex z-50">
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "h-7 w-7  cursor-pointer bg-gradient-to-br shadow-lg border-0 transition-all duration-300 hover:scale-110 active:scale-95",
                        colors.gradient,
                        colors.shadow,
                        "group relative overflow-hidden"
                    )}
                    onClick={toggleCollapse}
                >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity " />

                    <ChevronLeft
                        className={cn(
                            "w-4 h-4 text-white transition-all duration-300 relative z-10",
                            isCollapsed && "rotate-180"
                        )}
                    />
                </Button>
            </div>
        </div>
    );
}
