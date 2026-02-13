import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { registerPdfFonts } from '@/lib/pdf-fonts';

registerPdfFonts();

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Roboto',
        fontSize: 10,
        color: '#334155',
        backgroundColor: '#ffffff',
    },
    // Header
    headerBand: {
        backgroundColor: '#312e81',
        padding: 24,
        borderRadius: 12,
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    headerIcon: {
        width: 40,
        height: 40,
        backgroundColor: '#6366f1',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerIconText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 700,
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 700,
    },
    headerSubtitle: {
        color: '#a5b4fc',
        fontSize: 9,
        fontWeight: 400,
        marginTop: 2,
    },
    // Info bar
    infoBar: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
        padding: 12,
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    infoLabel: {
        fontSize: 8,
        fontWeight: 700,
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 9,
        fontWeight: 600,
        color: '#475569',
    },
    // Content
    section: {
        marginBottom: 14,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
        marginTop: 4,
    },
    sectionDot: {
        width: 6,
        height: 6,
        backgroundColor: '#6366f1',
        borderRadius: 3,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 700,
        color: '#1e293b',
    },
    subSectionTitle: {
        fontSize: 10,
        fontWeight: 700,
        color: '#475569',
        marginBottom: 4,
        marginTop: 8,
        paddingLeft: 14,
    },
    paragraph: {
        fontSize: 9.5,
        lineHeight: 1.6,
        color: '#475569',
        marginBottom: 6,
        paddingLeft: 14,
    },
    boldText: {
        fontWeight: 700,
        color: '#312e81',
    },
    listItem: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 4,
        paddingLeft: 14,
    },
    listBullet: {
        width: 4,
        height: 4,
        backgroundColor: '#6366f1',
        borderRadius: 2,
        marginTop: 4,
    },
    listText: {
        flex: 1,
        fontSize: 9.5,
        lineHeight: 1.6,
        color: '#475569',
    },
    // Divider
    divider: {
        height: 1,
        backgroundColor: '#e2e8f0',
        marginVertical: 12,
    },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 40,
        right: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 8,
    },
    footerText: {
        fontSize: 7,
        color: '#94a3b8',
    },
    footerBrand: {
        fontSize: 7,
        fontWeight: 700,
        color: '#6366f1',
    },
});

interface AiAnalysisPDFProps {
    title: string;
    content: string;
    date?: string;
}

// Simple markdown parser for PDF
function parseMarkdownToPdfElements(content: string) {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let key = 0;

    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();

        // Skip empty lines
        if (!trimmed) {
            i++;
            continue;
        }

        // H1
        if (trimmed.startsWith('# ')) {
            elements.push(
                <View key={key++} style={styles.sectionHeader}>
                    <View style={styles.sectionDot} />
                    <Text style={styles.sectionTitle}>{parseBoldInline(trimmed.slice(2))}</Text>
                </View>
            );
            i++;
            continue;
        }

        // H2
        if (trimmed.startsWith('## ')) {
            elements.push(
                <View key={key++} style={styles.sectionHeader}>
                    <View style={[styles.sectionDot, { backgroundColor: '#10b981' }]} />
                    <Text style={styles.sectionTitle}>{parseBoldInline(trimmed.slice(3))}</Text>
                </View>
            );
            i++;
            continue;
        }

        // H3
        if (trimmed.startsWith('### ')) {
            elements.push(
                <Text key={key++} style={styles.subSectionTitle}>{parseBoldInline(trimmed.slice(4))}</Text>
            );
            i++;
            continue;
        }

        // H4
        if (trimmed.startsWith('#### ')) {
            elements.push(
                <Text key={key++} style={[styles.subSectionTitle, { fontSize: 9.5 }]}>{parseBoldInline(trimmed.slice(5))}</Text>
            );
            i++;
            continue;
        }

        // HR
        if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
            elements.push(<View key={key++} style={styles.divider} />);
            i++;
            continue;
        }

        // List items (- or * or numbered)
        if (/^[-*]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)) {
            const textContent = trimmed.replace(/^[-*]\s/, '').replace(/^\d+\.\s/, '');
            elements.push(
                <View key={key++} style={styles.listItem}>
                    <View style={styles.listBullet} />
                    <Text style={styles.listText}>{parseBoldInline(textContent)}</Text>
                </View>
            );
            i++;
            continue;
        }

        // Regular paragraph
        elements.push(
            <Text key={key++} style={styles.paragraph}>{parseBoldInline(trimmed)}</Text>
        );
        i++;
    }

    return elements;
}

// Parse **bold** inline text
function parseBoldInline(text: string): React.ReactNode {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    if (parts.length === 1) return text;

    return parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <Text key={idx} style={styles.boldText}>{part.slice(2, -2)}</Text>;
        }
        return part;
    });
}

export function AiAnalysisPDF({ title, content, date }: AiAnalysisPDFProps) {
    const displayDate = date || new Date().toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const elements = parseMarkdownToPdfElements(content);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.headerBand}>
                    <View style={styles.headerIcon}>
                        <Text style={styles.headerIconText}>AI</Text>
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>AI Koç Analiz Raporu</Text>
                        <Text style={styles.headerSubtitle}>{title}</Text>
                    </View>
                </View>

                {/* Info bar */}
                <View style={styles.infoBar}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Tarih: </Text>
                        <Text style={styles.infoValue}>{displayDate}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Sınav: </Text>
                        <Text style={styles.infoValue}>{title}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Oluşturan: </Text>
                        <Text style={styles.infoValue}>Testoloji AI Koç</Text>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.section}>
                    {elements}
                </View>

                {/* Footer */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>{displayDate}</Text>
                    <Text style={styles.footerBrand}>Testoloji Akademi • AI Koç</Text>
                    <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
                </View>
            </Page>
        </Document>
    );
}
