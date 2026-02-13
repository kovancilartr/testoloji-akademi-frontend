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

// Strip LaTeX expressions and convert to readable plain text
function stripLatex(text: string): string {
    // Replace block LaTeX $$...$$ first
    let result = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, expr) => latexToPlain(expr));
    // Replace inline LaTeX $...$
    result = result.replace(/\$((?:[^$\\]|\\.)+)\$/g, (_, expr) => latexToPlain(expr));
    return result;
}

function latexToPlain(expr: string): string {
    let text = expr.trim();

    // Common LaTeX commands → readable equivalents
    text = text.replace(/\\%/g, '%');
    text = text.replace(/\\times/g, '×');
    text = text.replace(/\\div/g, '÷');
    text = text.replace(/\\cdot/g, '·');
    text = text.replace(/\\pm/g, '±');
    text = text.replace(/\\leq/g, '≤');
    text = text.replace(/\\geq/g, '≥');
    text = text.replace(/\\neq/g, '≠');
    text = text.replace(/\\approx/g, '≈');
    text = text.replace(/\\infty/g, '∞');
    text = text.replace(/\\pi/g, 'π');
    text = text.replace(/\\alpha/g, 'α');
    text = text.replace(/\\beta/g, 'β');
    text = text.replace(/\\theta/g, 'θ');
    text = text.replace(/\\Delta/g, 'Δ');
    text = text.replace(/\\sqrt\{([^}]+)\}/g, '√($1)');
    text = text.replace(/\\sqrt\s*(\w)/g, '√$1');
    text = text.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1/$2');
    text = text.replace(/\\left/g, '');
    text = text.replace(/\\right/g, '');
    text = text.replace(/\\text\{([^}]+)\}/g, '$1');
    text = text.replace(/\\textbf\{([^}]+)\}/g, '$1');
    text = text.replace(/\\textit\{([^}]+)\}/g, '$1');
    text = text.replace(/\\mathrm\{([^}]+)\}/g, '$1');
    text = text.replace(/\\mathbf\{([^}]+)\}/g, '$1');
    text = text.replace(/\\overline\{([^}]+)\}/g, '$1');
    text = text.replace(/\\underline\{([^}]+)\}/g, '$1');
    text = text.replace(/\\vec\{([^}]+)\}/g, '$1');
    text = text.replace(/\\hat\{([^}]+)\}/g, '$1');
    text = text.replace(/\\bar\{([^}]+)\}/g, '$1');

    // Superscript: x^{2} → x², x^2 → x²
    const superscripts: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', 'n': 'ⁿ' };
    text = text.replace(/\^{([^}]+)}/g, (_, sup) => {
        return sup.split('').map((c: string) => superscripts[c] || c).join('');
    });
    text = text.replace(/\^(\w)/g, (_, c) => superscripts[c] || `^${c}`);

    // Subscript: x_{2} → x₂, x_2 → x₂
    const subscripts: Record<string, string> = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
    text = text.replace(/_{([^}]+)}/g, (_, sub) => {
        return sub.split('').map((c: string) => subscripts[c] || c).join('');
    });
    text = text.replace(/_(\w)/g, (_, c) => subscripts[c] || `_${c}`);

    // Remove remaining backslash commands like \quad, \, etc.
    text = text.replace(/\\[a-zA-Z]+/g, ' ');
    text = text.replace(/\\\\/g, ' ');
    text = text.replace(/\\,/g, ' ');
    text = text.replace(/\\;/g, ' ');
    text = text.replace(/\\/g, '');

    // Clean up braces and extra spaces
    text = text.replace(/[{}]/g, '');
    text = text.replace(/\s+/g, ' ').trim();

    return text;
}

// Parse **bold** inline text and strip LaTeX
function parseBoldInline(text: string): React.ReactNode {
    // First strip LaTeX from the entire text
    const cleanedText = stripLatex(text);

    const parts = cleanedText.split(/(\*\*[^*]+\*\*)/g);
    if (parts.length === 1) return cleanedText;

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
