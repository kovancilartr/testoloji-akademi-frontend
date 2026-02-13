"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
    Cpu,
    BarChart3,
    Zap,
    Activity,
    Database,
    History,
    TrendingUp,
    MessageSquare,
    PieChart
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface AiUsageDashboardProps {
    stats: {
        logs: any[];
        totals: {
            requests: number;
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
        };
    } | null;
}

export function AiUsageDashboard({ stats }: AiUsageDashboardProps) {
    if (!stats) return null;

    // Chart verisi hazırlama (Son 20 istek)
    const chartData = [...stats.logs].reverse().slice(-20).map((log, index) => ({
        name: index + 1,
        tokens: log.totalTokens,
        prompt: log.promptTokens,
        completion: log.completionTokens,
    }));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Toplam İstek"
                    value={stats.totals.requests.toLocaleString()}
                    sub="AI Studio Çağrıları"
                    icon={<MessageSquare className="w-5 h-5 text-blue-500" />}
                    color="blue"
                />
                <MetricCard
                    title="Toplam Token"
                    value={stats.totals.totalTokens.toLocaleString()}
                    sub="Prompt + Yanıt"
                    icon={<Zap className="w-5 h-5 text-orange-500" />}
                    color="orange"
                />
                <MetricCard
                    title="Prompt Veri"
                    value={stats.totals.promptTokens.toLocaleString()}
                    sub="Giriş Tokenları"
                    icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
                    color="emerald"
                />
                <MetricCard
                    title="Yanıt Veri"
                    value={stats.totals.completionTokens.toLocaleString()}
                    sub="Üretilen Tokenlar"
                    icon={<Activity className="w-5 h-5 text-purple-500" />}
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Usage Chart */}
                <Card className="lg:col-span-2 border-none shadow-2xl shadow-blue-500/5 rounded-[2.5rem] overflow-hidden bg-white border border-gray-100">
                    <CardHeader className="p-8 pb-0">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-black text-gray-900 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-blue-500" />
                                    Token Tüketim Analizi
                                </CardTitle>
                                <CardDescription className="font-bold text-gray-400 text-xs">
                                    Son 20 işlemdeki veri yoğunluğu grafiği
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-4">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        hide
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '20px',
                                            border: 'none',
                                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                            padding: '12px'
                                        }}
                                        itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="tokens"
                                        stroke="#3b82f6"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorTokens)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Logs */}
                <Card className="border-none shadow-2xl shadow-blue-500/5 rounded-[2.5rem] overflow-hidden bg-white border border-gray-100">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-xl font-black text-gray-900 flex items-center gap-2">
                            <History className="w-5 h-5 text-orange-500" />
                            Son İşlemler
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-y-auto max-h-[350px] px-6 pb-8 space-y-3 custom-scrollbar">
                            {stats.logs.map((log) => (
                                <div key={log.id} className="p-4 rounded-3xl bg-gray-50/50 border border-gray-100 flex items-center justify-between group hover:bg-white hover:shadow-lg hover:shadow-blue-500/5 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
                                            log.action === 'AskAi' ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                                        )}>
                                            {log.action === 'AskAi' ? <MessageSquare className="w-5 h-5" /> : <Database className="w-5 h-5" />}
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-black text-gray-900">{log.action}</p>
                                            <p className="text-[10px] font-bold text-gray-400 capitalize">
                                                {format(new Date(log.createdAt), "HH:mm", { locale: tr })} • {log.model.split('/').pop()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-blue-600">+{log.totalTokens}</p>
                                        <p className="text-[9px] font-bold text-gray-300">TOKEN</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function MetricCard({ title, value, sub, icon, color }: { title: string, value: string, sub: string, icon: any, color: string }) {
    const colorClasses: any = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100"
    };

    return (
        <div className="p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
            <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2.5 rounded-2xl border", colorClasses[color])}>
                    {icon}
                </div>
                <div className="h-2 w-12 bg-gray-50 rounded-full overflow-hidden">
                    <div className={cn("h-full w-2/3 rounded-full animate-pulse",
                        color === 'blue' ? 'bg-blue-500' :
                            color === 'orange' ? 'bg-orange-500' :
                                color === 'emerald' ? 'bg-emerald-500' : 'bg-purple-500'
                    )} />
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
                <h3 className="text-2xl font-black text-gray-900 group-hover:scale-105 transition-transform origin-left">{value}</h3>
                <p className="text-[10px] font-bold text-gray-300">{sub}</p>
            </div>
        </div>
    );
}
