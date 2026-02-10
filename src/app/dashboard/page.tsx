
"use client";

import { useAuth } from "@/contexts/AuthContext";
import TeacherDashboard from "@/components/ui/custom-ui/dashboard-homes/TeacherDashboard";
import StudentDashboard from "@/components/ui/custom-ui/dashboard-homes/StudentDashboard";
import { FullPageLoader } from "@/components/ui/custom-ui/FullPageLoader";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardHome() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/dashboard/projects");
        }
    }, [isLoading, user, router]);

    if (isLoading) {
        return <FullPageLoader message="Yükleniyor..." />;
    }

    // Debug
    console.log("Current User Role:", user?.role);

    if (!user) return null; // Prevent flash while redirecting

    if (user?.role === "STUDENT") {
        return <StudentDashboard />;
    }

    return <TeacherDashboard />;
}
