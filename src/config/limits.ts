
import { SubscriptionTier, Role } from "@/types/auth";

export const PROJECT_LIMITS = {
    [SubscriptionTier.BRONZ]: 3,
    [SubscriptionTier.GUMUS]: 10,
    [SubscriptionTier.ALTIN]: 25,
    [SubscriptionTier.FREE]: 1,
};

// Role bazlı limitler (tier'a göre)
export const ROLE_PROJECT_LIMITS: Record<Role, number> = {
    [Role.ADMIN]: 999,
    [Role.TEACHER]: 25,
    [Role.STUDENT]: 3,
};

export const QUESTION_LIMITS = {
    [SubscriptionTier.BRONZ]: 20,
    [SubscriptionTier.GUMUS]: 100,
    [SubscriptionTier.ALTIN]: 250,
    [SubscriptionTier.FREE]: 5,
};

// Misafir (giriş yapmamış) kullanıcılar için limitler
export const GUEST_LIMITS = {
    projects: 1,
    questions: 10,
};
