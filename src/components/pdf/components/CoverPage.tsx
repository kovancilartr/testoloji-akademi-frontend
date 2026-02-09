import React from 'react';
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { tw } from '../PDFConfig';

export const CoverPage = ({ settings, projectName, primaryColor }: any) => {
    const template = settings?.coverTemplate || 'modern_gradient';

    if (template === 'modern_gradient') {
        return (
            <Page size="A4" style={tw("bg-white flex flex-col items-center justify-between p-20")}>
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
                    <View style={{ width: '100%', height: '100%', backgroundColor: primaryColor, opacity: 0.03 }} />
                    <View style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: 200, backgroundColor: primaryColor, opacity: 0.1 }} />
                    <View style={{ position: 'absolute', bottom: -150, left: -150, width: 500, height: 500, borderRadius: 250, backgroundColor: primaryColor, opacity: 0.05 }} />
                </View>

                <View style={tw("items-center mt-20")}>
                    <View style={{ ...tw("w-24 h-24 rounded-3xl items-center justify-center mb-10"), backgroundColor: primaryColor }}>
                        <Text style={tw("text-white text-4xl font-black")}>T</Text>
                    </View>
                    <Text style={{ ...tw("text-4xl font-black uppercase text-center mb-4"), color: primaryColor }}>{settings?.coverTitle || projectName}</Text>
                    <View style={{ width: 60, height: 6, backgroundColor: primaryColor, borderRadius: 3 }} />
                </View>

                <View style={tw("items-center mb-20")}>
                    <Text style={tw("text-gray-400 text-sm font-bold uppercase tracking-[8px] mb-2")}>SORU BANKASI</Text>
                    <Text style={tw("text-gray-600 text-lg font-bold uppercase tracking-widest")}>{settings?.schoolName || 'Eğitim Serisi'}</Text>
                    {settings?.authorName && (
                        <Text style={tw("text-gray-400 text-xs font-bold mt-4 uppercase")}>Hazırlayan: {settings.authorName}</Text>
                    )}
                </View>

                <View style={tw("w-full border-t border-gray-100 pt-10 flex-row justify-between items-end")}>
                    <View>
                        <Text style={tw("text-[10px] font-black text-gray-300 uppercase tracking-widest")}>TESTOLOJİ AI ENGINE</Text>
                        <Text style={tw("text-[8px] font-bold text-gray-400 mt-1 uppercase")}>Professional Edition</Text>
                    </View>
                    {settings?.qrCodeUrl && (
                        <Image
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(settings.qrCodeUrl)}`}
                            style={tw("w-16 h-16")}
                        />
                    )}
                </View>
            </Page>
        );
    }

    if (template === 'minimalist_shapes') {
        return (
            <Page size="A4" style={tw("bg-white flex flex-col p-20")}>
                <View style={{ position: 'absolute', top: 0, left: 0, width: 200, height: '100%', backgroundColor: primaryColor, opacity: 0.8 }} />

                <View style={tw("ml-40 mt-40 flex-1")}>
                    <View style={{ width: 40, height: 4, backgroundColor: '#333', marginBottom: 20 }} />
                    <Text style={tw("text-5xl font-black text-gray-900 leading-tight")}>
                        {settings?.coverTitle || projectName}
                    </Text>
                    <Text style={{ ...tw("text-xl font-bold mt-4"), color: primaryColor }}>{settings?.schoolName || 'Soru Kitapçığı'}</Text>

                    <View style={tw("mt-20 space-y-4")}>
                        <View style={tw("flex-row items-center gap-3")}>
                            <View style={{ width: 8, height: 8, backgroundColor: primaryColor, borderRadius: 4 }} />
                            <Text style={tw("text-gray-600 font-bold uppercase text-[10px] tracking-widest")}>Yüksek Çözünürlüklü Sorular</Text>
                        </View>
                        <View style={tw("flex-row items-center gap-3")}>
                            <View style={{ width: 8, height: 8, backgroundColor: primaryColor, borderRadius: 4 }} />
                            <Text style={tw("text-gray-600 font-bold uppercase text-[10px] tracking-widest")}>Akıllı Dizgi Sistemi</Text>
                        </View>
                    </View>
                </View>

                <View style={tw("ml-40 mb-10 border-t border-gray-100 pt-10")}>
                    <Text style={tw("text-gray-400 font-bold uppercase text-[8px] tracking-[4px]")}>TESTOLOJİ AI SOLUTIONS</Text>
                </View>
            </Page>
        );
    }

    // Creative Pattern
    return (
        <Page size="A4" style={tw("bg-white p-0")}>
            <View style={{ width: '100%', height: '40%', backgroundColor: primaryColor, position: 'relative' }}>
                <View style={tw("absolute bottom-10 left-10")}>
                    <Text style={tw("text-white text-5xl font-black uppercase")}>{settings?.coverTitle || projectName}</Text>
                    <Text style={tw("text-white/80 text-sm font-bold mt-2 tracking-[5px] uppercase")}>{settings?.schoolName || 'Özel Seri'}</Text>
                </View>
            </View>
            <View style={tw("p-20 flex-1 justify-between")}>
                <View>
                    <Text style={tw("text-gray-300 font-black text-7xl opacity-20 -mb-6")}>BANK</Text>
                    <Text style={tw("text-gray-900 font-black text-4xl")}>QUESTION ARŞİVİ</Text>
                    <Text style={tw("text-gray-500 font-bold mt-10 leading-relaxed text-sm")}>
                        Bu döküman Testoloji yapay zeka motoru tarafından otomatik olarak dizilmiştir. Tüm sorular seçilen kaynaklardan derlenmiştir.
                    </Text>
                </View>

                <View style={tw("flex-row justify-between items-center")}>
                    <View>
                        <Text style={tw("text-gray-400 font-black text-[10px] uppercase")}>Döküman ID</Text>
                        <Text style={tw("text-gray-900 font-bold text-xs")}>TL-{Math.random().toString(36).substr(2, 9).toUpperCase()}</Text>
                    </View>
                    <View style={{ ...tw("w-12 h-12 rounded-full items-center justify-center border-2"), borderColor: primaryColor }}>
                        <Text style={{ ...tw("font-black text-xl"), color: primaryColor }}>T</Text>
                    </View>
                </View>
            </View>
        </Page>
    );
};
