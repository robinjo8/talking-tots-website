import jsPDF from 'jspdf';
import { ReportData } from '@/components/admin/ReportTemplateEditor';

// Roboto Regular font with full UTF-8 support (Latin Extended for šumniki)
const loadRobotoFont = async (): Promise<string> => {
  const response = await fetch('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf');
  const arrayBuffer = await response.arrayBuffer();
  const base64 = btoa(
    new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
  return base64;
};

// Roboto Bold font for section titles
const loadRobotoBoldFont = async (): Promise<string> => {
  const response = await fetch('https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4.ttf');
  const arrayBuffer = await response.arrayBuffer();
  const base64 = btoa(
    new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
  return base64;
};

export async function generateReportPdf(data: ReportData): Promise<Blob> {
  const doc = new jsPDF();
  
  // Load and register custom fonts with UTF-8 support
  try {
    const [robotoBase64, robotoBoldBase64] = await Promise.all([
      loadRobotoFont(),
      loadRobotoBoldFont()
    ]);
    
    doc.addFileToVFS('Roboto-Regular.ttf', robotoBase64);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    
    doc.addFileToVFS('Roboto-Bold.ttf', robotoBoldBase64);
    doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
    
    doc.setFont('Roboto');
  } catch (error) {
    console.warn('Failed to load custom font, falling back to default:', error);
  }
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = 20;
  
  // Colors
  const greenColor: [number, number, number] = [76, 175, 80];
  const orangeColor: [number, number, number] = [255, 152, 0];
  const darkGray: [number, number, number] = [60, 60, 60];
  const mediumGray: [number, number, number] = [120, 120, 120];
  const whiteColor: [number, number, number] = [255, 255, 255];
  const borderGray: [number, number, number] = [200, 200, 200];
  const blackColor: [number, number, number] = [0, 0, 0];
  
  // Helper function for gender formatting (short version)
  const formatGenderShort = (gender: string | null) => {
    if (!gender) return 'Ni podatka';
    switch (gender.toLowerCase()) {
      case 'male': return 'M';
      case 'female': return 'Ž';
      default: return gender.charAt(0).toUpperCase();
    }
  };
  
  // Helper function for age formatting (short version)
  const formatAgeShort = (age: number | null) => {
    if (!age) return 'Ni podatka';
    return `${age} let`;
  };
  
  // ===== DOCUMENT TITLE (no logo) =====
  doc.setFontSize(18);
  doc.setTextColor(...blackColor);
  doc.setFont('Roboto', 'bold');
  doc.text('LOGOPEDSKO POROČILO - TOMITALK', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  
  // Title underline (orange)
  const titleWidth = doc.getTextWidth('LOGOPEDSKO POROČILO - TOMITALK');
  doc.setDrawColor(...orangeColor);
  doc.setLineWidth(1);
  doc.line((pageWidth - titleWidth) / 2, yPos, (pageWidth + titleWidth) / 2, yPos);
  
  yPos += 12;
  
  // ===== HELPER: Draw info box with two-line content =====
  const drawTwoLineInfoBox = (
    title: string, 
    labelLine: string,
    valueLine: string,
    xPos: number,
    startY: number, 
    boxWidth: number,
    minHeight?: number
  ): number => {
    const boxPadding = 6;
    const lineHeight = 6;
    const headerHeight = 9;
    const calculatedHeight = headerHeight + boxPadding + (2 * lineHeight) + boxPadding + 2;
    const boxHeight = minHeight ? Math.max(calculatedHeight, minHeight) : calculatedHeight;
    
    // Box background - WHITE
    doc.setFillColor(...whiteColor);
    doc.setDrawColor(...borderGray);
    doc.setLineWidth(0.5);
    doc.roundedRect(xPos, startY, boxWidth, boxHeight, 3, 3, 'FD');
    
    // Header background (green)
    doc.setFillColor(...greenColor);
    doc.roundedRect(xPos, startY, boxWidth, headerHeight, 3, 3, 'F');
    // Cover bottom corners of header
    doc.rect(xPos, startY + headerHeight - 3, boxWidth, 3, 'F');
    
    // Header text
    doc.setFontSize(9);
    doc.setFont('Roboto', 'normal');
    doc.setTextColor(255, 255, 255);
    doc.text(title, xPos + boxPadding, startY + 6);
    
    // Content - label line
    let contentY = startY + headerHeight + boxPadding + 2;
    doc.setFontSize(9);
    doc.setTextColor(...mediumGray);
    doc.text(labelLine, xPos + boxPadding, contentY);
    
    // Content - value line
    contentY += lineHeight;
    doc.setTextColor(...darkGray);
    doc.text(valueLine, xPos + boxPadding, contentY);
    
    return boxHeight;
  };
  
  // ===== TWO COLUMN LAYOUT: Parent + Child =====
  const columnGap = 8;
  const columnWidth = (contentWidth - columnGap) / 2;
  
  // Calculate common height for both boxes
  const boxHeight = 9 + 6 + (2 * 6) + 6 + 2; // header + padding + 2 lines + padding + extra
  
  // Parent box
  drawTwoLineInfoBox(
    'PODATKI O STARŠU / SKRBNIKU',
    'Ime in priimek',
    data.parentName || 'Ni podatka',
    margin,
    yPos,
    columnWidth,
    boxHeight
  );
  
  // Child box
  const childValueLine = `${data.childName || 'Ni podatka'} / ${formatAgeShort(data.childAge)} / ${formatGenderShort(data.childGender)}`;
  drawTwoLineInfoBox(
    'PODATKI O OTROKU',
    'Ime, starost, spol:',
    childValueLine,
    margin + columnWidth + columnGap,
    yPos,
    columnWidth,
    boxHeight
  );
  
  yPos += boxHeight + 8;
  
  // ===== ASSESSMENT DATA SECTION (with two dates in one line) =====
  const reviewBoxPadding = 6;
  const reviewHeaderHeight = 9;
  const reviewContentHeight = 8;
  const reviewBoxHeight = reviewHeaderHeight + reviewBoxPadding + reviewContentHeight + reviewBoxPadding;
  
  // Box background - WHITE
  doc.setFillColor(...whiteColor);
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPos, contentWidth, reviewBoxHeight, 3, 3, 'FD');
  
  // Header background (green)
  doc.setFillColor(...greenColor);
  doc.roundedRect(margin, yPos, contentWidth, reviewHeaderHeight, 3, 3, 'F');
  doc.rect(margin, yPos + reviewHeaderHeight - 3, contentWidth, 3, 'F');
  
  // Header text
  doc.setFontSize(9);
  doc.setFont('Roboto', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text('PODATKI O PREVERJANJU', margin + reviewBoxPadding, yPos + 6);
  
  // Content - two dates in one line
  const reviewContentY = yPos + reviewHeaderHeight + reviewBoxPadding + 4;
  doc.setFontSize(9);
  
  // Left: Datum preverjanja izgovorjave
  doc.setTextColor(...mediumGray);
  doc.text('Datum preverjanja izgovorjave:', margin + reviewBoxPadding, reviewContentY);
  doc.setTextColor(...darkGray);
  const leftLabelWidth = doc.getTextWidth('Datum preverjanja izgovorjave: ');
  doc.text(data.testDate || 'Ni podatka', margin + reviewBoxPadding + leftLabelWidth, reviewContentY);
  
  // Right: Datum izdelave poročila
  doc.setTextColor(...mediumGray);
  const rightLabel = 'Datum izdelave poročila:';
  const rightLabelWidth = doc.getTextWidth(rightLabel);
  const rightValue = data.reportDate || 'Ni podatka';
  const rightValueWidth = doc.getTextWidth(' ' + rightValue);
  const rightStartX = pageWidth - margin - reviewBoxPadding - rightLabelWidth - rightValueWidth;
  
  doc.text(rightLabel, rightStartX, reviewContentY);
  doc.setTextColor(...darkGray);
  doc.text(' ' + rightValue, rightStartX + rightLabelWidth, reviewContentY);
  
  yPos += reviewBoxHeight + 10;
  
  // ===== ANALIZA SECTION - Combined box with all subsections =====
  const drawAnalizaSection = (
    anamneza: string,
    ugotovitve: string,
    predlogVaj: string,
    opombe: string,
    startY: number
  ): number => {
    const boxPadding = 8;
    const headerHeight = 10;
    const subTitleHeight = 7;
    const lineHeight = 5;
    
    // Calculate total height needed
    const sections = [
      { title: 'Anamneza', content: anamneza.trim() || '(ni vnosa)' },
      { title: 'Ugotovitve', content: ugotovitve.trim() || '(ni vnosa)' },
      { title: 'Predlog za vaje', content: predlogVaj.trim() || '(ni vnosa)' },
      { title: 'Opombe', content: opombe.trim() || '(ni vnosa)' }
    ];
    
    // Calculate text heights
    doc.setFontSize(10);
    let totalContentHeight = boxPadding;
    const sectionData: { title: string; lines: string[]; height: number }[] = [];
    
    sections.forEach((section, index) => {
      const lines = doc.splitTextToSize(section.content, contentWidth - 2 * boxPadding);
      const sectionHeight = subTitleHeight + (lines.length * lineHeight) + (index < sections.length - 1 ? 8 : 0);
      sectionData.push({ title: section.title, lines, height: sectionHeight });
      totalContentHeight += sectionHeight;
    });
    
    totalContentHeight += boxPadding;
    
    // Check if we need multiple pages
    const availableHeight = pageHeight - startY - 40; // Leave space for footer
    let currentY = startY;
    let boxStartY = startY;
    let isFirstPage = true;
    
    // Draw box background - WHITE
    const boxHeight = Math.min(totalContentHeight + headerHeight, availableHeight);
    doc.setFillColor(...whiteColor);
    doc.setDrawColor(...borderGray);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, currentY, contentWidth, headerHeight + totalContentHeight, 3, 3, 'FD');
    
    // Header background (green)
    doc.setFillColor(...greenColor);
    doc.roundedRect(margin, currentY, contentWidth, headerHeight, 3, 3, 'F');
    doc.rect(margin, currentY + headerHeight - 3, contentWidth, 3, 'F');
    
    // Header text
    doc.setFontSize(10);
    doc.setFont('Roboto', 'normal');
    doc.setTextColor(255, 255, 255);
    doc.text('ANALIZA', margin + boxPadding, currentY + 7);
    
    currentY += headerHeight + boxPadding;
    
    // Draw each subsection
    sectionData.forEach((section, index) => {
      // Check page break
      if (currentY > pageHeight - 50) {
        doc.addPage();
        currentY = 25;
      }
      
      // Subsection title (bold black)
      doc.setFontSize(10);
      doc.setFont('Roboto', 'bold');
      doc.setTextColor(...blackColor);
      doc.text(section.title, margin + boxPadding, currentY);
      currentY += subTitleHeight;
      
      // Subsection content
      doc.setFont('Roboto', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...darkGray);
      
      section.lines.forEach((line: string) => {
        if (currentY > pageHeight - 40) {
          doc.addPage();
          currentY = 25;
        }
        doc.text(line, margin + boxPadding, currentY);
        currentY += lineHeight;
      });
      
      // Add spacing between sections (except last)
      if (index < sectionData.length - 1) {
        currentY += 6;
      }
    });
    
    return currentY + boxPadding;
  };
  
  yPos = drawAnalizaSection(data.anamneza, data.ugotovitve, data.predlogVaj, data.opombe, yPos);
  
  // ===== FOOTER =====
  const footerY = Math.max(yPos + 15, pageHeight - 35);
  
  if (footerY > pageHeight - 20) {
    doc.addPage();
  }
  
  const actualFooterY = footerY > pageHeight - 20 ? pageHeight - 35 : footerY;
  
  // Footer separator line
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.5);
  doc.line(margin, actualFooterY, pageWidth - margin, actualFooterY);
  
  // Footer content - date and author on same line
  const footerTextY = actualFooterY + 10;
  doc.setFontSize(9);
  doc.setFont('Roboto', 'normal');
  doc.setTextColor(...mediumGray);
  doc.text(`Datum: ${data.reportDate}`, margin, footerTextY);
  doc.text(`Poročilo izdelal/a: ${data.logopedistName || 'Ni podatka'}`, pageWidth - margin, footerTextY, { align: 'right' });
  
  // Disclaimer
  const disclaimerY = footerTextY + 10;
  doc.setFontSize(8);
  doc.setTextColor(...borderGray);
  const disclaimer = 'To poročilo je informativne narave in ne nadomešča strokovnega logopedskega pregleda.';
  doc.text(disclaimer, pageWidth / 2, disclaimerY, { align: 'center' });
  
  return doc.output('blob');
}
