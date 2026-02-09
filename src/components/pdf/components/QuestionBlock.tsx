import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { tw, getImageUrl } from '../PDFConfig';

export const QuestionBlock = ({ q, index, spacing, settings, primaryColor, template }: any) => {
    const qSpacing = q.bottomSpacing || spacing;
    const showDebug = settings?.showDebug || false;
    const showDifficulty = settings?.showDifficulty || false;

    const getDifficultyColor = (score: number) => {
        if (score <= 4) return "#22c55e";
        if (score <= 7) return "#f59e0b";
        return "#ef4444";
    };

    const getIndexStyle = () => {
        if (template === 'modern') return tw("text-[13px] font-bold text-orange-500");
        if (template === 'compact') return tw("text-[11px] font-black text-gray-800");
        if (template === 'elegant') return { fontSize: 12, fontWeight: 700 as any, color: primaryColor, fontFamily: 'Oswald' };
        if (template === 'exam') return {
            fontSize: 13,
            fontWeight: 900 as any,
            color: '#000',
            backgroundColor: '#f3f4f6',
            width: 22,
            height: 22,
            textAlign: 'center' as const,
            borderRadius: 11,
            padding: 1
        };
        if (template === 'osym') return { fontSize: 11, fontWeight: 700 as any, color: '#000' };
        return tw("text-[12px] font-bold text-red-600");
    };

    return (
        <View style={tw("w-full")}>
            <View style={[
                tw("w-full p-[2px] flex-row items-start"),
                showDebug ? { borderWidth: 1, borderColor: '#2563eb', backgroundColor: 'rgba(37, 99, 235, 0.02)' } : {}
            ]}>
                <View style={tw("w-[30px] mr-[4px] items-center pt-[2px]")}>
                    {template === 'classic' ? (
                        <View style={{
                            ...tw("w-[24px] h-[24px] rounded-[12px]"),
                            backgroundColor: 'rgba(253, 253, 253, 0.71)',
                            borderColor: 'rgba(220, 38, 38, 0.2)',
                            borderWidth: 1,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text style={getIndexStyle()}>
                                {index + 1}
                            </Text>
                        </View>
                    ) : (
                        <Text style={getIndexStyle()}>{index + 1}.</Text>
                    )}

                    {showDifficulty && q.difficulty && (
                        <View style={{
                            ...tw("mt-2 px-1 py-0.5 rounded-[4px] min-w-[20px] items-center"),
                            backgroundColor: `${getDifficultyColor(q.difficulty)}15`,
                            borderWidth: 0.5,
                            borderColor: getDifficultyColor(q.difficulty)
                        }}>
                            <Text style={{ fontSize: 6, fontWeight: 'bold', color: getDifficultyColor(q.difficulty) }}>
                                P:{q.difficulty}
                            </Text>
                        </View>
                    )}
                </View>
                <View style={tw("flex-1")}>
                    <Image
                        src={getImageUrl(q.imageUrl)}
                        style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                    />
                </View>
            </View>

            <View style={[
                { height: qSpacing * 2.83 },
                showDebug ? {
                    borderWidth: 1,
                    borderStyle: 'dashed',
                    borderColor: '#ef4444',
                    borderTopWidth: 0,
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    alignItems: 'center',
                    justifyContent: 'center'
                } : {}
            ]}>
                {showDebug && (
                    <View style={tw("items-center justify-center")}>
                        <View style={{ backgroundColor: '#000000ff', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginBottom: 3 }}>
                            <Text style={{ fontSize: 10, color: '#fff', fontWeight: 'black' }}>
                                BOŞLUK: {qSpacing}mm
                            </Text>
                        </View>
                        <Text style={{ fontSize: 7, color: '#000000ff', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
                            Dizgi Uzman Modu • Hassas Ayar Alanı
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};
