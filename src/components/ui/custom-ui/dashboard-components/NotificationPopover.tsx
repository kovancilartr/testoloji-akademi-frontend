"use client";

import React from 'react';
import { Bell, Check, Trash2, Info, GraduationCap, Calendar, MessageSquare } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications, Notification } from '@/hooks/use-notifications';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NotificationPopoverProps {
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
}

export function NotificationPopover({ side = "bottom", align = "end" }: NotificationPopoverProps) {
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, isLoading } = useNotifications();
    const [open, setOpen] = React.useState(false);

    const getIcon = (type: string) => {
        switch (type) {
            case 'ASSIGNMENT_CREATED':
                return <GraduationCap className="h-4 w-4 text-orange-500" />;
            case 'SCHEDULE_UPDATED':
                return <Calendar className="h-4 w-4 text-blue-500" />;
            case 'COACHING_NOTE':
                return <MessageSquare className="h-4 w-4 text-purple-500" />;
            default:
                return <Info className="h-4 w-4 text-slate-500" />;
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group hover:bg-slate-50 rounded-xl transition-all active:scale-95 shrink-0 h-10 w-10">
                    <Bell className="h-5 w-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-in zoom-in-50">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align={align}
                side={side}
                sideOffset={side === "right" ? 12 : 8}
                className="w-80 p-2 rounded-2xl shadow-2xl border-slate-100 bg-white/95 backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-200"
            >
                <div className="px-3 py-2 flex items-center justify-between">
                    <p className="text-[9px] font-black text-brand-500 uppercase tracking-widest">Bildirim Merkezi</p>
                    {unreadCount > 0 && (
                        <button
                            onClick={() => markAllAsRead()}
                            className="text-[10px] font-bold text-slate-400 hover:text-brand-600 transition-colors"
                        >
                            Tümünü Oku
                        </button>
                    )}
                </div>

                <ScrollArea className="h-[400px] mt-1 pr-1">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[200px] text-center p-6 space-y-3">
                            <div className="bg-slate-50 p-3 rounded-xl">
                                <Bell className="h-6 w-6 text-slate-300" />
                            </div>
                            <div>
                                <p className="text-slate-900 font-bold text-sm">Bildirim yok</p>
                                <p className="text-slate-500 text-[10px]">Her şey güncel görünüyor.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-1 pb-1">
                            {notifications.map((notification: Notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "p-3 rounded-xl transition-all relative group hover:bg-slate-50/80 cursor-default",
                                        !notification.isRead && "bg-brand-50/30 ring-1 ring-inset ring-brand-100/50"
                                    )}
                                >
                                    <div className="flex gap-3">
                                        <div className={cn(
                                            "mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                                            notification.isRead ? "bg-slate-100 text-slate-500" : "bg-white text-brand-600 ring-1 ring-slate-100"
                                        )}>
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-0.5">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={cn(
                                                    "text-[11px] leading-tight pr-6",
                                                    notification.isRead ? "text-slate-600 font-medium" : "text-slate-900 font-black"
                                                )}>
                                                    {notification.title}
                                                </p>
                                                {!notification.isRead && (
                                                    <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(255,96,0,0.5)]" />
                                                )}
                                            </div>
                                            <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-slate-50/50">
                                                <p className="text-[9px] text-slate-400 font-bold">
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: tr })}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    {notification.link && (
                                                        <Link
                                                            href={notification.link}
                                                            className="text-[9px] font-black text-brand-600 hover:text-brand-700 hover:underline transition-all"
                                                            onClick={() => {
                                                                markAsRead(notification.id);
                                                                setOpen(false);
                                                            }}
                                                        >
                                                            GİT
                                                        </Link>
                                                    )}
                                                    <div className="flex gap-1">
                                                        {!notification.isRead && (
                                                            <button
                                                                className="p-1 rounded-md hover:bg-green-50 text-slate-300 hover:text-green-600 transition-colors"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    markAsRead(notification.id);
                                                                }}
                                                            >
                                                                <Check className="h-3 w-3" />
                                                            </button>
                                                        )}
                                                        <button
                                                            className="p-1 rounded-md hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                deleteNotification(notification.id);
                                                            }}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {notifications.length > 0 && (
                    <div className="mt-1 pt-1 border-t border-slate-50">
                        <Button variant="ghost" size="sm" className="text-[10px] font-black text-slate-400 w-full h-8 hover:bg-slate-50 hover:text-slate-900 rounded-xl uppercase tracking-widest">
                            Tümünü Gör
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
