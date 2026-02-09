"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, RefreshCw, Trash2 } from "lucide-react";
import { ThemeColors } from "@/contexts/ThemeContext";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

const DAYS_SHORT = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const MONTHS = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

interface DesktopCalendarProps {
    schedule: any[] | undefined;
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    handleDelete: (id: string) => void;
    colors: ThemeColors;
}

export function DesktopCalendar({
    schedule,
    currentDate,
    setCurrentDate,
    handleDelete,
    colors
}: DesktopCalendarProps) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    let firstDayOfWeek = firstDayOfMonth.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const calendarDays = useMemo(() => {
        const days = [];
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push(null);
        }
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

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        return schedule.filter(item => {
            if (item.date) {
                const itemDate = new Date(item.date);
                const itemDateStr = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}-${String(itemDate.getDate()).padStart(2, '0')}`;
                return itemDateStr === dateStr;
            }
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

    return (
        <div className="hidden md:block">
            {/* Month Navigation */}
            <div className="bg-gray-50/50 border-b border-gray-200 p-3 flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={previousMonth} className="font-bold">
                    <ChevronLeft className="w-5 h-5" />
                </Button>

                <div className="flex items-center gap-2">
                    <CalendarIcon className={cn("w-4 h-4", colors.text)} />
                    <h2 className="text-lg font-black text-gray-900">
                        {MONTHS[month]} {year}
                    </h2>
                </div>

                <Button variant="ghost" size="sm" onClick={nextMonth} className="font-bold">
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>

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

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 auto-rows-fr">
                {calendarDays.map((day, index) => {
                    const activities = day ? getActivitiesForDate(day) : [];
                    const today = isToday(day);

                    return (
                        <div
                            key={index}
                            className={cn(
                                "min-h-[140px] border-b border-r border-gray-100 p-2 transition-colors overflow-hidden",
                                day ? "bg-white hover:bg-gray-50/50" : "bg-gray-50/30",
                                index % 7 === 6 && "border-r-0"
                            )}
                        >
                            {day && (
                                <div className="h-full flex flex-col">
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
                                    <div className="space-y-1 overflow-y-auto flex-1 custom-scrollbar">
                                        {activities.slice(0, 3).map((activity) => {
                                            const isCourseContent = activity.activity?.startsWith("📚");
                                            const isRecurring = !!activity.dayOfWeek;
                                            return (
                                                <div
                                                    key={activity.id}
                                                    className={cn(
                                                        "text-[9px] font-bold p-1 rounded transition-all group relative",
                                                        isCourseContent
                                                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                            : cn(colors.bg, colors.text, colors.hover)
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between gap-1 mb-0.5">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-2 h-2 flex-shrink-0" />
                                                            <span className="truncate">{activity.startTime}</span>
                                                        </div>
                                                        {isRecurring && (
                                                            <Badge className="h-3 px-1 text-[7px] bg-blue-100 text-blue-700 border-blue-200">
                                                                <RefreshCw className="w-2 h-2" />
                                                            </Badge>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(activity.id)}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 className="w-2.5 h-2.5 text-red-500" />
                                                        </button>
                                                    </div>
                                                    <div className="line-clamp-2 leading-tight">
                                                        {isCourseContent
                                                            ? activity.activity.replace("📚 ", "")
                                                            : activity.activity
                                                        }
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {activities.length > 3 && (
                                            <div className="text-[8px] font-bold text-gray-400 text-center">
                                                +{activities.length - 3}
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
    );
}
