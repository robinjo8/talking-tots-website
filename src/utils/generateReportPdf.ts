import jsPDF from 'jspdf';
import { ReportData } from '@/components/admin/ReportTemplateEditor';

// Font loading with retry logic
const loadFontWithRetry = async (url: string, retries = 3): Promise<string | null> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const arrayBuffer = await response.arrayBuffer();
      return btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
    } catch (error) {
      console.warn(`Font load attempt ${i + 1} failed:`, error);
      if (i === retries - 1) return null;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  return null;
};

export async function generateReportPdf(data: ReportData): Promise<Blob> {
  const doc = new jsPDF();
  
  let useCustomFont = false;
  
  // Load custom fonts
  try {
    const [robotoBase64, robotoBoldBase64] = await Promise.all([
      loadFontWithRetry('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf'),
      loadFontWithRetry('https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4.ttf')
    ]);
    
    if (robotoBase64 && robotoBoldBase64) {
      doc.addFileToVFS('Roboto-Regular.ttf', robotoBase64);
      doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
      doc.addFileToVFS('Roboto-Bold.ttf', robotoBoldBase64);
      doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
      doc.setFont('Roboto');
      useCustomFont = true;
    } else {
      doc.setFont('helvetica');
    }
  } catch (error) {
    console.warn('Failed to load fonts:', error);
    doc.setFont('helvetica');
  }
  
  const setFont = (style: 'normal' | 'bold') => {
    if (useCustomFont) {
      doc.setFont('Roboto', style);
    } else {
      doc.setFont('helvetica', style);
    }
  };
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = 20;
  
  // Colors (matching Tailwind CSS)
  const greenColor: [number, number, number] = [76, 175, 80]; // dragon-green
  const orangeColor: [number, number, number] = [255, 152, 0]; // app-orange
  const darkGray: [number, number, number] = [60, 60, 60];
  const mediumGray: [number, number, number] = [107, 114, 128]; // muted-foreground
  const lightGray: [number, number, number] = [229, 231, 235]; // border
  const blackColor: [number, number, number] = [0, 0, 0];
  
  // Helper: Format gender
  const formatGenderShort = (gender: string | null) => {
    if (!gender) return 'Ni podatka';
    switch (gender.toLowerCase()) {
      case 'male': return 'M';
      case 'female': return 'Ž';
      default: return gender.charAt(0).toUpperCase();
    }
  };
  
  // Helper: Format age
  const formatAgeShort = (age: number | null) => {
    if (!age) return 'Ni podatka';
    return `${age} let`;
  };
  
  // ===== HEADER: TOMI TALK LOGO =====
  doc.setFontSize(24);
  setFont('bold');
  
  // "TOMI" in green
  doc.setTextColor(...greenColor);
  const tomiText = 'TOMI';
  doc.text(tomiText, margin, yPos);
  const tomiWidth = doc.getTextWidth(tomiText);
  
  // "TALK" in orange
  doc.setTextColor(...orangeColor);
  doc.text('TALK', margin + tomiWidth + 3, yPos);
  
  yPos += 5;
  
  // Gray separator line
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  yPos += 15;
  
  // ===== DOCUMENT TITLE =====
  doc.setFontSize(16);
  setFont('bold');
  doc.setTextColor(...darkGray);
  doc.text('LOGOPEDSKO POROČILO – TomiTalk', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  
  // ===== SECTION: PODATKI O STARŠU / SKRBNIKU =====
  doc.setFontSize(10);
  setFont('bold');
  doc.setTextColor(...mediumGray);
  doc.text('PODATKI O STARŠU / SKRBNIKU', margin, yPos);
  
  yPos += 2;
  doc.setDrawColor(...lightGray);
  doc.line(margin, yPos, margin + 80, yPos);
  
  yPos += 8;
  
  // Ime in priimek
  doc.setFontSize(10);
  setFont('normal');
  doc.setTextColor(...mediumGray);
  doc.text('Ime in priimek:', margin, yPos);
  doc.setTextColor(...darkGray);
  doc.text(data.parentName || 'Ni podatka', margin + 35, yPos);
  
  yPos += 6;
  
  // E-poštni naslov
  doc.setTextColor(...mediumGray);
  doc.text('E-poštni naslov:', margin, yPos);
  doc.setTextColor(...darkGray);
  doc.text(data.parentEmail || 'Ni podatka', margin + 35, yPos);
  
  yPos += 15;
  
  // ===== SECTION: PODATKI O OTROKU =====
  doc.setFontSize(10);
  setFont('bold');
  doc.setTextColor(...mediumGray);
  doc.text('PODATKI O OTROKU', margin, yPos);
  
  yPos += 2;
  doc.setDrawColor(...lightGray);
  doc.line(margin, yPos, margin + 55, yPos);
  
  yPos += 8;
  
  // Ime, starost, spol
  doc.setFontSize(10);
  setFont('normal');
  doc.setTextColor(...mediumGray);
  doc.text('Ime in priimek / Starost / Spol:', margin, yPos);
  doc.setTextColor(...darkGray);
  const childInfo = `${data.childName || 'Ni podatka'} / ${formatAgeShort(data.childAge)} / ${formatGenderShort(data.childGender)}`;
  doc.text(childInfo, margin + 60, yPos);
  
  yPos += 15;
  
  // ===== SECTION: PODATKI O PREVERJANJU =====
  doc.setFontSize(10);
  setFont('bold');
  doc.setTextColor(...mediumGray);
  doc.text('PODATKI O PREVERJANJU', margin, yPos);
  
  yPos += 2;
  doc.setDrawColor(...lightGray);
  doc.line(margin, yPos, margin + 60, yPos);
  
  yPos += 8;
  
  // Datum preverjanja izgovorjave
  doc.setFontSize(10);
  setFont('normal');
  doc.setTextColor(...mediumGray);
  doc.text('Datum preverjanja izgovorjave:', margin, yPos);
  doc.setTextColor(...darkGray);
  doc.text(data.testDate || 'Ni podatka', margin + 60, yPos);
  
  yPos += 6;
  
  // Datum izdelave poročila
  doc.setTextColor(...mediumGray);
  doc.text('Datum izdelave poročila:', margin, yPos);
  doc.setTextColor(...darkGray);
  doc.text(data.reportDate || 'Ni podatka', margin + 60, yPos);
  
  yPos += 15;
  
  // ===== HELPER: Draw content section with border (textarea style) =====
  const drawContentSection = (
    title: string,
    content: string,
    startY: number
  ): number => {
    const boxPadding = 8;
    const lineHeight = 5;
    
    // Check page break before section
    if (startY > pageHeight - 60) {
      doc.addPage();
      startY = 25;
    }
    
    // Section title
    doc.setFontSize(10);
    setFont('bold');
    doc.setTextColor(...darkGray);
    doc.text(`${title}:`, margin, startY);
    
    startY += 6;
    
    // Content text
    const displayContent = content.trim() || '(ni vnosa)';
    doc.setFontSize(10);
    setFont('normal');
    const lines = doc.splitTextToSize(displayContent, contentWidth - 2 * boxPadding);
    
    // Calculate box height
    const textHeight = lines.length * lineHeight;
    const boxHeight = Math.max(textHeight + 2 * boxPadding, 30);
    
    // Check if box fits on current page
    if (startY + boxHeight > pageHeight - 40) {
      doc.addPage();
      startY = 25;
      
      // Redraw title on new page
      doc.setFontSize(10);
      setFont('bold');
      doc.setTextColor(...darkGray);
      doc.text(`${title}:`, margin, startY);
      startY += 6;
    }
    
    // Draw bordered box
    doc.setDrawColor(...lightGray);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, startY, contentWidth, boxHeight, 2, 2, 'S');
    
    // Draw content
    doc.setTextColor(...darkGray);
    setFont('normal');
    let textY = startY + boxPadding + 3;
    
    lines.forEach((line: string) => {
      if (textY > pageHeight - 30) {
        doc.addPage();
        textY = 25;
      }
      doc.text(line, margin + boxPadding, textY);
      textY += lineHeight;
    });
    
    return startY + boxHeight + 10;
  };
  
  // ===== CONTENT SECTIONS =====
  yPos = drawContentSection('ANAMNEZA', data.anamneza, yPos);
  yPos = drawContentSection('UGOTOVITVE', data.ugotovitve, yPos);
  yPos = drawContentSection('PREDLOG ZA VAJE', data.predlogVaj, yPos);
  yPos = drawContentSection('OPOMBE', data.opombe, yPos);
  
  // ===== FOOTER =====
  // Ensure footer is at bottom
  const footerY = Math.max(yPos + 10, pageHeight - 40);
  
  if (footerY > pageHeight - 25) {
    doc.addPage();
  }
  
  const actualFooterY = footerY > pageHeight - 25 ? pageHeight - 40 : footerY;
  
  // Separator line
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.5);
  doc.line(margin, actualFooterY, pageWidth - margin, actualFooterY);
  
  // Footer text
  const footerTextY = actualFooterY + 8;
  doc.setFontSize(9);
  setFont('normal');
  doc.setTextColor(...mediumGray);
  doc.text(`Datum: ${data.reportDate}`, margin, footerTextY);
  doc.text(`Poročilo izdelal/a: ${data.logopedistName || 'Ni podatka'}`, pageWidth - margin, footerTextY, { align: 'right' });
  
  // ===== DISCLAIMER (orange italic) =====
  const disclaimerY = footerTextY + 12;
  doc.setFontSize(8);
  doc.setTextColor(...orangeColor);
  setFont('normal');
  const disclaimer = 'To poročilo je informativne narave in ne predstavlja zdravniškega izvida ali uradne medicinske diagnoze. Namenjeno je podpori govorno-jezikovnega razvoja otroka v okviru aplikacije TomiTalk.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth);
  disclaimerLines.forEach((line: string, index: number) => {
    doc.text(line, pageWidth / 2, disclaimerY + (index * 4), { align: 'center' });
  });
  
  return doc.output('blob');
}
