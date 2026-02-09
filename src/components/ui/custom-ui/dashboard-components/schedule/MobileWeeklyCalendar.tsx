"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ThemeColors } from "@/contexts/ThemeContext";

const DAYS = [
    { id: 1, name: "Pazartesi" },
    { id: 2, name: "Salı" },
    { id: 3, name: "Çarşamba" },
    { id: 4, name: "Perşembe" },
    { id: 5, name: "Cuma" },
    { id: 6, name: "Cumartesi" },
    { id: 7, name: "Pazar" },
];

const MONTHS = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

interface MobileWeeklyCalendarProps {
    schedule: any[] | undefined;
    currentWeekDate: Date;
    setCurrentWeekDate: (date: Date) => void;
    handleDelete: (id: string) => void;
    colors: ThemeColors;
}

export function MobileWeeklyCalendar({
    schedule,
    currentWeekDate,
    setCurrentWeekDate,
    handleDelete,
    colors
}: MobileWeeklyCalendarProps) {

    const currentWeekDays = useMemo(() => {
        const curr = new Date(currentWeekDate);
        const day = curr.getDay();
        const diff = curr.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
        const monday = new Date(curr);
        monday.setDate(diff);

        const days = [];
        for (let i = 0; i < 7; i++) {
            const nextDay = new Date(monday);
            nextDay.setDate(monday.getDate() + i);
            days.push(nextDay);
        }
        return days;
    }, [currentWeekDate]);

    const prevWeek = () => {
        const newDate = new Date(currentWeekDate);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentWeekDate(newDate);
    };

    const nextWeek = () => {
        const newDate = new Date(currentWeekDate);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentWeekDate(newDate);
    };

    const getActivitiesForWeekDay = (date: Date) => {
        if (!schedule) return [];

        const d_year = date.getFullYear();
        const d_month = date.getMonth();
        const d_day = date.getDate();
        const d_dayOfWeek = date.getDay();
        const adjustedDayOfWeek = d_dayOfWeek === 0 ? 7 : d_dayOfWeek;

        const dateStr = `${d_year}-${String(d_month + 1).padStart(2, '0')}-${String(d_day).padStart(2, '0')}`;

        return schedule.filter(item => {
            if (item.date) {
                const itemDate = new Date(item.date);
                const itemDateStr = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}-${String(itemDate.getDate()).padStart(2, '0')}`;
                return itemDateStr === dateStr;
            }
            if (item.dayOfWeek) {
                return item.dayOfWeek === adjustedDayOfWeek;
            }
            return false;
        });
    };

    return (
        <div className="md:hidden">
            {/* Week Navigation */}
            <div className="bg-gray-50/50 border-b border-gray-200 p-3 flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={prevWeek} className="font-bold">
                    <ChevronLeft className="w-5 h-5" />
                </Button>

                <div className="flex items-center gap-2">
                    <CalendarIcon className={cn("w-4 h-4", colors.text)} />
                    <h2 className="text-sm font-black text-gray-900">
                        {currentWeekDays[0].getDate()} {MONTHS[currentWeekDays[0].getMonth()]} - {currentWeekDays[6].getDate()} {MONTHS[currentWeekDays[6].getMonth()]}
                    </h2>
                </div>

                <Button variant="ghost" size="sm" onClick={nextWeek} className="font-bold">
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>

            {/* Week Days List */}
            <div className="divide-y divide-gray-100">
                {currentWeekDays.map((date, index) => {
                    const activities = getActivitiesForWeekDay(date);
                    const isTodayDate =
                        date.getDate() === new Date().getDate() &&
                        date.getMonth() === new Date().getMonth() &&
                        date.getFullYear() === new Date().getFullYear();
                    const dayName = DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1].name;

                    return (
                        <div key={index} className={cn("p-4 bg-white transition-colors", isTodayDate ? "bg-amber-50/30" : "")}>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-bold text-gray-500">{dayName}</span>
                                <span className={cn(
                                    "text-xs font-black",
                                    isTodayDate
                                        ? cn("px-2 py-1 rounded-full text-white bg-gradient-to-br", colors.gradient)
                                        : "text-gray-900"
                                )}>
                                    {date.getDate()} {MONTHS[date.getMonth()]}
                                </span>
                            </div>

                            <div className="space-y-2">
                                {activities.length > 0 ? (
                                    activities.map((activity) => {
                                        const isCourseContent = activity.activity?.startsWith("📚");
                                        const isRecurring = !!activity.dayOfWeek;

                                        return (
                                            <div
                                                key={activity.id}
                                                className={cn(
                                                    "text-xs font-bold p-3 rounded-lg border transition-all group relative",
                                                    isCourseContent
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                        : cn(colors.bg, colors.text, colors.hover, "border-gray-100")
                                                )}
                                            >
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
                                                        <span className="truncate">{activity.startTime} - {activity.endTime}</span>
                                                    </div>
                                                    {isRecurring && (
                                                        <Badge className="h-5 px-1.5 text-[9px] bg-blue-100 text-blue-700 border-blue-200">
                                                            <RefreshCw className="w-3 h-3 mr-1" />
                                                            Her Hafta
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="font-medium leading-relaxed mt-1">
                                                    {isCourseContent
                                                        ? activity.activity.replace("📚 ", "")
                                                        : activity.activity
                                                    }
                                                </div>

                                                <div className="flex justify-end mt-2 pt-2 border-t border-black/5">
                                                    <button
                                                        onClick={() => handleDelete(activity.id)}
                                                        className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" /> Sil
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-4 text-xs text-gray-400 italic">
                                        Bu gün için planlanmış aktivite yok.
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
