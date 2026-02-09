"use client";

import React from "react";

export const StudioStatusRibbon = () => {
    return (
        <div className="h-8 bg-white/80 backdrop-blur-sm border-t border-gray-50 flex items-center justify-center gap-6 shrink-0 z-10">
            <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-green-500" />
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Status: Ready</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-200" />
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Zoom: Auto-Fit</span>
            <div className="w-1 h-1 rounded-full bg-gray-200" />
            <span className="text-[8px] font-black text-brand-500 uppercase tracking-widest whitespace-nowrap">F: v0.5.1 | B: v1.2.0</span>
        </div>
    );
};
