
"use client";

import { useAuth } from "@/contexts/AuthContext";
import TeacherDashboard from "@/components/ui/custom-ui/dashboard-homes/TeacherDashboard";
import StudentDashboard from "@/components/ui/custom-ui/dashboard-homes/StudentDashboard";
import { FullPageLoader } from "@/components/ui/custom-ui/FullPageLoader";

export default function DashboardHome() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <FullPageLoader message="Yükleniyor..." />;
    }

    // Debug
    console.log("Current User Role:", user?.role);

    if (user?.role === "STUDENT") {
        return <StudentDashboard />;
    }

    return <TeacherDashboard />;
}
