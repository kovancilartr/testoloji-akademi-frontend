import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/auth";

// ─── System Settings Hooks ───

interface SystemSettingValue {
    key: string;
    value: string | null;
}

interface AiUsageStats {
    logs: any[];
    totals: {
        requests: number;
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

/**
 * Sistem ayarlarını (API Key + Model) birlikte çeker.
 * 5 dakika staleTime ile cache'lenir.
 */
export const useSystemSettings = () => {
    return useQuery({
        queryKey: ["system-settings"],
        queryFn: async () => {
            const [apiKeyResponse, modelResponse] = await Promise.all([
                api.get<ApiResponse<SystemSettingValue>>("/system-settings/value?key=GEMINI_API_KEY"),
                api.get<ApiResponse<SystemSettingValue>>("/system-settings/value?key=GEMINI_MODEL"),
            ]);

            const keyData = apiKeyResponse.data.data;
            const modelData = modelResponse.data.data;

            return {
                apiKey: keyData?.value || "",
                hasExistingKey: !!(keyData && keyData.value !== null),
                selectedModel: modelData?.value || "gemini-2.0-flash",
            };
        },
        staleTime: 5 * 60 * 1000, // 5 dakika cache
        refetchOnWindowFocus: false,
    });
};

/**
 * AI kullanım istatistiklerini çeker.
 * 5 dakika staleTime ile cache'lenir.
 */
export const useAiUsageStats = () => {
    return useQuery({
        queryKey: ["ai-usage-stats"],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<AiUsageStats>>("/system-settings/usage-stats");
            return data.data;
        },
        staleTime: 5 * 60 * 1000, // 5 dakika cache
        refetchOnWindowFocus: false,
    });
};

/**
 * API Key kaydetme mutation'ı.
 * Başarılı olduğunda system-settings cache'ini invalidate eder.
 */
export const useSaveApiKey = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (apiKey: string) => {
            const { data } = await api.post("/system-settings", {
                key: "GEMINI_API_KEY",
                value: apiKey,
                encrypt: true,
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["system-settings"] });
        },
    });
};

/**
 * Model tercihi kaydetme mutation'ı.
 * Başarılı olduğunda system-settings cache'ini invalidate eder.
 */
export const useSaveModel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (model: string) => {
            const { data } = await api.post("/system-settings", {
                key: "GEMINI_MODEL",
                value: model,
                encrypt: false,
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["system-settings"] });
        },
    });
};
