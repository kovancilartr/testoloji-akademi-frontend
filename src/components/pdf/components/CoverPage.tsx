import React from 'react';
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { tw } from '../PDFConfig';

export const CoverPage = ({ settings, projectName, primaryColor }: any) => {
    const template = settings?.coverTemplate || 'modern_gradient';

    if (template === 'modern_gradient') {
        return (
            <Page size="A4" style={tw("bg-white flex flex-col items-center p-10")}>
                {/* Decorative Background Elements */}
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
                    <View style={{ width: '100%', height: '100%', backgroundColor: primaryColor, opacity: 0.02 }} />
                    <View style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, borderRadius: 150, backgroundColor: primaryColor, opacity: 0.05 }} />
                </View>

                {/* Top Right: QR Code Block */}
                <View style={tw("absolute top-10 right-10 items-center")}>
                    <View style={[tw("px-3 py-1 rounded-t-lg"), { backgroundColor: primaryColor }]}>
                        <Text style={tw("text-white text-[8px] font-black")}>VİDEO DERSLER</Text>
                    </View>
                    <View style={[tw("p-1 border-[1.5pt] rounded-b-lg bg-white"), { borderColor: primaryColor }]}>
                        {settings?.qrCodeUrl ? (
                            <Image
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(settings.qrCodeUrl)}`}
                                style={tw("w-14 h-14")}
                            />
                        ) : (
                            <View style={tw("w-14 h-14 bg-gray-50 items-center justify-center")}>
                                <Text style={tw("text-[6px] text-gray-400 capitalize")}>QR Kod</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Main Content Area */}
                <View style={tw("mt-16 items-center w-full")}>
                    {/* Main Title Group */}
                    <View style={tw("items-center mb-6")}>
                        <Text style={{ fontSize: 40, fontWeight: 900, color: primaryColor, fontFamily: 'Montserrat', textAlign: 'center', textTransform: 'uppercase' }}>
                            {settings?.coverTitle || projectName}
                        </Text>
                        <Text style={tw("text-gray-900 text-2xl font-black uppercase mt-1 tracking-[4px]")}>VİDEO DERS KİTABI</Text>
                    </View>

                    {/* Author Portrait Section */}
                    <View style={tw("relative my-8 items-center")}>
                        <View style={{
                            width: 170,
                            height: 170,
                            borderRadius: 85,
                            borderWidth: 8,
                            borderColor: primaryColor,
                            padding: 4,
                            backgroundColor: 'white',
                            overflow: 'hidden',
                        }}>
                            <View style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 75,
                                backgroundColor: `${primaryColor}15`,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Text style={{ fontSize: 40, fontWeight: 900, color: primaryColor }}>
                                    {settings?.authorName ? settings.authorName[0] : 'A'}
                                </Text>
                            </View>
                        </View>

                        {/* Author Name Badge */}
                        <View style={[tw("absolute -bottom-2 px-8 py-2 rounded-full"), { backgroundColor: primaryColor }]}>
                            <Text style={tw("text-white text-[9px] font-black uppercase tracking-widest")}>
                                {settings?.authorName || 'EĞİTMEN ADI'}
                            </Text>
                        </View>
                    </View>

                    {/* Campaign/Subtitle Block */}
                    <View style={tw("mt-12 items-center")}>
                        <View style={[tw("px-14 py-4 rounded-2xl"), { backgroundColor: primaryColor }]}>
                            <Text style={tw("text-white text-2xl font-black text-center uppercase tracking-tighter")}>
                                {settings?.subtitle || 'GENEL TEKRAR KAMPI'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Footer Section */}
                <View style={tw("absolute bottom-20 w-full items-center")}>
                    {/* YouTube Branding */}
                    <View style={[tw("flex-row items-center gap-2 px-4 py-2 rounded-lg mb-6"), { backgroundColor: primaryColor }]}>
                        <View style={tw("w-6 h-6 bg-white rounded-full items-center justify-center")}>
                            <Text style={{ color: primaryColor, fontSize: 10, fontWeight: 'black' }}>▶</Text>
                        </View>
                        <Text style={tw("text-white text-[9px] font-black")}>YouTube Anlatımlı</Text>
                    </View>

                    <Text style={tw("text-gray-500 text-[14px] font-bold italic mb-2")}>
                        "Öğrenilmemiş konu kalmayacak..."
                    </Text>
                    <Text style={tw("text-gray-400 text-[10px] font-bold")}>
                        {settings?.schoolName || 'Testoloji Akademi'} desteğiyle...
                    </Text>
                </View>

                {/* Bottom Logo */}
                <View style={tw("absolute bottom-10 left-10")}>
                    <View style={tw("w-10 h-10 border-2 border-gray-100 rounded-lg items-center justify-center opacity-40")}>
                        <Text style={tw("text-gray-800 font-black")}>T</Text>
                    </View>
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

    if (template === 'premium_vdk') {
        return (
            <Page size="A4" style={tw("bg-white flex flex-col items-center p-10")}>
                {/* Top Right: QR Code Block */}
                <View style={tw("absolute top-10 right-10 items-center")}>
                    <View style={[tw("bg-blue-900 px-3 py-1 rounded-t-lg"), { backgroundColor: '#1e3a8a' }]}>
                        <Text style={tw("text-white text-[8px] font-black")}>VİDEO DERSLER</Text>
                    </View>
                    <View style={tw("p-1 border-[1.5pt] border-blue-900 rounded-b-lg")}>
                        {settings?.qrCodeUrl ? (
                            <Image
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(settings.qrCodeUrl)}`}
                                style={tw("w-16 h-16")}
                            />
                        ) : (
                            <View style={tw("w-16 h-16 bg-gray-100 items-center justify-center")}>
                                <Text style={tw("text-[6px] text-gray-400 capitalize")}>QR Kod</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Main Content Area */}
                <View style={tw("mt-20 items-center w-full")}>
                    {/* Main Title Group */}
                    <View style={tw("items-center mb-8")}>
                        <Text style={{ fontSize: 60, fontWeight: 900, color: '#1e3a8a', fontFamily: 'Montserrat', textAlign: 'center' }}>
                            {settings?.coverTitle || projectName}
                        </Text>
                        <Text style={tw("text-gray-900 text-3xl font-black uppercase mt-2 tracking-widest")}>VİDEO DERS KİTABI</Text>
                    </View>

                    {/* Author Portrait Section */}
                    <View style={tw("relative my-10 items-center")}>
                        <View style={{
                            width: 180,
                            height: 180,
                            borderRadius: 90,
                            borderWidth: 10,
                            borderColor: '#1e3a8a',
                            padding: 5,
                            backgroundColor: 'white',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            <View style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 75,
                                backgroundColor: primaryColor,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Text style={tw("text-white text-5xl font-black")}>
                                    {settings?.authorName ? settings.authorName[0] : 'T'}
                                </Text>
                            </View>
                        </View>
                        {/* Circular Text Border (Simplified) */}
                        <View style={tw("absolute -top-4 -bottom-4 -left-4 -right-4 border border-gray-200 rounded-full opacity-20")} />

                        {/* Author Name Badge */}
                        <View style={[tw("absolute -bottom-2 bg-blue-900 px-6 py-2 rounded-full"), { backgroundColor: '#1e3a8a' }]}>
                            <Text style={tw("text-white text-[10px] font-black uppercase tracking-widest")}>
                                {settings?.authorName || 'EĞİTMEN ADI'}
                            </Text>
                        </View>
                    </View>

                    {/* Campaign Title Block */}
                    <View style={tw("mt-10 items-center")}>
                        <View style={tw("relative px-12 py-4")}>
                            {/* Layered Text for Shadow Effect */}
                            <Text style={{ fontSize: 36, fontWeight: 900, color: 'white', textAlign: 'center', backgroundColor: primaryColor, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 15 }}>
                                {settings?.subtitle || '60 DERSTE TYT KAMPI'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Footer Section */}
                <View style={tw("absolute bottom-20 w-full items-center")}>
                    {/* YouTube Branding */}
                    <View style={[tw("flex-row items-center gap-2 bg-blue-900 px-4 py-2 rounded-lg mb-6"), { backgroundColor: '#1e3a8a' }]}>
                        <View style={tw("w-6 h-6 bg-white rounded-full items-center justify-center")}>
                            <Text style={{ color: '#1e3a8a', fontSize: 10, fontWeight: 'black' }}>▶</Text>
                        </View>
                        <Text style={tw("text-white text-[10px] font-black")}>YouTube Anlatımlı</Text>
                    </View>

                    <Text style={tw("text-gray-400 text-[14px] font-bold italic mb-2")}>
                        "Öğrenilmemiş konu kalmayacak..."
                    </Text>
                    <Text style={tw("text-gray-300 text-[10px] font-bold")}>
                        {settings?.schoolName || 'Testoloji Akademi Yayınları'} desteğiyle...
                    </Text>
                </View>

                {/* Bottom Logo */}
                <View style={tw("absolute bottom-10 left-10")}>
                    <View style={tw("w-12 h-12 border-2 border-gray-100 rounded-lg items-center justify-center opacity-30")}>
                        <Text style={tw("text-gray-900 font-bold")}>M</Text>
                    </View>
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
