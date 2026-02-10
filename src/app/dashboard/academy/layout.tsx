"use client";

import { useAuth } from "@/contexts/AuthContext";
import { FullPageLoader } from "@/components/ui/custom-ui/FullPageLoader";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Role } from "@/types/auth";

export default function AcademyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            router.push("/auth/login");
            return;
        }

        // If user is Admin, allow access
        if (user.role === Role.ADMIN) {
            return;
        }

        // If user is Teacher, check hasCoachingAccess
        if (user.role === Role.TEACHER) {
            if (!user.hasCoachingAccess) {
                toast.error("Bu alana erişim yetkiniz bulunmamaktadır. (Koçluk Modülü)");
                router.push("/dashboard");
            }
            return;
        }

        // Student access to academy routes?
        // Usually students accept courses via /dashboard/student/...
        // But if they try to access /dashboard/academy/..., they should probably be blocked
        // as this seems to satisfy "Teacher's Coaching Panel".
        // Let's block students from /dashboard/academy/* as well, 
        // assuming these are teacher-facing management pages.
        if (user.role === Role.STUDENT) {
            toast.error("Bu alan sadece eğitmenler içindir.");
            router.push("/dashboard");
            return;
        }

    }, [user, isLoading, router]);


    if (isLoading) {
        return <FullPageLoader />;
    }

    // If teacher without access, don't render children (redirect happening)
    if (user?.role === Role.TEACHER && !user.hasCoachingAccess) {
        return <FullPageLoader />;
    }

    // If student, don't render (redirect happening)
    if (user?.role === Role.STUDENT) {
        return <FullPageLoader />;
    }

    return <>{children}</>;
}
