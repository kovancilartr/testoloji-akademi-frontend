"use client";

import { useState } from "react";
import {
    Shield, Crown, Star, Zap, Calendar,
    CheckCircle2, XCircle, MoreHorizontal, Trash2,
    Users, UserCog, GraduationCap, BrainCircuit,
    Settings2, Edit3, Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Role, SubscriptionTier } from "@/types/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { QuickRoleDialog } from "./QuickRoleDialog";
import { QuickTierDialog } from "./QuickTierDialog";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface UserRowProps {
    user: any;
    currentUserId?: string;
    onRoleChange: (userId: string, role: Role) => void;
    onTierChange: (userId: string, tier: SubscriptionTier) => void;
    onToggleStatus: (userId: string) => void;
    onDeleteClick: (user: any) => void;
    onToggleCoachingAccess: (userId: string, currentStatus: boolean) => void;
}

export const UserRow = ({
    user,
    currentUserId,
    onRoleChange,
    onTierChange,
    onToggleStatus,
    onDeleteClick,
    onToggleCoachingAccess,
}: UserRowProps) => {
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isTierModalOpen, setIsTierModalOpen] = useState(false);
    const [isEditingLimit, setIsEditingLimit] = useState(false);
    const [aiLimitValue, setAiLimitValue] = useState<number>(user.dailyAiLimit || 10);
    const [isSavingLimit, setIsSavingLimit] = useState(false);

    const getRoleBadge = (role: Role) => {
        switch (role) {
            case Role.ADMIN:
                return (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-[9px] font-black rounded-lg uppercase tracking-widest border border-red-100 max-w-fit">
                        <Shield className="h-3 w-3" /> Yönetici
                    </div>
                );
            case Role.TEACHER:
                return (
                    <div className="flex flex-col gap-1 max-w-fit">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 text-[9px] font-black rounded-lg uppercase tracking-widest border border-blue-100">
                            <UserCog className="h-3 w-3" /> Eğitmen
                        </div>
                        {user.hasCoachingAccess && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-600 text-[8px] font-black rounded-lg uppercase tracking-widest border border-purple-100">
                                <Crown className="h-2.5 w-2.5" /> Koç
                            </div>
                        )}
                    </div>
                );
            case Role.STUDENT:
                return (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-lg uppercase tracking-widest border border-emerald-100 max-w-fit">
                        <GraduationCap className="h-3 w-3" /> Öğrenci
                    </div>
                );
            default:
                return (
                    <div className="px-3 py-1.5 bg-gray-50 text-gray-500 text-[9px] font-black rounded-lg uppercase tracking-widest border border-gray-100 text-center max-w-fit">Belirsiz</div>
                );
        }
    };

    const getTierBadge = (tier: SubscriptionTier) => {
        switch (tier) {
            case SubscriptionTier.ALTIN:
                return (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 text-[9px] font-black rounded-lg uppercase tracking-widest border border-amber-100 max-w-fit">
                        <Crown className="h-3 w-3" /> Altın
                    </div>
                );
            case SubscriptionTier.GUMUS:
                return (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 text-[9px] font-black rounded-lg uppercase tracking-widest border border-slate-200 max-w-fit">
                        <Star className="h-3 w-3" /> Gümüş
                    </div>
                );
            case SubscriptionTier.BRONZ:
                return (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 text-[9px] font-black rounded-lg uppercase tracking-widest border border-orange-100 max-w-fit">
                        <Zap className="h-3 w-3" /> Bronz
                    </div>
                );
            default:
                return (
                    <div className="px-3 py-1.5 bg-gray-50 text-gray-400 text-[9px] font-black rounded-lg uppercase tracking-widest border border-gray-100 text-center max-w-fit">Ücretsiz</div>
                );
        }
    };

    const renderTeacherInfo = () => {
        if (user.role === Role.STUDENT && user.teacher) {
            return (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50/50 rounded-xl border border-blue-100/50 hover:bg-blue-50 transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <UserCog className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-blue-900 truncate">{user.teacher.name || "İsimsiz Öğretmen"}</span>
                        <span className="text-[9px] font-medium text-blue-500 uppercase tracking-wide">Öğretmeni</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    const renderStudentCount = () => {
        if (user.role === Role.TEACHER) {
            const studentCount = user._count?.students || 0;
            return (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50/50 rounded-xl border border-emerald-100/50 hover:bg-emerald-50 transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <GraduationCap className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-lg font-black text-emerald-900 leading-none">{studentCount}</span>
                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wide">Öğrenci</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <div className="group grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-4 px-4 lg:px-6 py-4 lg:py-2.5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:bg-white transition-all duration-300 items-center relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-gray-50/50 via-white to-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Mobile Header: Avatar + Info + Dropdown */}
                <div className="col-span-1 lg:col-span-3 flex items-center justify-between lg:justify-start gap-4 relative z-10 w-full">
                    <div className="flex items-center gap-3 lg:gap-4 min-w-0">
                        <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl lg:rounded-2xl bg-linear-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center font-black text-gray-500 shadow-sm shrink-0 uppercase group-hover:scale-110 group-hover:shadow-md transition-all">
                            {(user.name?.[0] || user.email[0])}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-black text-gray-900 truncate text-sm leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">{user.name || "İsimsiz Kullanıcı"}</span>
                            <span className="text-[10px] font-bold text-gray-400 truncate">{user.email}</span>
                        </div>
                    </div>

                    {/* Mobile Only: Dropdown Trigger at Top Right */}
                    <div className="lg:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-gray-50 text-gray-400">
                                    <MoreHorizontal className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <UserActionsMenu
                                user={user}
                                currentUserId={currentUserId}
                                onToggleStatus={onToggleStatus}
                                onDeleteClick={onDeleteClick}
                                onToggleCoachingAccess={onToggleCoachingAccess}
                                onOpenRoleModal={() => setIsRoleModalOpen(true)}
                                onOpenTierModal={() => setIsTierModalOpen(true)}
                            />
                        </DropdownMenu>
                    </div>
                </div>

                {/* Desktop/Mobile Grid for Details */}
                <div className="col-span-1 lg:col-span-6 grid grid-cols-2 lg:grid-cols-6 gap-3 lg:gap-4 items-center relative z-10">
                    {/* Roles & Tiers */}
                    <div className="col-span-2 lg:col-span-2 flex flex-row flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1 group/role shrink-0">
                            {getRoleBadge(user.role)}
                            {user.role !== Role.ADMIN && (
                                <button
                                    onClick={() => setIsRoleModalOpen(true)}
                                    className="h-5 w-5 rounded-md lg:opacity-0 group-hover/role:opacity-100 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 text-gray-400 hover:text-blue-600 transition-all flex items-center justify-center -ml-0.5"
                                >
                                    <Settings2 className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-1 group/tier shrink-0">
                            {getTierBadge(user.tier)}
                            {user.role !== Role.ADMIN && (
                                <button
                                    onClick={() => setIsTierModalOpen(true)}
                                    className="h-5 w-5 rounded-md lg:opacity-0 group-hover/tier:opacity-100 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 text-gray-400 hover:text-amber-600 transition-all flex items-center justify-center -ml-0.5"
                                >
                                    <Zap className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Teacher/Student Rel */}
                    <div className="col-span-2 lg:col-span-2">
                        {renderTeacherInfo() || renderStudentCount() || (
                            <span className="text-xs font-medium text-gray-300 italic px-2 hidden lg:block">-</span>
                        )}
                    </div>

                    {/* Subscription Stat */}
                    <div className="col-span-1 lg:col-span-2">
                        {user.tier !== SubscriptionTier.FREE && user.role !== Role.ADMIN && user.subscriptionExpires ? (
                            <div className="flex flex-col gap-0.5 ml-0 lg:ml-2">
                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-600">
                                    <Calendar className="h-2.5 w-2.5 text-blue-500" />
                                    {new Date(user.subscriptionExpires).toLocaleDateString("tr-TR")}
                                </div>
                                {(() => {
                                    const remainingDays = Math.ceil((new Date(user.subscriptionExpires).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                    return (
                                        <span className={cn(
                                            "text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md w-fit border",
                                            remainingDays <= 3
                                                ? 'text-red-600 bg-red-50 border-red-100 animate-pulse'
                                                : 'text-green-600 bg-green-50 border-green-100'
                                        )}>
                                            {remainingDays > 0 ? `${remainingDays} G.` : 'S.Doldu'}
                                        </span>
                                    );
                                })()}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 lg:pl-2">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                    {user.role === Role.ADMIN ? "Süresiz" : "LİMİT YOK"}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Activity Score (Combined for Mobile) */}
                    <div className="col-span-1 lg:hidden border-l border-gray-100 pl-3">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-gray-900">{user._count?.projects || 0}</span>
                                <div className={cn("w-1.5 h-1.5 rounded-full", user.isActive ? "bg-green-500" : "bg-red-500")} />
                            </div>
                            <span className="text-[8px] font-bold uppercase tracking-tight text-gray-400">Proje Aktivitesi</span>
                        </div>
                    </div>
                </div>

                {/* Only Desktop Activity Column */}
                <div className="hidden lg:col-span-1 lg:flex items-center justify-between px-3 border-x border-gray-50/50 py-1 relative z-10">
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-gray-900 leading-tight">{user._count?.projects || 0}</span>
                        <span className="text-[8px] font-bold uppercase tracking-tighter text-gray-400">Proje</span>
                    </div>
                    <div
                        className={cn(
                            "w-2 h-2 rounded-full shrink-0",
                            user.isActive
                                ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]"
                                : "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]"
                        )}
                    />
                </div>

                {/* Desktop Actions / Mobile Bottom Full-width Action */}
                <div className="col-span-1 lg:col-span-2 flex items-center justify-end lg:justify-end gap-2 relative z-10 w-full mt-2 lg:mt-0">
                    {user.role === Role.STUDENT && (
                        <div className="flex items-center gap-1.5">
                            <Button
                                asChild
                                variant="ghost"
                                className="h-10 lg:h-8 px-4 lg:px-2.5 rounded-xl lg:rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white transition-all shadow-sm gap-2 font-bold text-[10px] lg:text-[9px] uppercase tracking-wider border border-purple-100/50 flex-1 lg:flex-none"
                            >
                                <Link href={`/dashboard/admin/users/${user.id}/ai-stats`}>
                                    <BrainCircuit className="h-4 w-4 lg:h-3.5 lg:w-3.5 shrink-0" />
                                    Ai Detayları
                                </Link>
                            </Button>

                            {/* AI Günlük Limit */}
                            {isEditingLimit ? (
                                <div className="flex items-center gap-1 bg-indigo-50 rounded-lg border border-indigo-200 px-2 py-1">
                                    <Bot className="h-3 w-3 text-indigo-500 shrink-0" />
                                    <input
                                        type="number"
                                        min={1}
                                        max={100}
                                        value={aiLimitValue}
                                        onChange={(e) => setAiLimitValue(parseInt(e.target.value) || 1)}
                                        className="w-10 h-6 text-center text-xs font-bold bg-white rounded border border-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                        autoFocus
                                    />
                                    <button
                                        disabled={isSavingLimit}
                                        onClick={async () => {
                                            setIsSavingLimit(true);
                                            try {
                                                await api.patch(`/coaching/daily-limit/${user.id}`, { limit: aiLimitValue });
                                                toast.success(`Günlük AI limiti ${aiLimitValue} olarak ayarlandı`);
                                                setIsEditingLimit(false);
                                            } catch (e) {
                                                toast.error('Limit güncellenemedi');
                                            } finally {
                                                setIsSavingLimit(false);
                                            }
                                        }}
                                        className="h-5 w-5 rounded bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors"
                                    >
                                        <CheckCircle2 className="h-3 w-3" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditingLimit(false);
                                            setAiLimitValue(user.dailyAiLimit || 10);
                                        }}
                                        className="h-5 w-5 rounded bg-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-300 transition-colors"
                                    >
                                        <XCircle className="h-3 w-3" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsEditingLimit(true)}
                                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors border border-indigo-100/50 text-[9px] font-bold uppercase tracking-wider"
                                    title="Günlük AI kullanım limitini ayarla"
                                >
                                    <Bot className="h-3 w-3" />
                                    {user.dailyAiLimit || 10}/gün
                                </button>
                            )}
                        </div>
                    )}

                    <div className="hidden lg:block">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all shrink-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <UserActionsMenu
                                user={user}
                                currentUserId={currentUserId}
                                onToggleStatus={onToggleStatus}
                                onDeleteClick={onDeleteClick}
                                onToggleCoachingAccess={onToggleCoachingAccess}
                                onOpenRoleModal={() => setIsRoleModalOpen(true)}
                                onOpenTierModal={() => setIsTierModalOpen(true)}
                            />
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <QuickRoleDialog
                isOpen={isRoleModalOpen}
                onOpenChange={setIsRoleModalOpen}
                currentRole={user.role}
                userName={user.name || user.email}
                onConfirm={(role) => {
                    onRoleChange(user.id, role);
                    setIsRoleModalOpen(false);
                }}
            />

            <QuickTierDialog
                isOpen={isTierModalOpen}
                onOpenChange={setIsTierModalOpen}
                currentTier={user.tier}
                userName={user.name || user.email}
                onConfirm={(tier) => {
                    onTierChange(user.id, tier);
                    setIsTierModalOpen(false);
                }}
            />
        </>
    );
};

// Isolated Dropdown Content for reuse
const UserActionsMenu = ({
    user,
    currentUserId,
    onToggleStatus,
    onDeleteClick,
    onToggleCoachingAccess,
    onOpenRoleModal,
    onOpenTierModal
}: any) => (
    <DropdownMenuContent align="end" className="w-64 rounded-2xl border-none shadow-2xl p-2 bg-white">
        <div className="px-3 py-2 bg-gray-50/50 rounded-xl mb-1 border border-gray-50">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Kullanıcı Yönetimi</p>
            <p className="text-xs font-bold text-gray-900 truncate">{user.name || user.email}</p>
        </div>

        <DropdownMenuLabel className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-3 py-1.5 mt-1 ml-1">Hızlı Ayarlar</DropdownMenuLabel>

        <DropdownMenuItem onClick={onOpenRoleModal} className="rounded-xl flex items-center gap-2 font-bold focus:bg-blue-50 focus:text-blue-600 cursor-pointer text-xs py-2 transition-colors">
            <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center"><UserCog className="h-3.5 w-3.5 text-blue-600" /></div> Sistemi Rolü Değiştir
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onOpenTierModal} className="rounded-xl flex items-center gap-2 font-bold focus:bg-amber-50 focus:text-amber-600 cursor-pointer text-xs py-2 transition-colors">
            <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center"><Crown className="h-3.5 w-3.5 text-amber-600" /></div> Paket İşlemleri
        </DropdownMenuItem>

        {user.role === Role.TEACHER && (
            <>
                <DropdownMenuSeparator className="bg-gray-50 mx-1 my-1" />
                <DropdownMenuItem onClick={() => onToggleCoachingAccess(user.id, user.hasCoachingAccess)} className="rounded-xl flex items-center gap-2 font-bold focus:bg-purple-50 focus:text-purple-600 cursor-pointer text-xs py-2 transition-colors">
                    <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center border border-purple-100/50"><Crown className="h-3.5 w-3.5 text-purple-600" /></div>
                    {user.hasCoachingAccess ? "Koçluk Yetkisini Al" : "Koçluk Yetkisi Ver"}
                </DropdownMenuItem>
            </>
        )}

        <DropdownMenuSeparator className="bg-gray-50 mx-1 my-1" />

        <DropdownMenuItem
            onClick={() => onToggleStatus(user.id)}
            disabled={currentUserId === user.id}
            className={cn(
                "rounded-xl flex items-center gap-2 font-bold cursor-pointer text-xs py-2 transition-colors",
                user.isActive ? 'text-orange-600 focus:bg-orange-50 focus:text-orange-700' : 'text-green-600 focus:bg-green-50 focus:text-green-700'
            )}
        >
            <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center", user.isActive ? "bg-orange-100" : "bg-green-100")}>
                {user.isActive ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
            </div>
            {user.isActive ? "Hesabı Dondur" : "Hesabı Aktifleştir"}
        </DropdownMenuItem>

        <DropdownMenuItem
            onClick={() => onDeleteClick(user)}
            disabled={currentUserId === user.id}
            className="rounded-xl flex items-center gap-2 font-bold text-red-500 focus:bg-red-50 focus:text-red-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs py-2 mt-1 transition-colors"
        >
            <div className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center"><Trash2 className="h-3.5 w-3.5" /></div> Hesabı Sil
        </DropdownMenuItem>
    </DropdownMenuContent>
);
