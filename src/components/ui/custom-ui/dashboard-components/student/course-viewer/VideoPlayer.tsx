"use client";

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Play, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import "plyr-react/plyr.css";

const Plyr = dynamic<any>(
    () => import("plyr-react").then((mod) => mod.Plyr),
    {
        ssr: false,
        loading: () => <div className="w-full h-full bg-slate-900 animate-pulse" />
    }
);

const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

interface VideoPlayerProps {
    url: string;
    isCompleted?: boolean;
}

export function VideoPlayer({ url, isCompleted }: VideoPlayerProps) {
    const plyrRef = useRef<any>(null);

    // Attach events directly to plyr instance
    useEffect(() => {
        let plyr: any = null;
        const interval = setInterval(() => {
            plyr = plyrRef.current?.plyr;
            if (plyr) clearInterval(interval);
        }, 500);

        return () => {
            clearInterval(interval);
            if (plyr) {
                try {
                    if (typeof plyr.destroy === 'function') {
                        plyr.destroy();
                    }
                } catch (e) {
                    // Silently fail if already destroyed
                }
            }
        };
    }, [url]);

    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');

    if (!isYouTube) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center gap-6 p-12 text-center bg-slate-900 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
                <Video className="w-16 h-16 text-orange-500 animate-pulse relative z-10" />
                <div className="space-y-4 relative z-10">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Harici Kaynak Hazır</h3>
                    <p className="text-slate-400 text-sm font-bold max-w-xs mx-auto">Bu video içeriği dış bir kaynaktan sağlanmaktadır.</p>
                    <Button
                        className="h-14 px-10 rounded-2xl bg-white text-black font-black shadow-xl hover:scale-105 active:scale-95 transition-all"
                        onClick={() => window.open(url, '_blank')}
                    >
                        ŞİMDİ İZLE
                    </Button>
                </div>
            </div>
        );
    }

    const videoId = getYoutubeId(url);

    return (
        <div className="w-full h-full relative plyr-container group/video" style={{ '--plyr-color-main': '#f97316' } as any}>
            {/* YouTube Interaction Shield (from previous logic) */}
            <div
                className="absolute inset-x-0 top-0 h-[calc(100%-60px)] z-[40] cursor-pointer"
                onContextMenu={(e) => e.preventDefault()}
                onClick={() => {
                    const plyr = plyrRef.current?.plyr;
                    if (plyr) plyr.togglePlay();
                }}
            />

            {videoId && (
                <div className="w-full h-full [&_.plyr]:h-full [&_.plyr__video-wrapper]:h-full [&_iframe]:pointer-events-none [&_.plyr__controls]:z-[60]">
                    <Plyr
                        ref={plyrRef}
                        source={{
                            type: 'video',
                            sources: [{ src: videoId, provider: 'youtube' }],
                        }}
                        options={{
                            autoplay: true,
                            youtube: {
                                noCookie: true,
                                rel: 0,
                                showinfo: 0,
                                iv_load_policy: 3,
                                modestbranding: 1
                            },
                            settings: ['quality', 'speed'],
                            tooltips: {
                                controls: true,
                                seek: true
                            }
                        }}
                    />
                </div>
            )}

            {isCompleted && (
                <div className="absolute top-4 left-4 z-40 pointer-events-none">
                    <Badge className="bg-emerald-500 text-white border-none font-black text-[10px] uppercase px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        TAMAMLANDI
                    </Badge>
                </div>
            )}
        </div>
    );
}
