"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SettingsContextType {
    ecoMode: boolean;
    setEcoMode: (mode: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [ecoMode, _setEcoMode] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("eco-mode");
        if (saved === "true") _setEcoMode(true);
    }, []);

    const setEcoMode = (mode: boolean) => {
        _setEcoMode(mode);
        localStorage.setItem("eco-mode", mode.toString());
        if (mode) {
            document.documentElement.classList.add("eco-mode");
        } else {
            document.documentElement.classList.remove("eco-mode");
        }
    };

    return (
        <SettingsContext.Provider value={{ ecoMode, setEcoMode }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
