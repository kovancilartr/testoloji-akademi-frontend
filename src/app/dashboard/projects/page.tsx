"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FullPageLoader } from "@/components/ui/custom-ui/FullPageLoader";
import { useProjects } from "@/hooks/use-projects";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_PROJECT_LIMITS, GUEST_LIMITS } from "@/config/limits";
import { Role, SubscriptionTier } from "@/types/auth";
import { getGuestProjects, createGuestProject, deleteGuestProject, GuestProject } from "@/lib/guest-projects";

// Modular Components
import { UpgradeModal } from "@/components/ui/custom-ui/dashboard-components/UpgradeModal";
import { BookMergeDialog } from "@/components/ui/custom-ui/dashboard-components/BookMergeDialog";
import { ProjectStats } from "@/components/ui/custom-ui/dashboard-components/ProjectStats";
import { ProjectCard } from "@/components/ui/custom-ui/dashboard-components/ProjectCard";
import { CreateProjectDialog } from "@/components/ui/custom-ui/dashboard-components/CreateProjectDialog";
import { DeleteProjectDialog } from "@/components/ui/custom-ui/dashboard-components/DeleteProjectDialog";
import { EditProjectDialog } from "@/components/ui/custom-ui/dashboard-components/EditProjectDialog";
import { SelectionFloatingBar } from "@/components/ui/custom-ui/dashboard-components/SelectionFloatingBar";
import { EmptyState } from "@/components/ui/custom-ui/dashboard-components/EmptyState";
import { DashboardSubHeader } from "@/components/ui/custom-ui/dashboard-components/DashboardSubHeader";

export default function DashboardPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Backend projects (only for authenticated users)
    const { data: backendProjects = [], isLoading: projectsLoading } = useProjects();

    // Guest projects state
    const [guestProjects, setGuestProjects] = useState<GuestProject[]>([]);

    // Refresh guest projects from LocalStorage
    const refreshGuestProjects = () => {
        if (!user) {
            setGuestProjects(getGuestProjects());
        }
    };

    // Load guest projects on mount and when user changes or pathname changes
    useEffect(() => {
        refreshGuestProjects();
    }, [user, pathname]);

    // Listen for custom event (when guest data changes)
    useEffect(() => {
        const handleCustomRefresh = () => {
            refreshGuestProjects();
        };

        window.addEventListener('guestProjectsUpdated', handleCustomRefresh);

        return () => {
            window.removeEventListener('guestProjectsUpdated', handleCustomRefresh);
        };
    }, [user]);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
    const [isMergeDialogOpen, setIsMergeDialogOpen] = useState(false);

    // Delete Confirmation State
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<{ id: string, name: string } | null>(null);

    // Edit Project State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState<{ id: string, name: string } | null>(null);

    // Combine projects based on auth status
    const projects = user ? backendProjects : guestProjects;
    const isGuest = !user;

    const handleCreateClick = () => {
        if (isGuest) {
            // Guest limit check
            if (projects.length >= GUEST_LIMITS.projects) {
                setIsUpgradeModalOpen(true);
            } else {
                setIsCreateOpen(true);
            }
        } else {
            // Authenticated user limit check
            const limit = ROLE_PROJECT_LIMITS[user.role];
            if (projects.length >= limit) {
                setIsUpgradeModalOpen(true);
            } else {
                setIsCreateOpen(true);
            }
        }
    };

    const handleDeleteClick = (project: { id: string, name: string }, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setProjectToDelete(project);
        setIsDeleteOpen(true);
    };

    const handleEditClick = (project: { id: string, name: string }, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setProjectToEdit(project);
        setIsEditOpen(true);
    };

    const filteredProjects = projects.filter((p: any) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSelection = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedProjectIds(prev =>
            prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
        );
    };

    const handleSelectionModeToggle = (val: boolean) => {
        setIsSelectionMode(val);
        if (!val) setSelectedProjectIds([]);
    };

    const isLoading = authLoading || (user && projectsLoading);

    if (isLoading) return <FullPageLoader message="Klasörleriniz hazırlanıyor..." />;

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-gray-50/50 overflow-hidden relative">
            <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 space-y-8 custom-scrollbar">
                {/* Header & Stats Bar */}
                <div className="flex flex-col gap-8">
                    <DashboardSubHeader
                        projectsCount={projects.length}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        handleCreateClick={handleCreateClick}
                        isSelectionMode={isSelectionMode}
                        setIsSelectionMode={handleSelectionModeToggle}
                    />

                    <ProjectStats projects={projects} userRole={user?.role} isGuest={!user} />
                </div>

                {/* Projects Grid */}
                <div className="space-y-5">
                    <div className="flex items-center gap-3 px-1">
                        <div className="w-1 h-5 bg-brand-500 rounded-full" />
                        <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">
                            {isSelectionMode ? 'Kitap İçin Dosya Seçin' : 'Tüm Dosyalar'}
                        </h2>
                    </div>

                    <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 pb-32">
                        {filteredProjects.length === 0 ? (
                            <EmptyState searchTerm={searchTerm} />
                        ) : (
                            filteredProjects.map((project: any) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    isSelectionMode={isSelectionMode}
                                    isSelected={selectedProjectIds.includes(project.id)}
                                    onToggleSelection={toggleSelection}
                                    onDeleteClick={handleDeleteClick}
                                    onEditClick={handleEditClick}
                                    onClick={() => router.push(`/dashboard/project/${project.id}`)}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Selection Bar */}
            <SelectionFloatingBar
                selectedCount={selectedProjectIds.length}
                onClear={() => setSelectedProjectIds([])}
                onMergeOpen={() => setIsMergeDialogOpen(true)}
            />

            {/* Dialogs */}
            <CreateProjectDialog
                isOpen={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onProjectCreated={() => {
                    refreshGuestProjects();
                }}
            />

            <DeleteProjectDialog
                isOpen={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                projectToDelete={projectToDelete}
                onProjectDeleted={() => {
                    refreshGuestProjects();
                }}
            />

            <EditProjectDialog
                isOpen={isEditOpen}
                onOpenChange={setIsEditOpen}
                project={projectToEdit}
                onProjectUpdated={() => {
                    refreshGuestProjects();
                }}
            />


            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onOpenChange={setIsUpgradeModalOpen}
                title={isGuest ? "Misafir Limitine Ulaşıldı" : "Proje Limitine Ulaşıldı"}
                description={
                    isGuest
                        ? `Misafir kullanıcılar en fazla ${GUEST_LIMITS.projects} proje oluşturabilir. Daha fazla proje için ücretsiz üye olun!`
                        : `Mevcut paketinizle en fazla ${ROLE_PROJECT_LIMITS[user!.role]} proje oluşturabilirsiniz.`
                }
                currentRole={user?.tier || SubscriptionTier.FREE}
            />

            <BookMergeDialog
                isOpen={isMergeDialogOpen}
                onOpenChange={setIsMergeDialogOpen}
                selectedProjectIds={selectedProjectIds}
                projects={projects}
            />
        </div>
    );
}
