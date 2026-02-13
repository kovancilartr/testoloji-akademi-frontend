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
    LayoutGrid,
    Columns,
    List,
    AlignLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { useThemeColors } from "@/contexts/ThemeContext";

const DAYS_SHORT = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const DAYS_LONG = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const MONTHS = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

type ViewType = 'month' | 'week' | 'day';

export default function StudentSchedulePage() {
    const { data: schedule, isLoading } = useSchedule();
    const { data: myCourses } = useMyCourses();
    const router = useRouter();
    const colors = useThemeColors();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<ViewType>('day');

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

    // Date Helpers
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = currentDate.getDate();

    const getWeekDates = (baseDate: Date) => {
        const d = new Date(baseDate);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        const monday = new Date(d.setDate(diff));

        const week = [];
        for (let i = 0; i < 7; i++) {
            const next = new Date(monday);
            next.setDate(monday.getDate() + i);
            week.push(next);
        }
        return week;
    };

    const calendarDays = useMemo(() => {
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();

        let firstDayOfWeek = firstDayOfMonth.getDay();
        firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

        const days = [];
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push(null);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        return days;
    }, [year, month]);

    const getActivitiesForDate = (checkDate: Date) => {
        if (!schedule) return [];

        const checkYear = checkDate.getFullYear();
        const checkMonth = checkDate.getMonth();
        const checkDay = checkDate.getDate();
        const dayOfWeek = checkDate.getDay();
        const adjustedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

        // Format: YYYY-MM-DD
        const dateStr = `${checkYear}-${String(checkMonth + 1).padStart(2, '0')}-${String(checkDay).padStart(2, '0')}`;

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
        }).sort((a: any, b: any) => (a.startTime || '').localeCompare(b.startTime || ''));
    };

    const isToday = (checkDate: Date) => {
        const today = new Date();
        return checkDate.getDate() === today.getDate() &&
            checkDate.getMonth() === today.getMonth() &&
            checkDate.getFullYear() === today.getFullYear();
    };

    // Navigation
    const handlePrevious = () => {
        const newDate = new Date(currentDate);
        if (view === 'month') newDate.setMonth(newDate.getMonth() - 1);
        else if (view === 'week') newDate.setDate(newDate.getDate() - 7);
        else newDate.setDate(newDate.getDate() - 1);
        setCurrentDate(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(currentDate);
        if (view === 'month') newDate.setMonth(newDate.getMonth() + 1);
        else if (view === 'week') newDate.setDate(newDate.getDate() + 7);
        else newDate.setDate(newDate.getDate() + 1);
        setCurrentDate(newDate);
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    // Render Components
    const ActivityCard = ({ activity, compact = false }: { activity: any, compact?: boolean }) => {
        const isCourseContent = activity.activity?.startsWith("📚");

        return (
            <div
                onClick={() => isCourseContent && handleActivityClick(activity)}
                className={cn(
                    "font-bold rounded-lg cursor-pointer transition-all border shadow-sm",
                    compact ? "text-[10px] p-1.5" : "text-xs p-3",
                    isCourseContent
                        ? "bg-emerald-50 text-emerald-900 border-emerald-100 hover:bg-emerald-100/80 hover:border-emerald-200"
                        : "bg-white text-gray-700 border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                )}
            >
                <div className="flex items-center gap-1.5 mb-1 opacity-70">
                    <Clock className={cn("shrink-0", compact ? "w-3 h-3" : "w-3.5 h-3.5")} />
                    <span className="font-mono">{activity.startTime} - {activity.endTime}</span>
                </div>
                <div className={cn("font-bold leading-tight", compact ? "line-clamp-2" : "")}>
                    {isCourseContent ? activity.activity.replace("📚 ", "") : activity.activity}
                </div>
            </div>
        );
    };

    const getHeaderText = () => {
        if (view === 'month') return `${MONTHS[month]} ${year}`;

        if (view === 'day') {
            const dayIndex = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
            return `${date} ${MONTHS[month]} ${year}, ${DAYS_LONG[dayIndex]}`;
        }

        // Week view header
        const weekDates = getWeekDates(currentDate);
        const start = weekDates[0];
        const end = weekDates[6];

        // Same month
        if (start.getMonth() === end.getMonth()) {
            return `${start.getDate()} - ${end.getDate()} ${MONTHS[start.getMonth()]} ${year}`;
        }
        // Different months/years
        return `${start.getDate()} ${MONTHS[start.getMonth()]} - ${end.getDate()} ${MONTHS[end.getMonth()]} ${end.getFullYear()}`;
    };

    if (isLoading) return <FullPageLoader message="Programınız hazırlanıyor..." />;

    return (
        <div className="flex-1 p-4 md:p-8 space-y-6 bg-linear-to-br from-gray-50 via-white to-gray-50/50 min-h-full overflow-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                        <div className={cn("w-12 h-12 rounded-2xl bg-linear-to-br flex items-center justify-center shadow-lg", colors.gradient, colors.shadow)}>
                            <CalendarDays className="w-6 h-6 text-white" />
                        </div>
                        Ders Programım
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm max-w-md font-medium">
                        Derslerini, ödevlerini ve yaklaşan sınavlarını takvim üzerinde takip et.
                    </p>
                </div>

                {/* View Switcher */}
                <div className="flex bg-gray-100/80 p-1 rounded-xl self-start md:self-auto w-full md:w-auto">
                    {[
                        { id: 'month', label: 'Ay', icon: LayoutGrid },
                        { id: 'week', label: 'Hafta', icon: Columns },
                        { id: 'day', label: 'Gün', icon: AlignLeft },
                    ].map((v) => (
                        <button
                            key={v.id}
                            onClick={() => setView(v.id as ViewType)}
                            className={cn(
                                "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                                view === v.id
                                    ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                            )}
                        >
                            <v.icon className="w-4 h-4" />
                            <span className="inline">{v.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Calendar Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                    <Button variant="outline" size="icon" onClick={handlePrevious} className="h-9 w-9 p-0 rounded-xl hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center justify-center gap-2 min-w-[200px]">
                        <CalendarIcon className="w-5 h-5 text-indigo-500" />
                        <h2 className="text-lg font-black text-gray-900 whitespace-nowrap text-center">
                            {getHeaderText()}
                        </h2>
                    </div>
                    <Button variant="outline" size="icon" onClick={handleNext} className="h-9 w-9 p-0 rounded-xl hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>

                <Button variant="ghost" size="sm" onClick={handleToday} className="text-xs font-bold text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all px-4 h-9 rounded-xl border border-transparent hover:border-indigo-100 w-full sm:w-auto">
                    Bugüne Dön
                </Button>
            </div>

            {/* Views Container */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden min-h-[600px] flex flex-col">

                {/* MONTH VIEW */}
                {view === 'month' && (
                    <div className="flex flex-col h-full">
                        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                            {DAYS_SHORT.map((day) => (
                                <div key={day} className="py-3 text-center border-r border-gray-100 last:border-r-0">
                                    <span className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest">{day}</span>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 grid-rows-5 flex-1 min-h-[500px] md:min-h-[600px]">
                            {calendarDays.map((day, index) => {
                                const dayDate = day ? new Date(year, month, day) : null;
                                const activities = dayDate ? getActivitiesForDate(dayDate) : [];
                                const today = dayDate ? isToday(dayDate) : false;

                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            "border-b border-r border-gray-100 p-1 md:p-2 transition-colors relative group min-h-[80px] md:min-h-[120px]",
                                            day ? "bg-white hover:bg-gray-50/30 cursor-pointer" : "bg-gray-50/30",
                                            index % 7 === 6 && "border-r-0"
                                        )}
                                        onClick={() => {
                                            if (day) {
                                                setCurrentDate(dayDate!);
                                                setView('day');
                                            }
                                        }}
                                    >
                                        {day && (
                                            <div className="h-full flex flex-col">
                                                <div className="flex items-center justify-center md:justify-between mb-2">
                                                    <span className={cn(
                                                        "text-xs font-bold w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full transition-all",
                                                        today
                                                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                                            : "text-gray-700 group-hover:bg-gray-200/50"
                                                    )}>
                                                        {day}
                                                    </span>
                                                    {activities.length > 0 && (
                                                        <span className={cn(
                                                            "hidden md:inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700"
                                                        )}>
                                                            {activities.length}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Desktop: List Activities */}
                                                <div className="hidden md:block space-y-1.5 overflow-hidden">
                                                    {activities.slice(0, 2).map((activity) => (
                                                        <ActivityCard key={activity.id} activity={activity} compact />
                                                    ))}
                                                    {activities.length > 2 && (
                                                        <div className="text-[10px] font-bold text-gray-400 pl-1 hover:text-indigo-600 transition-colors">
                                                            +{activities.length - 2} daha...
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Mobile: Dots for activities */}
                                                <div className="md:hidden flex justify-center gap-1 flex-wrap content-start mt-1">
                                                    {activities.slice(0, 4).map((_, i) => (
                                                        <div key={i} className={cn("w-1.5 h-1.5 rounded-full", isToday(dayDate!) ? "bg-indigo-300" : "bg-indigo-400")} />
                                                    ))}
                                                    {activities.length > 4 && <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* WEEK VIEW */}
                {view === 'week' && (
                    <>
                        {/* Desktop View (Grid columns) */}
                        <div className="hidden md:flex flex-col h-full overflow-x-auto">
                            <div className="grid grid-cols-7 min-w-[800px] border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
                                {getWeekDates(currentDate).map((date) => {
                                    const today = isToday(date);

                                    return (
                                        <div key={date.toISOString()} className={cn(
                                            "py-4 px-2 text-center border-r border-gray-200/60 last:border-r-0 transition-colors cursor-pointer hover:bg-gray-100/50",
                                            today && "bg-indigo-50/30"
                                        )}
                                            onClick={() => setCurrentDate(date)}
                                        >
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                                {DAYS_SHORT[date.getDay() === 0 ? 6 : date.getDay() - 1]}
                                            </div>
                                            <div className={cn(
                                                "text-xl font-black inline-flex w-10 h-10 items-center justify-center rounded-xl transition-all",
                                                today ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-gray-900 hover:bg-gray-200"
                                            )}>
                                                {date.getDate()}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="grid grid-cols-7 min-w-[800px] flex-1 divide-x divide-gray-100 min-h-[600px]">
                                {getWeekDates(currentDate).map((date) => {
                                    const activities = getActivitiesForDate(date);
                                    const today = isToday(date);

                                    return (
                                        <div key={date.toISOString()} className={cn("p-2 space-y-2 transition-colors", today && "bg-indigo-50/5")}>
                                            {activities.length === 0 && (
                                                <div className="h-full flex flex-col items-center justify-start pt-20 gap-2 opacity-30">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                                </div>
                                            )}
                                            {activities.map((activity) => (
                                                <ActivityCard key={activity.id} activity={activity} />
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Mobile View (Vertical List) */}
                        <div className="md:hidden flex flex-col bg-gray-50/30">
                            {getWeekDates(currentDate).map((date) => {
                                const activities = getActivitiesForDate(date);
                                const today = isToday(date);
                                const dayName = DAYS_LONG[date.getDay() === 0 ? 6 : date.getDay() - 1];

                                return (
                                    <div key={date.toISOString()} className={cn("border-b border-gray-100 last:border-b-0", today && "bg-indigo-50/20")}>
                                        {/* Day Header */}
                                        <div className="p-4 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-50/50">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shadow-sm",
                                                    today ? "bg-indigo-600 text-white shadow-indigo-200" : "bg-gray-100 text-gray-700"
                                                )}>
                                                    {date.getDate()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900 leading-none mb-1">
                                                        {dayName}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                        {activities.length} Aktivite
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Activities List */}
                                        <div className="p-4 pt-2 space-y-3">
                                            {activities.length === 0 ? (
                                                <div className="flex items-center gap-2 text-xs text-gray-400 italic pl-14 opacity-50">
                                                    <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                                    Aktivite yok
                                                </div>
                                            ) : (
                                                activities.map(activity => (
                                                    <div key={activity.id} className="pl-14">
                                                        <ActivityCard activity={activity} />
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}

                {/* DAY VIEW */}
                {view === 'day' && (
                    <div className="flex flex-col h-full bg-white">
                        <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/30">
                            <div className="flex flex-col md:flex-row items-center gap-6 max-w-2xl mx-auto">
                                <div className={cn(
                                    "w-16 h-16 md:w-20 md:h-20 rounded-2xl flex flex-col items-center justify-center text-white shadow-xl transform rotate-3 shrink-0",
                                    isToday(currentDate) ? "bg-linear-to-br from-indigo-500 to-purple-600" : "bg-gray-800"
                                )}>
                                    <span className="text-[10px] md:text-xs font-bold uppercase opacity-80 tracking-widest mb-1">{DAYS_SHORT[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1]}</span>
                                    <span className="text-3xl md:text-4xl font-black">{currentDate.getDate()}</span>
                                </div>
                                <div className="text-center md:text-left">
                                    <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                                        {DAYS_LONG[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1]}
                                    </h3>
                                    <p className="text-gray-500 font-medium mt-1 text-sm md:text-base">
                                        Bugün için toplam <strong className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md mx-1">{getActivitiesForDate(currentDate).length}</strong> aktivite planlandı.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-4 md:p-10 bg-white">
                            <div className="max-w-2xl mx-auto space-y-6">
                                {getActivitiesForDate(currentDate).length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 md:py-20 text-center">
                                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                            <CalendarDays className="w-10 h-10 md:w-12 md:h-12 text-gray-300" />
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-2">Planlanmış Aktivite Yok</h4>
                                        <p className="text-gray-500 max-w-xs mx-auto mb-6 text-sm">Bugün için herhangi bir ders veya ödev bulunmuyor. Kendine vakit ayırabilirsin!</p>
                                        <Button variant="outline" onClick={() => setView('month')} className="gap-2">
                                            <LayoutGrid className="w-4 h-4" />
                                            Aylık Görünüme Dön
                                        </Button>
                                    </div>
                                ) : (
                                    getActivitiesForDate(currentDate).map((activity, idx) => (
                                        <div key={activity.id} className="relative pl-6 md:pl-8 group">
                                            {/* Timeline Line */}
                                            {idx !== getActivitiesForDate(currentDate).length - 1 && (
                                                <div className="absolute left-[9px] md:left-[11px] top-8 bottom-[-24px] w-0.5 bg-gray-100 group-last:hidden" />
                                            )}

                                            {/* Timeline Dot */}
                                            <div className="absolute left-[-2px] md:left-0 top-1.5 w-5 h-5 md:w-6 md:h-6 rounded-full border-4 border-white bg-indigo-500 shadow-sm z-10" />

                                            <div className="flex flex-col sm:flex-row gap-2 md:gap-4 mb-2">
                                                <div className="w-auto sm:w-24 pt-1.5 shrink-0">
                                                    <span className="text-xs md:text-sm font-black text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded-md inline-block">
                                                        {activity.startTime}
                                                    </span>
                                                </div>
                                                <div className="flex-1 transform transition-all hover:-translate-y-1 hover:shadow-md rounded-xl">
                                                    <ActivityCard activity={activity} />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
