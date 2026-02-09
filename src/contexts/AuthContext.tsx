"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, setAuthToken } from '../lib/api';
import { User, AuthResponse, ApiResponse } from '../types/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    login: (data: AuthResponse) => void;
    logout: () => void;
    isLoading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => { },
    logout: () => { },
    isLoading: true,
    isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('accessToken');
            const cachedUser = localStorage.getItem('user');

            if (token && cachedUser) {
                try {
                    // Set preliminary state from cache
                    setUser(JSON.parse(cachedUser));
                    setAuthToken(token);

                    // Verify with server
                    const { data } = await api.get<ApiResponse<User>>('/auth/me');
                    setUser(data.data);
                    localStorage.setItem('user', JSON.stringify(data.data));
                } catch (error: any) {
                    console.error("Auth init failed", error);

                    // If it's a network error (offline), don't log out
                    if (!error.response && !navigator.onLine) {
                        console.log("Offline mode: keeping cached auth");
                    } else if (error.response?.status === 401 || error.response?.status === 403) {
                        // Clear session on definite auth error
                        setAuthToken(null);
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('user');
                        setUser(null);
                    }
                }
            } else {
                // If either token or user is missing, ensure everything is clean
                setAuthToken(null);
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                setUser(null);
            }

            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = (data: AuthResponse) => {
        setAuthToken(data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        router.push('/dashboard');
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await api.post('/auth/logout', { refreshToken });
            }
        } catch (e) {
            console.error("Logout failed", e);
        } finally {
            setAuthToken(null);
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setUser(null);
            router.push('/auth/login');
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isLoading,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
