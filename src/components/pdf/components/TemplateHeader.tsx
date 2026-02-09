import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { tw } from '../PDFConfig';

export const TemplateHeader = ({ template, settings, projectName, primaryColor, projectIndex, questionsCount }: any) => {
    const currentTest = projectIndex !== undefined ? projectIndex + 1 : 1;

    if (template === 'osym') {
        return (
            <View style={tw("absolute top-[20px] left-[20px] right-[20px] flex-col")} fixed>
                <View style={tw("flex-row h-[32px] gap-2 mb-2")}>
                    <View style={[tw("flex-1 border p-1 justify-center rounded-[3px]"), { borderColor: '#9ca3af' }]}>
                        <Text style={tw("text-[7px] font-bold text-gray-600")}>{settings?.subtitle || `${new Date().getFullYear()}-TYT/TEM`}</Text>
                    </View>
                    <View style={[tw("w-[280px] border p-1 justify-center items-center rounded-[3px]"), { borderColor: '#9ca3af', backgroundColor: '#02c4ffff' }]}>
                        <Text style={tw("text-[10px] font-black uppercase text-center tracking-[1px]")}>{settings?.title || projectName}</Text>
                    </View>
                    <View style={[tw("flex-1 border p-1 rounded-[3px]"), { borderColor: '#9ca3af' }]} />
                </View>
                <View style={[tw("w-full border p-2 rounded-[3px] flex-col"), { borderColor: '#9ca3af' }]}>
                    <Text style={tw("text-[8px] font-bold text-gray-800 mb-0.5")}>1. Bu testte {questionsCount || 0} soru vardır.</Text>
                    <Text style={tw("text-[8px] font-bold text-gray-800")}>2. Cevaplarınızı, cevap kâğıdının {settings?.title || projectName} için ayrılan kısmına işaretleyiniz.</Text>
                </View>
            </View>
        );
    }

    if (template === 'modern') {
        return (
            <View style={tw("absolute top-[15px] left-[15px] right-[15px] h-[35px] flex-row items-center")} fixed>
                <View style={{ ...tw("flex-1 h-full flex-row items-center px-4 rounded-[4px]"), backgroundColor: primaryColor }}>
                    <View style={tw("w-6 h-6 bg-white rotate-45 flex items-center justify-center mr-4")}>
                        <View style={tw("-rotate-45")}>
                            <Text style={{ fontSize: 10, fontWeight: 'black', color: primaryColor }}>T</Text>
                        </View>
                    </View>
                    <View style={tw("flex-row items-baseline gap-2")}>
                        <Text style={tw("text-white text-[11px] font-bold uppercase")}>{settings?.title || projectName}</Text>
                        {settings?.subtitle && (
                            <Text style={tw("text-white/80 text-[8px] font-bold")}>({settings.subtitle})</Text>
                        )}
                    </View>
                </View>
                <View style={tw("ml-2 h-full px-6 bg-gray-100 rounded-[4px] justify-center border-l-4 border-gray-300")}>
                    <Text style={tw("text-gray-600 text-[10px] font-bold uppercase tracking-widest")}>TEST {currentTest}</Text>
                </View>
            </View>
        );
    }

    if (template === 'compact') {
        return (
            <View style={tw("absolute top-[10px] left-[15px] right-[15px] h-[45px] flex-row items-center")} fixed>
                <View style={tw("flex-1 h-[1px] bg-gray-200")} />
                <View style={tw("px-4 items-center")}>
                    <View style={tw("flex-row items-center gap-2 mb-1")}>
                        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: primaryColor }} />
                        <Text style={{ fontSize: 7, fontWeight: 'black', color: primaryColor, fontFamily: 'Oswald', letterSpacing: 2 }}>TEST {currentTest}</Text>
                        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: primaryColor }} />
                    </View>
                    <Text style={tw("text-[10px] font-black text-gray-900 uppercase tracking-[2px]")}>{settings?.title || projectName}</Text>
                </View>
                <View style={tw("flex-1 h-[1px] bg-gray-200")} />
            </View>
        );
    }

    if (template === 'elegant') {
        return (
            <View style={tw("absolute top-[20px] left-[20px] right-[20px] items-center")} fixed>
                <View style={tw("w-full h-[0.5pt] bg-gray-300 mb-2")} />
                <View style={tw("flex-row items-center justify-between w-full px-4")}>
                    <Text style={tw("text-[8px] font-bold text-gray-400 uppercase tracking-[3px]")}>{settings?.schoolName || 'Testoloji Elite'}</Text>
                    <View style={tw("items-center")}>
                        <Text style={{ fontSize: 14, fontWeight: 'black', color: '#111', fontFamily: 'Montserrat', textTransform: 'uppercase', letterSpacing: 4 }}>{settings?.title || projectName}</Text>
                        {settings?.subtitle && (
                            <Text style={{ fontSize: 6, fontWeight: 'bold', color: primaryColor, marginTop: 2, letterSpacing: 2, textTransform: 'uppercase' }}>{settings.subtitle}</Text>
                        )}
                    </View>
                    <View style={tw("items-end")}>
                        <Text style={{ fontSize: 7, fontWeight: 'black', color: primaryColor }}>N° {currentTest}</Text>
                        <Text style={tw("text-[6px] font-bold text-gray-300 uppercase")}>Premium Series</Text>
                    </View>
                </View>
                <View style={tw("w-full h-[0.5pt] bg-gray-300 mt-2")} />
            </View>
        );
    }

    if (template === 'exam') {
        return (
            <View style={[tw("absolute top-[15px] left-[20px] right-[20px] h-[65px] border-[1.5pt] p-2 flex-row"), { borderColor: '#1f2937', borderRadius: 12 }]} fixed>
                <View style={tw("flex-1 justify-between py-1")}>
                    <View style={tw("flex-row border-b border-gray-100 pb-1")}>
                        <Text style={tw("text-[8px] font-black w-24 uppercase")}>Adı Soyadı :</Text>
                        <View style={tw("flex-1 border-b border-dotted border-gray-200")} />
                    </View>
                    <View style={tw("flex-row")}>
                        <Text style={tw("text-[8px] font-black w-24 uppercase")}>Sınıf / No :</Text>
                        <View style={tw("flex-1 border-b border-dotted border-gray-200")} />
                    </View>
                </View>
                <View style={[tw("w-[160px] items-center justify-center border-l border-r mx-2"), { borderColor: '#e5e7eb' }]}>
                    <Text style={tw("text-[13px] font-black uppercase text-center")}>{settings?.title || projectName}</Text>
                    <Text style={tw("text-[7px] font-bold mt-1 text-gray-500")}>{settings?.subtitle || 'Genel Değerlendirme'}</Text>
                </View>
                <View style={tw("w-[90px] items-center justify-center")}>
                    <View style={tw("items-center")}>
                        <Text style={tw("text-[7px] font-black uppercase text-gray-400")}>SINAV KODU</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'black', color: '#111', fontFamily: 'Oswald', marginTop: 2 }}>{currentTest}A-2026</Text>
                    </View>
                </View >
            </View >
        );
    }

    // Classic
    return (
        <View style={{
            ...tw("absolute top-[20px] left-[15px] right-[15px] flex-row items-center border-b-2 pb-[8px]"),
            borderBottomColor: primaryColor
        }} fixed>
            <View style={tw("flex-1 items-start")}>
                {settings?.schoolName && (
                    <Text style={tw("text-[9px] font-bold text-gray-600 mb-[3px]")}>{settings.schoolName}</Text>
                )}
                <View style={{
                    ...tw("w-[28px] h-[28px] rounded-[6px] justify-center items-center"),
                    backgroundColor: primaryColor
                }}>
                    <Text style={tw("text-white text-[16px] font-bold")}>
                        {settings?.schoolName ? settings.schoolName[0] : (projectName ? projectName[0] : 'T')}
                    </Text>
                </View>
            </View>
            <View style={tw("flex-[3] items-center")}>
                <Text style={tw("text-[20px] font-bold uppercase text-gray-800 text-center")}>
                    {settings?.title || projectName}
                </Text>
                {settings?.subtitle && (
                    <Text style={{
                        ...tw("text-[10px] font-bold mt-[4px] uppercase px-[12px] py-[3px] rounded-[4px] text-center"),
                        color: primaryColor,
                        backgroundColor: `${primaryColor}15`
                    }}>{settings.subtitle}</Text>
                )}
            </View>

            <View style={tw("flex-1 flex-row justify-end items-center gap-3")}>
                {settings?.qrCodeUrl && (
                    <View style={tw("bg-white p-1 rounded-sm shadow-sm")}>
                        <Image
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(settings.qrCodeUrl)}`}
                            style={tw("w-12 h-12")}
                        />
                    </View>
                )}
                <View style={tw("w-[48px] h-[48px] rounded-[24px] bg-gray-50 border border-gray-200 items-center justify-center")}>
                    <Text style={tw("text-[8px] font-bold text-gray-500 uppercase")}>TEST</Text>
                    <Text style={tw("text-[18px] font-bold text-gray-900")}>{currentTest}</Text>
                </View>
            </View>
        </View>
    );
};
