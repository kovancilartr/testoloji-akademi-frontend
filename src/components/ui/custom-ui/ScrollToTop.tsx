"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div
            className={cn(
                "fixed bottom-8 right-8 z-[60] transition-all duration-500 transform",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
            )}
        >
            <Button
                onClick={scrollToTop}
                size="icon"
                className="h-12 w-12 rounded-2xl bg-gray-900 hover:bg-black text-white shadow-2xl hover:shadow-gray-400 group border-2 border-white/10"
            >
                <ArrowUp className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
            </Button>
        </div>
    );
}
