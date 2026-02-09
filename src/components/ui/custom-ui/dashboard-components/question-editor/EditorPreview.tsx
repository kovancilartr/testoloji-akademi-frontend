import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";
import dynamic from 'next/dynamic';

const KaTeX = dynamic(() => import('react-katex').then(mod => mod.InlineMath), { ssr: false });
const BlockMath = dynamic(() => import('react-katex').then(mod => mod.BlockMath), { ssr: false });

interface EditorPreviewProps {
    content: string;
    previewRef: React.RefObject<HTMLDivElement>;
}

export function EditorPreview({ content, previewRef }: EditorPreviewProps) {
    return (
        <ScrollArea className="flex-1">
            <div className="p-4 sm:p-12 flex flex-col items-center min-h-full pb-32 sm:pb-32">
                <h3 className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 sm:mb-8">DİJİTAL KAĞIT ÖNİZLEMESİ</h3>

                <div
                    ref={previewRef}
                    className="w-full sm:w-[600px] !max-w-[95vw] sm:!max-w-none min-h-[300px] sm:min-h-[400px] bg-white shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-16 flex flex-col relative"
                >
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '15px 15px sm:20px 20px' }} />

                    <div className="relative flex-1 prose prose-orange max-w-none prose-sm leading-relaxed text-gray-900 font-medium">
                        {content.trim() ? (
                            <div className="whitespace-pre-wrap break-words text-sm sm:text-base">
                                {content.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g).map((part, i) => {
                                    if (part.startsWith('$$') && part.endsWith('$$')) {
                                        const formula = part.slice(2, -2);
                                        const BMath = BlockMath as any;
                                        return <div key={i} className="my-4 sm:my-6 text-lg sm:text-xl text-center"><BMath math={formula} /></div>;
                                    } else if (part.startsWith('$') && part.endsWith('$')) {
                                        const formula = part.slice(1, -1);
                                        const KMath = KaTeX as any;
                                        return <KMath key={i} math={formula} />;
                                    }
                                    return <span key={i}>{part}</span>;
                                })}
                            </div>
                        ) : (
                            <div className="h-full py-12 sm:py-20 flex flex-col items-center justify-center text-center opacity-20 pointer-events-none">
                                <FileText className="h-12 w-12 sm:h-20 sm:w-20 mb-4 sm:mb-6" />
                                <p className="text-base sm:text-xl font-black uppercase tracking-widest">Soru Kağıdı Boş</p>
                                <p className="text-[10px] sm:text-sm font-bold mt-2">Sol taraftan yazmaya başlayınca burada canlanacak</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
}
