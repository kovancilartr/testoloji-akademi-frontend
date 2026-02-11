import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { tw } from '../PDFConfig';

export const TemplateFooter = ({ template, settings, primaryColor }: any) => {
    if (template === 'osym') {
        return (
            <View style={tw("absolute bottom-[15px] left-[20px] right-[20px] flex-row items-center border-t border-gray-100 pt-3")} fixed>
                <View style={tw("flex-1")} />
                <View style={tw("flex-1 items-center")}>
                    <Text style={tw("text-[10px] font-black text-black")} render={({ pageNumber }) => `${pageNumber}`} />
                </View>
                <View style={tw("flex-1 items-end")}>
                    <Text style={tw("text-[9px] font-black text-black uppercase")}>Diğer sayfaya geçiniz.</Text>
                </View>
            </View>
        );
    }

    if (template === 'modern') {
        return (
            <View style={tw("absolute bottom-[15px] left-[15px] right-[15px] h-[35px] flex-row items-center")} fixed>
                <View style={{ ...tw("w-10 h-7 bg-white border-2 rounded-[4px] items-center justify-center z-10"), borderColor: primaryColor }}>
                    <Text style={{ fontSize: 11, fontWeight: 'black', color: '#111' }} render={({ pageNumber }) => `${pageNumber}`} />
                </View>
                <View style={{ ...tw("flex-1 h-[6px] rounded-full -ml-[10px]"), backgroundColor: primaryColor }} />

                <View style={tw("flex-row items-center gap-4 ml-4")}>
                    {settings?.qrCodeUrl && (
                        <View style={tw("bg-white p-1 rounded-sm shadow-sm border border-gray-100")}>
                            <Image
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(settings.qrCodeUrl)}`}
                                style={tw("w-14 h-14")}
                            />
                        </View>
                    )}
                    <Text style={tw("text-[7px] font-black text-gray-400 uppercase tracking-widest")}>TESTOLOJİ AI ENGINE</Text>
                </View>
            </View>
        );
    }

    if (template === 'compact') {
        return (
            <View style={tw("absolute bottom-[10px] left-[15px] right-[15px] flex-row items-center justify-between")} fixed>
                <Text style={tw("text-[6px] text-gray-400 font-bold uppercase tracking-widest")}>Testoloji Compact 2.0</Text>
                <View style={tw("items-center justify-center")}>
                    <View style={{
                        width: 18,
                        height: 18,
                        backgroundColor: primaryColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Text style={{ fontSize: 9, fontWeight: 'black', color: 'white' }} render={({ pageNumber }) => `${pageNumber}`} />
                    </View>
                </View>
                <Text style={tw("text-[6px] text-gray-400 font-bold uppercase")}>{new Date().toLocaleDateString('tr-TR')}</Text>
            </View>
        );
    }

    if (template === 'elegant') {
        return (
            <View style={tw("absolute bottom-[10px] left-[20px] right-[20px] flex-row items-end justify-between")} fixed>
                {/* Left Decoration */}
                <View style={tw("flex-row items-center")}>
                    <Text style={{ fontSize: 18, fontWeight: 'black', color: primaryColor, opacity: 0.8 }}>{'>>'}</Text>
                </View>

                {/* Center Page Number */}
                <View style={tw("items-center")}>
                    <View style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: primaryColor,
                        backgroundColor: 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                    }}>
                        <View style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            borderWidth: 0.5,
                            borderColor: primaryColor,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text style={{ fontSize: 10, fontWeight: 'black', color: '#111' }} render={({ pageNumber }) => `${pageNumber}`} />
                        </View>
                    </View>
                </View>

                {/* Right Decoration */}
                <View style={tw("flex-row items-center justify-end")}>
                    <View style={tw("rotate-180")}>
                        <Text style={{ fontSize: 18, fontWeight: 'black', color: primaryColor, opacity: 0.8 }}>{'>>'}</Text>
                    </View>
                </View>
            </View>
        );
    }

    if (template === 'exam') {
        return (
            <View style={tw("absolute bottom-[10px] left-[20px] right-[20px] flex-row items-center justify-between border-t border-gray-100 pt-3")} fixed>
                <Text style={tw("text-[7px] font-black text-gray-400 uppercase tracking-widest")}>Testoloji Kurumsal Deneme Sınavı</Text>
                <View style={tw("flex-row items-center")}>
                    <View style={[tw("border px-3 py-1"), { borderColor: '#111', borderRadius: 4 }]}>
                        <Text style={tw("text-[9px] font-black text-black")} render={({ pageNumber }) => `${pageNumber}`} />
                    </View>
                </View>
                <Text style={tw("text-[7px] font-black text-gray-500 uppercase tracking-tight")}>{settings?.schoolName || 'Başarılar Dileriz'}</Text>
            </View>
        );
    }

    // Classic
    return (
        <View style={tw("absolute bottom-[10px] left-[20px] right-[20px] flex-row items-center justify-between")} fixed>
            <View style={tw("flex-1")}>
                <Text style={tw("text-[6px] font-bold text-gray-300 uppercase tracking-[2px]")}>
                    Testoloji AI - Akıllı Dizgi Sistemi
                </Text>
            </View>
            <View style={tw("flex-1 items-center")}>
                <View style={{ ...tw("px-[12px] py-[4px] rounded-[14px]"), backgroundColor: primaryColor }}>
                    <Text style={tw("text-white text-[10px] font-bold")} render={({ pageNumber }) => `${pageNumber}`} />
                </View>
            </View>
            <View style={tw("flex-1")} />
        </View>
    );
};
