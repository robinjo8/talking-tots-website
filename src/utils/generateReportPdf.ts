import jsPDF from 'jspdf';
import { ReportData } from '@/components/admin/ReportTemplateEditor';
import { loadRobotoFonts } from './fonts/robotoBase64';
import { formatCombinedRecommendationText } from '@/components/admin/ReportTemplateEditor';

export interface GenerateReportPdfOptions {
  hideParentSection?: boolean;
}

export async function generateReportPdf(data: ReportData, options: GenerateReportPdfOptions = {}): Promise<Blob> {
  const { hideParentSection = false } = options;
  const doc = new jsPDF();
  
  // Load and register Roboto fonts for UTF-8 support
  try {
    const fonts = await loadRobotoFonts();
    doc.addFileToVFS('Roboto-Regular.ttf', fonts.regular);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.addFileToVFS('Roboto-Bold.ttf', fonts.bold);
    doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
    doc.setFont('Roboto');
  } catch (error) {
    console.warn('Failed to load Roboto fonts, falling back to helvetica:', error);
    doc.setFont('helvetica');
  }
  
  const setFont = (style: 'normal' | 'bold') => {
    try { doc.setFont('Roboto', style); } catch { doc.setFont('helvetica', style); }
  };
  
  const addText = (text: string, x: number, y: number, options?: { align?: 'left' | 'center' | 'right' }) => {
    doc.text(text, x, y, options);
  };
  
  const splitText = (text: string, maxWidth: number): string[] => {
    return doc.splitTextToSize(text, maxWidth);
  };
  
  const getTextWidth = (text: string): number => {
    return doc.getTextWidth(text);
  };
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = 20;
  
  const greenColor: [number, number, number] = [76, 175, 80];
  const orangeColor: [number, number, number] = [255, 152, 0];
  const darkGray: [number, number, number] = [60, 60, 60];
  const mediumGray: [number, number, number] = [120, 120, 120];
  const whiteColor: [number, number, number] = [255, 255, 255];
  const borderGray: [number, number, number] = [200, 200, 200];
  const blackColor: [number, number, number] = [0, 0, 0];
  
  const formatGenderShort = (gender: string | null) => {
    if (!gender) return 'Ni podatka';
    switch (gender.toLowerCase()) {
      case 'male': return 'M';
      case 'female': return 'Ž';
      default: return gender.charAt(0).toUpperCase();
    }
  };
  
  const formatAgeShort = (age: number | null) => {
    if (!age) return 'Ni podatka';
    return `${age} let`;
  };
  
  // ===== DOCUMENT TITLE =====
  setFont('bold');
  doc.setFontSize(18);
  doc.setTextColor(...blackColor);
  addText('LOGOPEDSKO POROČILO - TOMITALK', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  const titleWidth = getTextWidth('LOGOPEDSKO POROČILO - TOMITALK');
  doc.setDrawColor(...orangeColor);
  doc.setLineWidth(1);
  doc.line((pageWidth - titleWidth) / 2, yPos, (pageWidth + titleWidth) / 2, yPos);
  yPos += 12;
  
  // ===== HELPER: Draw info box =====
  const drawTwoLineInfoBox = (
    title: string, labelLine: string, valueLine: string,
    xPos: number, startY: number, boxWidth: number, minHeight?: number
  ): number => {
    const boxPadding = 6;
    const lineHeight = 6;
    const headerHeight = 9;
    const calculatedHeight = headerHeight + boxPadding + (2 * lineHeight) + boxPadding + 2;
    const boxHeight = minHeight ? Math.max(calculatedHeight, minHeight) : calculatedHeight;
    
    doc.setFillColor(...whiteColor);
    doc.setDrawColor(...borderGray);
    doc.setLineWidth(0.5);
    doc.roundedRect(xPos, startY, boxWidth, boxHeight, 3, 3, 'FD');
    
    doc.setFillColor(...greenColor);
    doc.roundedRect(xPos, startY, boxWidth, headerHeight, 3, 3, 'F');
    doc.rect(xPos, startY + headerHeight - 3, boxWidth, 3, 'F');
    
    doc.setFontSize(9);
    setFont('normal');
    doc.setTextColor(255, 255, 255);
    addText(title, xPos + boxPadding, startY + 6);
    
    let contentY = startY + headerHeight + boxPadding + 2;
    doc.setFontSize(9);
    doc.setTextColor(...mediumGray);
    addText(labelLine, xPos + boxPadding, contentY);
    
    contentY += lineHeight;
    doc.setTextColor(...darkGray);
    addText(valueLine, xPos + boxPadding, contentY);
    
    return boxHeight;
  };
  
  // ===== TWO COLUMN LAYOUT =====
  const columnGap = 8;
  
  if (hideParentSection) {
    const childValueLine = `${data.childName || 'Ni podatka'} / ${formatAgeShort(data.childAge)} / ${formatGenderShort(data.childGender)}`;
    const boxHeight = 9 + 6 + (2 * 6) + 6 + 2;
    drawTwoLineInfoBox('PODATKI O OTROKU', 'Ime, starost, spol:', childValueLine, margin, yPos, contentWidth, boxHeight);
    yPos += boxHeight + 8;
  } else {
    const columnWidth = (contentWidth - columnGap) / 2;
    const boxHeight = 9 + 6 + (2 * 6) + 6 + 2;
    drawTwoLineInfoBox('PODATKI O STARŠU / SKRBNIKU', 'Ime in priimek', data.parentName || 'Ni podatka', margin, yPos, columnWidth, boxHeight);
    const childValueLine = `${data.childName || 'Ni podatka'} / ${formatAgeShort(data.childAge)} / ${formatGenderShort(data.childGender)}`;
    drawTwoLineInfoBox('PODATKI O OTROKU', 'Ime, starost, spol:', childValueLine, margin + columnWidth + columnGap, yPos, columnWidth, boxHeight);
    yPos += boxHeight + 8;
  }
  
  // ===== ASSESSMENT DATA =====
  const reviewBoxPadding = 6;
  const reviewHeaderHeight = 9;
  const reviewContentHeight = 8;
  const reviewBoxHeight = reviewHeaderHeight + reviewBoxPadding + reviewContentHeight + reviewBoxPadding;
  
  doc.setFillColor(...whiteColor);
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPos, contentWidth, reviewBoxHeight, 3, 3, 'FD');
  doc.setFillColor(...greenColor);
  doc.roundedRect(margin, yPos, contentWidth, reviewHeaderHeight, 3, 3, 'F');
  doc.rect(margin, yPos + reviewHeaderHeight - 3, contentWidth, 3, 'F');
  
  doc.setFontSize(9);
  setFont('normal');
  doc.setTextColor(255, 255, 255);
  addText('PODATKI O PREVERJANJU', margin + reviewBoxPadding, yPos + 6);
  
  const reviewContentY = yPos + reviewHeaderHeight + reviewBoxPadding + 4;
  doc.setFontSize(9);
  doc.setTextColor(...mediumGray);
  addText('Datum preverjanja izgovorjave:', margin + reviewBoxPadding, reviewContentY);
  doc.setTextColor(...darkGray);
  const leftLabelWidth = getTextWidth('Datum preverjanja izgovorjave: ');
  addText(data.testDate || 'Ni podatka', margin + reviewBoxPadding + leftLabelWidth, reviewContentY);
  
  doc.setTextColor(...mediumGray);
  const rightLabel = 'Datum izdelave poročila:';
  const rightLabelWidth = getTextWidth(rightLabel);
  const rightValue = data.reportDate || 'Ni podatka';
  const rightValueWidth = getTextWidth(' ' + rightValue);
  const rightStartX = pageWidth - margin - reviewBoxPadding - rightLabelWidth - rightValueWidth;
  addText(rightLabel, rightStartX, reviewContentY);
  doc.setTextColor(...darkGray);
  addText(' ' + rightValue, rightStartX + rightLabelWidth, reviewContentY);
  
  yPos += reviewBoxHeight + 10;
  
  // ===== ANALIZA SECTION =====
  const drawAnalizaSection = (startY: number): number => {
    const boxPadding = 8;
    const headerHeight = 10;
    const subTitleHeight = 7;
    const lineHeight = 5;
    
    // Build predlog content
    const combinedText = formatCombinedRecommendationText(
      data.recommendedLetters || [],
      data.motorikaFrequency,
      data.motorikaCustomCount,
      data.motorikaCustomUnit,
      data.recommendedVideoLetters || [],
    );
    const fullPredlog = [combinedText, data.predlogVaj.trim()].filter(Boolean).join('\n') || '(ni vnosa)';

    const sections = [
      { title: 'Anamneza', content: data.anamneza.trim() || '(ni vnosa)' },
      { title: 'Ugotovitve', content: data.ugotovitve.trim() || '(ni vnosa)' },
      { title: 'Predlog za igre in vaje', content: fullPredlog },
      { title: 'Opombe', content: data.opombe.trim() || '(ni vnosa)' }
    ];
    
    doc.setFontSize(10);
    let totalContentHeight = boxPadding;
    const sectionData: { title: string; lines: string[]; height: number }[] = [];
    
    sections.forEach((section, index) => {
      const lines = splitText(section.content, contentWidth - 2 * boxPadding);
      const sectionHeight = subTitleHeight + (lines.length * lineHeight) + (index < sections.length - 1 ? 8 : 0);
      sectionData.push({ title: section.title, lines, height: sectionHeight });
      totalContentHeight += sectionHeight;
    });
    totalContentHeight += boxPadding;
    
    let currentY = startY;
    
    doc.setFillColor(...whiteColor);
    doc.setDrawColor(...borderGray);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, currentY, contentWidth, headerHeight + totalContentHeight, 3, 3, 'FD');
    
    doc.setFillColor(...greenColor);
    doc.roundedRect(margin, currentY, contentWidth, headerHeight, 3, 3, 'F');
    doc.rect(margin, currentY + headerHeight - 3, contentWidth, 3, 'F');
    
    doc.setFontSize(10);
    setFont('normal');
    doc.setTextColor(255, 255, 255);
    addText('ANALIZA', margin + boxPadding, currentY + 7);
    
    currentY += headerHeight + boxPadding;
    
    sectionData.forEach((section, index) => {
      if (currentY > pageHeight - 50) { doc.addPage(); currentY = 25; }
      
      doc.setFontSize(10);
      setFont('bold');
      doc.setTextColor(...blackColor);
      addText(section.title, margin + boxPadding, currentY);
      currentY += subTitleHeight;
      
      setFont('normal');
      doc.setFontSize(10);
      doc.setTextColor(...darkGray);
      
      section.lines.forEach((line: string) => {
        if (currentY > pageHeight - 40) { doc.addPage(); currentY = 25; }
        doc.text(line, margin + boxPadding, currentY);
        currentY += lineHeight;
      });
      
      if (index < sectionData.length - 1) currentY += 6;
    });
    
    return currentY + boxPadding;
  };
  
  yPos = drawAnalizaSection(yPos);
  
  // ===== FOOTER =====
  const footerY = Math.max(yPos + 15, pageHeight - 35);
  if (footerY > pageHeight - 20) doc.addPage();
  const actualFooterY = footerY > pageHeight - 20 ? pageHeight - 35 : footerY;
  
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.5);
  doc.line(margin, actualFooterY, pageWidth - margin, actualFooterY);
  
  const footerTextY = actualFooterY + 10;
  setFont('normal');
  doc.setFontSize(9);
  doc.setTextColor(...mediumGray);
  addText(`Datum: ${data.reportDate}`, margin, footerTextY);
  addText(`Poročilo izdelal/a: ${data.logopedistName || 'Ni podatka'}`, pageWidth - margin, footerTextY, { align: 'right' });
  
  const disclaimerY = footerTextY + 10;
  doc.setFontSize(8);
  doc.setTextColor(...mediumGray);
  addText('To poročilo je informativne narave in ne nadomešča strokovnega logopedskega pregleda.', pageWidth / 2, disclaimerY, { align: 'center' });
  
  return doc.output('blob');
}
