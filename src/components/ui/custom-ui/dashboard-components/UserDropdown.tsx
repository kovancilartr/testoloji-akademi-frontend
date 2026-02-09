"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
    User as UserIcon,
    ChevronDown,
    Award,
    Palette,
    Check,
    LogOut,
    Shield,
    Pencil,
    Leaf,
    Settings,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Role } from "@/types/auth";
import { useState } from "react";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { useSettings } from "@/contexts/SettingsContext"; // Added

interface UserDropdownProps {
    trigger?: React.ReactNode;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
}

export function UserDropdown({ trigger, side = "bottom", align = "end" }: UserDropdownProps) {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const { ecoMode, setEcoMode } = useSettings(); // Added
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    const themes = [
        { id: 'orange', name: 'Turuncu', color: 'bg-[#FF6000]' },
        { id: 'blue', name: 'Mavi', color: 'bg-blue-600' },
        { id: 'red', name: 'Kırmızı', color: 'bg-red-600' },
        { id: 'black', name: 'Siyah', color: 'bg-black' },
    ] as const;

    if (!user) return null;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {trigger || (
                        <Button variant="ghost" className="flex items-center gap-3 pl-2 sm:pl-3 h-12 hover:bg-brand-50/50 rounded-xl transition-all group">
                            <div className="text-right hidden xs:block">
                                <div className="text-[10px] font-black text-gray-900 uppercase tracking-tight group-hover:text-brand-600 transition-colors">{user.name}</div>
                                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none group-hover:text-brand-400 transition-colors">{user.role}</div>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 border border-brand-200 group-hover:scale-105 transition-all shadow-sm">
                                <UserIcon className="w-4 h-4" />
                            </div>
                            <ChevronDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-brand-500 transition-all" />
                        </Button>
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align={align} side={side} sideOffset={side === "right" ? 12 : 8} className="w-64 rounded-2xl border-brand-50 shadow-2xl p-2 bg-white/95 backdrop-blur-xl z-[100] animate-in fade-in-0 zoom-in-95 duration-200">
                    <DropdownMenuLabel className="px-3 py-2">
                        <p className="text-[9px] font-black text-brand-500 uppercase tracking-widest">Kullanıcı Hesabı</p>
                    </DropdownMenuLabel>

                    <DropdownMenuItem className="flex items-center justify-between p-3 rounded-xl focus:bg-brand-50 focus:text-brand-600 cursor-default group/item transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600">
                                <UserIcon className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-gray-900 leading-tight">{user.name}</span>
                                <span className="text-[10px] font-medium text-gray-400">{user.email}</span>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsChangePasswordOpen(true);
                            }}
                            className="p-1.5 opacity-0 group-hover/item:opacity-100 bg-white shadow-sm border border-gray-100 rounded-lg text-gray-400 hover:text-brand-600 hover:border-brand-200 transition-all"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-2 bg-gray-50" />

                    {/* Theme Selection */}
                    <div className="px-3 py-2 space-y-3">
                        <div className="flex items-center gap-2">
                            <Palette className="w-3.5 h-3.5 text-gray-400" />
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Görünüm Teması</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id as any)}
                                    className={`group relative flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${theme === t.id
                                        ? 'bg-brand-50 border-brand-200 ring-2 ring-brand-500/20'
                                        : 'bg-gray-50/50 border-transparent hover:border-gray-200'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full ${t.color} shadow-sm border-2 border-white flex items-center justify-center`}>
                                        {theme === t.id && <Check className="w-2.5 h-2.5 text-white" />}
                                    </div>
                                    <span className={`text-[8px] font-bold uppercase tracking-tighter ${theme === t.id ? 'text-brand-600' : 'text-gray-400'}`}>
                                        {t.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <DropdownMenuSeparator className="my-2 bg-gray-50" />

                    {/* System Settings Section */}
                    <div className="px-3 py-2 space-y-3">
                        <div className="flex items-center gap-2">
                            <Settings className="w-3.5 h-3.5 text-gray-400" />
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sistem Ayarları</p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setEcoMode(!ecoMode);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all duration-300 ${ecoMode ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50/50 border-transparent hover:border-gray-200'}`}
                        >
                            <div className="flex items-center gap-2.5">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-300 ${ecoMode ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-gray-100 text-gray-400'}`}>
                                    <Leaf className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex flex-col items-start leading-none">
                                    <span className={`text-[10px] font-black uppercase tracking-tight transition-colors duration-300 ${ecoMode ? 'text-emerald-700' : 'text-gray-700'}`}>Eco Mode</span>
                                    <span className="text-[8px] font-medium text-gray-400">Performans Tasarrufu</span>
                                </div>
                            </div>
                            <div className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${ecoMode ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm ${ecoMode ? 'right-0.5' : 'left-0.5'}`} />
                            </div>
                        </button>
                    </div>

                    <DropdownMenuSeparator className="my-2 bg-gray-50" />

                    {/* Account Type Section */}
                    <div className="px-3 py-2 space-y-2">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Hesap Türü</p>
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${user.tier === 'ALTIN' ? 'bg-yellow-50 border-yellow-100 text-yellow-700' :
                            user.tier === 'GUMUS' ? 'bg-slate-50 border-slate-100 text-slate-700' :
                                user.tier === 'BRONZ' ? 'bg-brand-50 border-brand-100 text-brand-700' :
                                    user.role === Role.ADMIN ? 'bg-purple-50 border-purple-100 text-purple-700' :
                                        'bg-blue-50 border-blue-100 text-blue-700'
                            }`}>
                            <Award className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-tight">
                                {user.tier === 'ALTIN' ? 'Altın Paket' :
                                    user.tier === 'GUMUS' ? 'Gümüş Paket' :
                                        user.tier === 'BRONZ' ? 'Bronz Paket' :
                                            user.role === Role.ADMIN ? 'Yönetici' : 'Standart Hesap'}
                            </span>
                        </div>
                    </div>

                    <DropdownMenuSeparator className="bg-gray-100 mx-1" />

                    {user.role === Role.ADMIN && (
                        <Link href="/dashboard/admin/users">
                            <DropdownMenuItem className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-600 transition-colors group">
                                <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Shield className="h-4 w-4 text-red-600" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black uppercase tracking-wider">Kullanıcı Yönetimi</span>
                                    <span className="text-[10px] font-bold text-red-400 opacity-80">Sistem ayarları & yetkiler</span>
                                </div>
                            </DropdownMenuItem>
                        </Link>
                    )}

                    <DropdownMenuItem
                        onClick={() => logout()}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-gray-100 focus:bg-gray-100 text-gray-700 transition-colors group mt-1"
                    >
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                            <LogOut className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">Güvenli Çıkış</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ChangePasswordModal
                isOpen={isChangePasswordOpen}
                onOpenChange={setIsChangePasswordOpen}
            />
        </>
    );
}

