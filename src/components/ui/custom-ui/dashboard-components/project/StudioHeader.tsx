"use client";

import { Sparkles, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PreviewDialog } from "@/components/ui/custom-ui/dashboard-components/PreviewDialog";
import { SettingsDialog } from "@/components/ui/custom-ui/dashboard-components/SettingsDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateProjectSettings } from "@/hooks/use-projects";
import { useAuth } from "@/contexts/AuthContext";

interface StudioHeaderProps {
    projectId: string;
    project: any;
    questions: any[];
    userRole?: string;
    isPreviewOpen: boolean;
    setIsPreviewOpen: (open: boolean) => void;
    isPdfLoading: boolean;
    handleDownloadPDF: () => void;
}

export const StudioHeader = ({
    projectId,
    project,
    questions,
    userRole,
    isPreviewOpen,
    setIsPreviewOpen,
    isPdfLoading,
    handleDownloadPDF
}: StudioHeaderProps) => {
    const updateSettingsMutation = useUpdateProjectSettings();
    const { user } = useAuth();
    const isGuest = !user;

    const templates = [
        { value: 'classic', label: 'Klasik', badge: 'Ücretsiz', disabled: false },
        { value: 'modern', label: 'Modern', badge: 'Gümüş', disabled: isGuest },
        { value: 'compact', label: 'Kompakt 2.0', badge: 'Gümüş', disabled: isGuest },
        { value: 'elegant', label: 'Zarif', badge: 'Altın', disabled: isGuest },
        { value: 'exam', label: 'Kurumsal', badge: 'Altın', disabled: isGuest },
        { value: 'osym', label: 'ÖSYM Tarzı', badge: 'Altın', disabled: isGuest }
    ];

    return (
        <div className="h-auto sm:h-14 flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-0 shrink-0 border-b border-gray-50 bg-white/50 backdrop-blur-sm z-10 gap-3 sm:gap-0">
            <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse shadow-lg shadow-brand-500/50" />
                    <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none">Studio Live</h3>
                    <div className="h-3 w-px bg-gray-200 mx-1" />
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Dizgi Önizleme</span>
                </div>

                <div className="sm:hidden flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-brand-50/50 px-2 py-1 rounded-lg">
                        <Sparkles className="h-2.5 w-2.5 text-brand-500" />
                        <span className="text-[7px] font-black text-brand-600 uppercase">Sync</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 custom-scrollbar-hide">
                <div className="hidden 2xl:flex items-center gap-1.5 bg-brand-50/50 px-3 py-1 rounded-lg mr-2">
                    <Sparkles className="h-3 w-3 text-brand-500" />
                    <span className="text-[8px] font-bold text-brand-600 uppercase">Sync</span>
                </div>

                <PreviewDialog
                    isOpen={isPreviewOpen}
                    onOpenChange={setIsPreviewOpen}
                    isPdfLoading={isPdfLoading}
                    questions={questions}
                    project={project}
                    handleDownloadPDF={handleDownloadPDF}
                    userRole={userRole}
                />

                <div className="hidden lg:flex items-center gap-2 bg-white border border-brand-100 p-1 rounded-xl shadow-sm">
                    <span className="text-[9px] font-black text-brand-500 uppercase px-2">Şablon</span>
                    <Select
                        value={project?.settings?.template || 'classic'}
                        onValueChange={(val) => {
                            const selectedTemplate = templates.find(t => t.value === val);
                            if (selectedTemplate?.disabled) return; // Guest için disabled şablonları engelle

                            updateSettingsMutation.mutate({
                                id: projectId,
                                settings: { ...project?.settings, template: val }
                            });
                        }}
                        disabled={updateSettingsMutation.isPending}
                    >
                        <SelectTrigger className="w-[130px] h-7 text-[10px] font-bold border-none bg-brand-50/50 hover:bg-brand-50 rounded-lg focus:ring-0">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-brand-50 shadow-2xl">
                            {templates.map((template) => (
                                <SelectItem
                                    key={template.value}
                                    value={template.value}
                                    disabled={template.disabled}
                                    className={`text-[10px] font-bold ${template.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {template.label} {template.disabled && `(${template.badge} Paket)`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <SettingsDialog projectId={projectId} initialSettings={project?.settings} />

                <div className="h-4 w-px bg-gray-100 mx-1 shrink-0" />

                <Button
                    onClick={handleDownloadPDF}
                    className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-4 h-9 font-black shadow-lg shadow-brand-500/20 gap-2 text-[10px] tracking-wider transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap flex-1 sm:flex-none"
                >
                    <FileDown className="h-3.5 w-3.5" />
                    <span>İndir</span>
                </Button>
            </div>
        </div>
    );
};
