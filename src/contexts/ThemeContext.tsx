"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "orange" | "blue" | "red" | "black";

export interface ThemeColors {
    gradient: string;
    bg: string;
    text: string;
    shadow: string;
    border: string;
    hover?: string;
    buttonBg: string;
    buttonHover: string;
    iconBg: string;
}

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Centralized theme colors configuration
export const themeColors: Record<Theme, ThemeColors> = {
    orange: {
        gradient: "from-orange-500 to-orange-600",
        bg: "bg-orange-50",
        text: "text-orange-600",
        shadow: "shadow-orange-500/30",
        border: "border-orange-200",
        hover: "hover:bg-orange-100",
        buttonBg: "bg-orange-500",
        buttonHover: "hover:bg-orange-600",
        iconBg: "bg-orange-100",
    },
    blue: {
        gradient: "from-blue-500 to-blue-600",
        bg: "bg-blue-50",
        text: "text-blue-600",
        shadow: "shadow-blue-500/30",
        border: "border-blue-200",
        hover: "hover:bg-blue-100",
        buttonBg: "bg-blue-500",
        buttonHover: "hover:bg-blue-600",
        iconBg: "bg-blue-100",
    },
    red: {
        gradient: "from-red-500 to-red-600",
        bg: "bg-red-50",
        text: "text-red-600",
        shadow: "shadow-red-500/30",
        border: "border-red-200",
        hover: "hover:bg-red-100",
        buttonBg: "bg-red-500",
        buttonHover: "hover:bg-red-600",
        iconBg: "bg-red-100",
    },
    black: {
        gradient: "from-gray-800 to-gray-900",
        bg: "bg-white",
        text: "text-gray-900",
        shadow: "shadow-gray-900/30",
        border: "border-gray-300",
        hover: "hover:bg-gray-100",
        buttonBg: "bg-gray-800",
        buttonHover: "hover:bg-gray-900",
        iconBg: "bg-gray-200",
    },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("orange");

    useEffect(() => {
        const savedTheme = localStorage.getItem("testoloji-theme") as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem("testoloji-theme", newTheme);

        // Update document class
        const root = document.documentElement;
        root.classList.remove("theme-orange", "theme-blue", "theme-red", "theme-black");
        if (newTheme !== "orange") {
            root.classList.add(`theme-${newTheme}`);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}

// Custom hook to get current theme colors
export function useThemeColors() {
    const { theme } = useTheme();
    return themeColors[theme];
}
