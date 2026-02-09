import React from 'react';
import { Page, Text, View, Document, Image, Font } from '@react-pdf/renderer';
import { PDFTemplateProps, USABLE_HEIGHT, COL_WIDTH_2, COL_WIDTH_1, tw } from './PDFConfig';
import { CoverPage } from './components/CoverPage';
import { QuestionBlock } from './components/QuestionBlock';
import { TemplateHeader } from './components/TemplateHeader';
import { TemplateFooter } from './components/TemplateFooter';

import { registerPdfFonts } from '@/lib/pdf-fonts';

// Register fonts once
registerPdfFonts();

// --- Main Document ---
export const PDFDocument = ({ questions, projectName, settings, userRole }: PDFTemplateProps) => {
  const colCount = settings?.colCount || 2;
  const spacing = settings?.questionSpacing || 20;
  const primaryColor = settings?.primaryColor || "#f97316";
  const template = settings?.template || "classic";

  const pages = React.useMemo(() => {
    const calculatedPages: any[] = [];
    let currentPage = { left: [] as any[], right: [] as any[], projectIndex: 0 };
    let leftHeight = 0;
    let rightHeight = 0;
    let currentColumn: 'left' | 'right' = 'left';

    // Atomic questions with fixed global indices to prevent drift
    const indexedQuestions = questions.map((q, idx) => ({ ...q, autoIndex: idx }));

    indexedQuestions.forEach((q) => {
      if (currentPage.left.length === 0 && currentPage.right.length === 0) {
        currentPage.projectIndex = q.projectIndex || 0;
      }

      const renderWidth = colCount === 1 ? COL_WIDTH_1 : COL_WIDTH_2;
      const imgWidth = q.width || 800;
      const imgHeight = q.height || 600;
      const renderHeight = (renderWidth / imgWidth) * imgHeight;
      const qSpacing = q.bottomSpacing || spacing;
      const qSpacingPt = qSpacing * 2.83;
      const totalQHeight = renderHeight + qSpacingPt + 15;

      if (colCount === 1) {
        if (leftHeight + totalQHeight > USABLE_HEIGHT && currentPage.left.length > 0) {
          calculatedPages.push(currentPage);
          currentPage = { left: [q], right: [], projectIndex: q.projectIndex || 0 };
          leftHeight = totalQHeight;
        } else {
          currentPage.left.push(q);
          leftHeight += totalQHeight;
        }
      } else {
        // Double column logic
        if (currentColumn === 'left') {
          if (leftHeight + totalQHeight <= USABLE_HEIGHT) {
            currentPage.left.push(q);
            leftHeight += totalQHeight;
          } else {
            currentColumn = 'right';
            if (rightHeight + totalQHeight <= USABLE_HEIGHT) {
              currentPage.right.push(q);
              rightHeight += totalQHeight;
            } else {
              calculatedPages.push(currentPage);
              currentPage = { left: [q], right: [], projectIndex: q.projectIndex || 0 };
              leftHeight = totalQHeight;
              rightHeight = 0;
              currentColumn = 'left';
            }
          }
        } else {
          // Stay in right or start new page
          if (rightHeight + totalQHeight <= USABLE_HEIGHT) {
            currentPage.right.push(q);
            rightHeight += totalQHeight;
          } else {
            calculatedPages.push(currentPage);
            currentPage = { left: [q], right: [], projectIndex: q.projectIndex || 0 };
            leftHeight = totalQHeight;
            rightHeight = 0;
            currentColumn = 'left';
          }
        }
      }
    });

    if (currentPage.left.length > 0 || currentPage.right.length > 0) {
      calculatedPages.push(currentPage);
    }
    return calculatedPages;
  }, [questions, colCount, spacing, template]);

  return (
    <Document title={settings?.title || projectName}>
      {settings?.showCoverPage && (
        <CoverPage settings={settings} projectName={projectName} primaryColor={primaryColor} />
      )}
      {pages.map((page, pIdx) => (
        <Page key={pIdx} size="A4" style={[
          tw(`bg-white ${template === 'modern' ? 'pt-[65px] pb-[55px]' :
            template === 'compact' ? 'pt-[65px] pb-[45px]' :
              template === 'elegant' ? 'pt-[75px] pb-[55px]' :
                template === 'exam' ? 'pt-[85px] pb-[45px]' :
                  template === 'osym' ? 'pt-[105px] pb-[45px]' :
                    'pt-[95px] pb-[40px]'
            } px-[10px]`),
          { fontFamily: settings?.fontFamily || 'Open Sans' }
        ]}>
          <TemplateHeader template={template} settings={settings} projectName={projectName} primaryColor={primaryColor} projectIndex={page.projectIndex} questionsCount={questions.length} />

          <View style={tw("flex-row w-full items-start h-full")}>
            <View style={tw("flex-1 pr-[5px]")}>
              {page.left.map((q: any) => (
                <QuestionBlock key={q.id} q={q} index={q.autoIndex} spacing={spacing} settings={settings} primaryColor={primaryColor} template={template} />
              ))}
            </View>

            {colCount === 2 && (
              <>
                <View style={[tw(`w-[1px] relative mx-[5px]`), {
                  height: '100%',
                  backgroundColor: template === 'osym' ? '#d1d5db' : (template === 'modern' || template === 'compact' ? primaryColor : '#e5e7eb'),

                }]}>
                  {settings?.watermarkText && template !== 'osym' && (
                    <View style={{ transform: 'rotate(-90deg)', width: 400, alignItems: 'center', position: 'absolute', left: -200, top: '40%', zIndex: 100 }}>
                      <Text style={tw("text-[10px] text-gray-400 font-bold tracking-[4px] uppercase bg-white px-3 py-1")}>
                        {settings.watermarkText}
                      </Text>
                    </View>
                  )}
                  {template === 'osym' && settings?.watermarkText && (
                    <View style={{ transform: 'rotate(-90deg)', width: 400, alignItems: 'center', position: 'absolute', left: -200, top: '40%', zIndex: 100 }}>
                      <Text style={tw("text-[8px] text-gray-100 font-bold tracking-[8px] uppercase bg-white px-2 py-0.5")}>
                        {settings.watermarkText}
                      </Text>
                    </View>
                  )}
                  {template === 'compact' && (
                    <View style={{ position: 'absolute', top: '25%', left: -10, width: 22, height: 22, backgroundColor: 'white', borderRadius: 11, border: `1px solid ${primaryColor}`, alignItems: 'center', justifyContent: 'center', zIndex: 101 }}>
                      <Text style={{ fontSize: 7, fontWeight: 'black', color: primaryColor, marginTop: 7 }}>T</Text>
                    </View>
                  )}
                </View>

                <View style={tw("flex-1 pl-[5px]")}>
                  {page.right.map((q: any) => (
                    <QuestionBlock key={q.id} q={q} index={q.autoIndex} spacing={spacing} settings={settings} primaryColor={primaryColor} template={template} />
                  ))}
                </View>
              </>
            )}
          </View>

          <TemplateFooter template={template} settings={settings} primaryColor={primaryColor} />

          {/* Watermark for Guest (null) and Bronze Users */}
          {(!userRole || userRole === 'BRONZ') && (
            <>
              {/* Repeating watermark pattern */}
              {[0, 1, 2, 3, 4, 5].map((row) => (
                <React.Fragment key={row}>
                  {[0, 1, 2].map((col) => (
                    <View
                      key={`${row}-${col}`}
                      style={{
                        position: 'absolute',
                        top: row * 140 + 50,
                        left: col * 200 + 30,
                        transform: 'rotate(-45deg)',
                      }}
                      fixed
                    >
                      <Text style={{
                        fontSize: 18,
                        fontWeight: 'black',
                        color: '#666',
                        opacity: 0.12,
                        letterSpacing: 2,
                      }}>TESTOLOJİ</Text>
                    </View>
                  ))}
                </React.Fragment>
              ))}
            </>
          )}

          {/* Answer Key logic at the end */}
          {pIdx === pages.length - 1 && settings?.showAnswerKey && (
            <View style={tw("mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-200")} wrap={false}>
              <Text style={{ ...tw("text-[12px] font-bold uppercase mb-4 text-center"), color: primaryColor }}>
                Cevap Anahtarı
              </Text>
              <View style={tw("flex-row flex-wrap justify-center gap-4")}>
                {questions.map((q, idx) => (
                  <View key={q.id} style={tw("w-[40px] border border-gray-200 rounded-lg bg-white overflow-hidden")}>
                    <View style={{ ...tw("bg-gray-100 py-1"), borderBottomWidth: 0.5, borderColor: '#e5e7eb' }}>
                      <Text style={tw("text-[10px] font-bold text-center")}>{idx + 1}</Text>
                    </View>
                    <View style={tw("py-1.5")}>
                      <Text style={tw("text-[12px] font-bold text-center text-gray-800")}>
                        {q.correctAnswer || "?"}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </Page>
      ))}
    </Document>
  );
};
