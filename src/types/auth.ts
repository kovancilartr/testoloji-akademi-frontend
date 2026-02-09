
export enum Role {
    ADMIN = 'ADMIN',
    TEACHER = 'TEACHER',
    STUDENT = 'STUDENT',
}

export enum SubscriptionTier {
    FREE = 'FREE',
    BRONZ = 'BRONZ',
    GUMUS = 'GUMUS',
    ALTIN = 'ALTIN',
}

export interface User {
    id: string;
    email: string;
    name: string | null;
    role: Role;
    tier: SubscriptionTier;
    createdAt: string;
    updatedAt: string;
    passwordChangeRequired?: boolean;
}

export interface AuthResponse {
    user: User;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
