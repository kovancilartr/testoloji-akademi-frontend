"use client";

import {
    Shield, Crown, Star, Zap, Calendar,
    CheckCircle2, XCircle, MoreHorizontal, Trash2,
    Users, UserCog, GraduationCap
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
    onToggleCoachingAccess
}: UserRowProps) => {
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

    // Öğrenci ise öğretmen bilgisini göster
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

    // Öğretmen ise öğrenci sayısını göster
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
        <div className="group lg:grid lg:grid-cols-12 gap-4 px-6 py-4 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:bg-white transition-all duration-300 items-center relative overflow-hidden">
            {/* Hover Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 via-white to-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* Profile */}
            <div className="col-span-12 lg:col-span-3 flex items-center gap-4 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center font-black text-gray-500 shadow-sm shrink-0 uppercase group-hover:scale-110 group-hover:shadow-md transition-all">
                    {(user.name?.[0] || user.email[0])}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="font-black text-gray-900 truncate text-sm leading-tight group-hover:text-blue-600 transition-colors">{user.name || "İsimsiz Kullanıcı"}</span>
                    <span className="text-[10px] font-bold text-gray-400 truncate">{user.email}</span>
                </div>
            </div>

            {/* Role & Tier */}
            <div className="col-span-12 lg:col-span-2 flex flex-row lg:flex-col gap-2 relative z-10">
                {getRoleBadge(user.role)}
                {getTierBadge(user.tier)}
            </div>

            {/* Teacher / Student Info */}
            <div className="col-span-12 lg:col-span-2 relative z-10">
                {renderTeacherInfo() || renderStudentCount() || (
                    <span className="text-xs font-medium text-gray-300 italic px-2">-</span>
                )}
            </div>

            {/* Subscription */}
            <div className="col-span-12 lg:col-span-2 relative z-10">
                {user.tier !== SubscriptionTier.FREE && user.role !== Role.ADMIN && user.subscriptionExpires ? (
                    <div className="flex flex-col gap-1.5 ml-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-700">
                            <Calendar className="h-3 w-3 text-blue-500" />
                            {new Date(user.subscriptionStarted!).toLocaleDateString("tr-TR")} - {new Date(user.subscriptionExpires).toLocaleDateString("tr-TR")}
                        </div>
                        {(() => {
                            const remainingDays = Math.ceil((new Date(user.subscriptionExpires).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                            return (
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md w-fit border",
                                    remainingDays <= 3
                                        ? 'text-red-600 bg-red-50 border-red-100 animate-pulse'
                                        : 'text-green-600 bg-green-50 border-green-100'
                                )}>
                                    {remainingDays > 0 ? `${remainingDays} Gün Kaldı` : 'Süresi Doldu'}
                                </span>
                            );
                        })()}
                    </div>
                ) : (
                    <div className="flex items-center gap-2 pl-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                            {user.role === Role.ADMIN ? "Süresiz" : "Limit Yok"}
                        </span>
                    </div>
                )}
            </div>

            {/* Activity & Date */}
            <div className="col-span-12 lg:col-span-2 relative z-10">
                <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                    <div className="flex flex-col items-center min-w-[50px] gap-0.5">
                        <span className="text-lg font-black text-gray-900 leading-none">{user._count?.projects || 0}</span>
                        <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400">Proje</span>
                    </div>
                    <div className="w-px h-8 bg-gray-100" />
                    <div>
                        {user.isActive ? (
                            <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                                <CheckCircle2 className="h-3 w-3" />
                                <span className="text-[9px] font-black uppercase tracking-tight">Aktif</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2 py-1 rounded-lg border border-red-100">
                                <XCircle className="h-3 w-3" />
                                <span className="text-[9px] font-black uppercase tracking-tight">Pasif</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="col-span-12 lg:col-span-1 flex justify-end relative z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all">
                            <MoreHorizontal className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 rounded-2xl border-none shadow-2xl p-2 bg-white">
                        <div className="px-3 py-2 bg-gray-50/50 rounded-xl mb-1 border border-gray-50">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Kullanıcı Yönetimi</p>
                            <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                        </div>

                        <DropdownMenuLabel className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-3 py-1.5 mt-1 ml-1">Paket İşlemleri</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onTierChange(user.id, SubscriptionTier.BRONZ)} className="rounded-xl flex items-center gap-2 font-bold focus:bg-orange-50 focus:text-orange-600 cursor-pointer text-xs py-2">
                            <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center"><Zap className="h-3.5 w-3.5" /></div> Bronz Paket
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onTierChange(user.id, SubscriptionTier.GUMUS)} className="rounded-xl flex items-center gap-2 font-bold focus:bg-slate-100 focus:text-slate-600 cursor-pointer text-xs py-2">
                            <div className="w-6 h-6 rounded-lg bg-slate-200 flex items-center justify-center"><Star className="h-3.5 w-3.5" /></div> Gümüş Paket
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onTierChange(user.id, SubscriptionTier.ALTIN)} className="rounded-xl flex items-center gap-2 font-bold focus:bg-amber-50 focus:text-amber-600 cursor-pointer text-xs py-2">
                            <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center"><Crown className="h-3.5 w-3.5" /></div> Altın Paket
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onTierChange(user.id, SubscriptionTier.FREE)} className="rounded-xl flex items-center gap-2 font-bold focus:bg-gray-100 focus:text-gray-600 cursor-pointer text-xs py-2">
                            <div className="w-6 h-6 rounded-lg bg-gray-200 flex items-center justify-center"><Users className="h-3.5 w-3.5" /></div> Ücretsiz Paket
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-gray-50 mx-1 my-1" />

                        <DropdownMenuLabel className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-3 py-1.5 ml-1">Sistem Rolü</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onRoleChange(user.id, Role.TEACHER)} className="rounded-xl flex items-center gap-2 font-bold focus:bg-blue-50 focus:text-blue-600 cursor-pointer text-xs py-2">
                            <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center"><UserCog className="h-3.5 w-3.5" /></div> Eğitmen Yap
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onRoleChange(user.id, Role.STUDENT)} className="rounded-xl flex items-center gap-2 font-bold focus:bg-emerald-50 focus:text-emerald-600 cursor-pointer text-xs py-2">
                            <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center"><GraduationCap className="h-3.5 w-3.5" /></div> Öğrenci Yap
                        </DropdownMenuItem>

                        {user.role === Role.TEACHER && (
                            <>
                                <DropdownMenuSeparator className="bg-gray-50 mx-1 my-1" />
                                <DropdownMenuItem onClick={() => onToggleCoachingAccess(user.id, user.hasCoachingAccess)} className="rounded-xl flex items-center gap-2 font-bold focus:bg-purple-50 focus:text-purple-600 cursor-pointer text-xs py-2">
                                    <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center"><Crown className="h-3.5 w-3.5" /></div>
                                    {user.hasCoachingAccess ? "Koçluk Yetkisini Al" : "Koçluk Yetkisi Ver"}
                                </DropdownMenuItem>
                            </>
                        )}
                        <DropdownMenuSeparator className="bg-gray-50 mx-1 my-1" />


                        <DropdownMenuItem
                            onClick={() => onToggleStatus(user.id)}
                            disabled={currentUserId === user.id}
                            className={cn(
                                "rounded-xl flex items-center gap-2 font-bold cursor-pointer text-xs py-2",
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
                            className="rounded-xl flex items-center gap-2 font-bold text-red-500 focus:bg-red-50 focus:text-red-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs py-2 mt-1"
                        >
                            <div className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center"><Trash2 className="h-3.5 w-3.5" /></div> Hesabı Sil
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};
