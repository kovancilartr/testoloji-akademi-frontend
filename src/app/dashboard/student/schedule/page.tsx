
"use client";

import { useSchedule } from "@/hooks/use-schedule";
import { useMyCourses } from "@/hooks/use-courses";
import { FullPageLoader } from "@/components/ui/custom-ui/FullPageLoader";
import { Button } from "@/components/ui/button";
import {
    CalendarDays,
    Clock,
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { useTheme, useThemeColors } from "@/contexts/ThemeContext";

const DAYS_SHORT = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const MONTHS = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

export default function StudentSchedulePage() {
    const { data: schedule, isLoading } = useSchedule();
    const { data: myCourses } = useMyCourses();
    const router = useRouter();
    const colors = useThemeColors();

    const [currentDate, setCurrentDate] = useState(new Date());

    const handleActivityClick = (item: any) => {
        if (item.courseId) {
            const contentParam = item.contentId ? `?contentId=${item.contentId}` : '';
            router.push(`/dashboard/student/library/${item.courseId}${contentParam}`);
            return;
        }

        const activityText = item.activity || "";
        if (activityText.startsWith("📚")) {
            const parts = activityText.replace("📚 ", "").split(" → ");
            if (parts.length > 0) {
                const courseTitle = parts[0];
                const course = myCourses?.find((c: any) => c.title === courseTitle);
                if (course) {
                    router.push(`/dashboard/student/library/${course.id}`);
                    return;
                }
            }
        }
    };

    // Calendar calculations
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Get first day (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfWeek = firstDayOfMonth.getDay();
    // Convert to Monday-based (0 = Monday, 6 = Sunday)
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const calendarDays = useMemo(() => {
        const days = [];

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    }, [firstDayOfWeek, daysInMonth]);

    const getActivitiesForDate = (day: number) => {
        if (!day || !schedule) return [];

        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();
        const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek;

        // Format date as YYYY-MM-DD for comparison
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        return schedule.filter(item => {
            // If item has a specific date, only show on that date
            if (item.date) {
                const itemDate = new Date(item.date);
                const itemDateStr = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}-${String(itemDate.getDate()).padStart(2, '0')}`;
                return itemDateStr === dateStr;
            }

            // If item has dayOfWeek, show on all matching weekdays (recurring)
            if (item.dayOfWeek) {
                return item.dayOfWeek === adjustedDay;
            }

            return false;
        });
    };

    const isToday = (day: number | null) => {
        if (!day) return false;
        const today = new Date();
        return today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;
    };

    const previousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    if (isLoading) return <FullPageLoader message="Programınız hazırlanıyor..." />;

    return (
        <div className="flex-1 p-8 space-y-6 bg-gradient-to-br from-gray-50 via-white to-gray-50/50 min-h-full overflow-auto">
            {/* Header */}
            <div className="space-y-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                        <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg", colors.gradient, colors.shadow)}>
                            <CalendarDays className="w-6 h-6 text-white" />
                        </div>
                        Ders Programım
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        Haftalık ders programını takvim üzerinde görüntüle.
                    </p>
                </div>

                {/* Month Navigation */}
                <div className="flex items-center justify-between bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={previousMonth}
                        className="font-bold"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>

                    <div className="flex items-center gap-2">
                        <CalendarIcon className={cn("w-4 h-4", colors.text)} />
                        <h2 className="text-lg font-black text-gray-900">
                            {MONTHS[month]} {year}
                        </h2>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={nextMonth}
                        className="font-bold"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
                {/* Day Headers */}
                <div className="grid grid-cols-7 bg-gray-50/50 border-b border-gray-200">
                    {DAYS_SHORT.map((day) => (
                        <div key={day} className="p-2 text-center border-r border-gray-100 last:border-r-0">
                            <span className="text-[10px] font-black text-gray-900 uppercase tracking-wider">
                                {day}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 auto-rows-fr">
                    {calendarDays.map((day, index) => {
                        const activities = day ? getActivitiesForDate(day) : [];
                        const today = isToday(day);

                        return (
                            <div
                                key={index}
                                className={cn(
                                    "min-h-[100px] max-h-[140px] border-b border-r border-gray-100 p-1.5 transition-colors overflow-hidden",
                                    day ? "bg-white hover:bg-gray-50/50" : "bg-gray-50/30",
                                    index % 7 === 6 && "border-r-0"
                                )}
                            >
                                {day && (
                                    <div className="h-full flex flex-col">
                                        {/* Day Number */}
                                        <div className="flex items-center justify-between mb-1 flex-shrink-0">
                                            <span className={cn(
                                                "text-xs font-black",
                                                today
                                                    ? cn("w-6 h-6 rounded-full flex items-center justify-center text-white bg-gradient-to-br text-[10px]", colors.gradient)
                                                    : "text-gray-900"
                                            )}>
                                                {day}
                                            </span>
                                            {activities.length > 0 && (
                                                <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full", colors.bg, colors.text)}>
                                                    {activities.length}
                                                </span>
                                            )}
                                        </div>

                                        {/* Activities */}
                                        <div className="space-y-1 overflow-y-auto flex-1 custom-scrollbar">
                                            {activities.slice(0, 2).map((activity) => {
                                                const isCourseContent = activity.activity?.startsWith("📚");

                                                return (
                                                    <div
                                                        key={activity.id}
                                                        onClick={() => isCourseContent && handleActivityClick(activity)}
                                                        className={cn(
                                                            "text-[9px] font-bold p-1 rounded cursor-pointer transition-all",
                                                            isCourseContent
                                                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                                : cn(colors.bg, colors.text, `hover:${colors.hover} hover:text-white`)
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-2 h-2 flex-shrink-0" />
                                                            <span className="truncate">{activity.startTime}</span>
                                                        </div>
                                                        <div className="line-clamp-2 leading-tight mt-0.5">
                                                            {isCourseContent
                                                                ? activity.activity.replace("📚 ", "")
                                                                : activity.activity
                                                            }
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {activities.length > 2 && (
                                                <div className="text-[8px] font-bold text-gray-400 text-center">
                                                    +{activities.length - 2}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-xs bg-white rounded-xl p-3 border border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200"></div>
                    <span className="font-semibold text-gray-600">Kurs İçeriği</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded border", colors.bg, colors.border)}></div>
                    <span className="font-semibold text-gray-600">Diğer Aktiviteler</span>
                </div>
            </div>
        </div>
    );
}
