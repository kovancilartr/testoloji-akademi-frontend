
"use client";

import { useState } from "react";
import {
    useUsers,
    useUserStats,
    useUpdateUserRole,
    useToggleUserStatus,
    useDeleteUser,
    useToggleCoachingAccess
} from "@/hooks/use-users";
import { useAuth } from "@/contexts/AuthContext";
import { FullPageLoader } from "@/components/ui/custom-ui/FullPageLoader";
import { Role, SubscriptionTier } from "@/types/auth";

// Modular Admin Components
import { AdminHeader } from "@/components/ui/custom-ui/dashboard-components/admin/AdminHeader";
import { AdminStatsBar } from "@/components/ui/custom-ui/dashboard-components/admin/AdminStatsBar";
import { UserTable } from "@/components/ui/custom-ui/dashboard-components/admin/UserTable";
import { SubscriptionDurationDialog } from "@/components/ui/custom-ui/dashboard-components/admin/RoleDurationDialog";
import { DeleteUserDialog } from "@/components/ui/custom-ui/dashboard-components/admin/DeleteUserDialog";
import { UnauthorizedAccess } from "@/components/ui/custom-ui/dashboard-components/admin/UnauthorizedAccess";
import { toast } from "sonner";

export default function AdminUsersPage() {
    const { user: currentUser } = useAuth();
    const { data: users = [], isLoading } = useUsers();
    const { data: stats } = useUserStats();

    const updateMutation = useUpdateUserRole();
    const toggleUserStatus = useToggleUserStatus();
    const toggleCoachingAccess = useToggleCoachingAccess();
    const deleteUser = useDeleteUser();

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("ALL");
    const [tierFilter, setTierFilter] = useState<string>("ALL");

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<{ id: string, name: string | null, email: string } | null>(null);

    // Tier Change States
    const [isTierModalOpen, setIsTierModalOpen] = useState(false);
    const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    if (isLoading) return <FullPageLoader message="Yönetici paneli yükleniyor..." />;

    // Redirect or block if not admin
    if (currentUser?.role !== Role.ADMIN) {
        return <UnauthorizedAccess />;
    }

    const filteredUsers = users.filter((u: any) => {
        const matchesSearch = u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
        const matchesTier = tierFilter === "ALL" || u.tier === tierFilter;

        return matchesSearch && matchesRole && matchesTier;
    });

    const handleDeleteClick = (user: any) => {
        setUserToDelete(user);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            deleteUser.mutate(userToDelete.id, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setUserToDelete(null);
                    toast.success("Kullanıcı başarıyla silindi");
                }
            });
        }
    };

    const handleRoleChange = (userId: string, role: Role) => {
        updateMutation.mutate({ userId, role }, {
            onSuccess: () => toast.success("Kullanıcı rolü güncellendi")
        });
    };

    const handleTierChange = (userId: string, tier: SubscriptionTier) => {
        if (tier === SubscriptionTier.FREE) {
            updateMutation.mutate({ userId, role: tier }, { // Backend maps tier name to updateUserTier
                onSuccess: () => toast.success("Kullanıcı paketi ücretsiz yapıldı")
            });
        } else {
            setSelectedUserId(userId);
            setSelectedTier(tier);
            setIsTierModalOpen(true);
        }
    };

    const confirmTierChange = (duration: 'monthly' | 'yearly') => {
        if (selectedUserId && selectedTier) {
            updateMutation.mutate({
                userId: selectedUserId,
                role: selectedTier, // Passing tier name as 'role' works because backend resolves it
                duration
            }, {
                onSuccess: () => {
                    setIsTierModalOpen(false);
                    setSelectedUserId(null);
                    setSelectedTier(null);
                    toast.success("Kullanıcı paketi tanımlandı");
                }
            });
        }
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-gray-50/50 overflow-hidden">

            <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 space-y-8 custom-scrollbar">
                <AdminHeader
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    roleFilter={roleFilter}
                    onRoleFilterChange={setRoleFilter}
                    tierFilter={tierFilter}
                    onTierFilterChange={setTierFilter}
                />

                <AdminStatsBar stats={stats} />

                <UserTable
                    users={filteredUsers}
                    currentUserId={currentUser?.id}
                    onRoleChange={handleRoleChange}
                    onTierChange={handleTierChange}
                    onToggleStatus={(id) => {
                        toggleUserStatus.mutate(id, {
                            onSuccess: () => toast.success("Kullanıcı durumu güncellendi")
                        });
                    }}
                    onDeleteClick={handleDeleteClick}
                    onToggleCoachingAccess={(userId, currentStatus) => {
                        toggleCoachingAccess.mutate({ userId, hasAccess: !currentStatus }, {
                            onSuccess: () => {
                                toast.success(currentStatus ? "Koçluk yetkisi alındı" : "Koçluk yetkisi verildi");
                            }
                        });
                    }}
                />
            </div>

            {/* Overlays */}
            <SubscriptionDurationDialog
                isOpen={isTierModalOpen}
                onOpenChange={setIsTierModalOpen}
                selectedTier={selectedTier}
                onConfirm={confirmTierChange}
                onCancel={() => {
                    setIsTierModalOpen(false);
                    setSelectedUserId(null);
                    setSelectedTier(null);
                }}
            />

            <DeleteUserDialog
                isOpen={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                userEmail={userToDelete?.email}
                onConfirm={confirmDelete}
                isPending={deleteUser.isPending}
            />
        </div>
    );
}
