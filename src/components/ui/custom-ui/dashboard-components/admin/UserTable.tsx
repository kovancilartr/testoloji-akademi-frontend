"use client";

import { UserRow } from "./UserRow";
import { Role, SubscriptionTier } from "@/types/auth";
import { Users, Search } from "lucide-react";

interface UserTableProps {
    users: any[];
    currentUserId?: string;
    onRoleChange: (userId: string, role: Role) => void;
    onTierChange: (userId: string, tier: SubscriptionTier) => void;
    onToggleStatus: (userId: string) => void;
    onDeleteClick: (user: any) => void;
}

export const UserTable = ({
    users,
    currentUserId,
    onRoleChange,
    onTierChange,
    onToggleStatus,
    onDeleteClick
}: UserTableProps) => {
    return (
        <div className="space-y-4">
            {/* Table Header / Column Titles */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-100/50 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest border border-gray-200/50">
                <div className="col-span-3 pl-2">Kullanıcı</div>
                <div className="col-span-2">Rol / Paket</div>
                <div className="col-span-2">Öğretmen / Öğrenci</div>
                <div className="col-span-2">Abonelik</div>
                <div className="col-span-2">Aktivite</div>
                <div className="col-span-1 text-right pr-2">İşlem</div>
            </div>

            {/* Table Content */}
            <div className="space-y-3">
                {users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 mb-1">Kullanıcı Bulunamadı</h3>
                        <p className="text-sm text-gray-500">Aradığınız kriterlere uygun kullanıcı yok.</p>
                    </div>
                ) : (
                    users.map((u) => (
                        <UserRow
                            key={u.id}
                            user={u}
                            currentUserId={currentUserId}
                            onRoleChange={onRoleChange}
                            onTierChange={onTierChange}
                            onToggleStatus={onToggleStatus}
                            onDeleteClick={onDeleteClick}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
