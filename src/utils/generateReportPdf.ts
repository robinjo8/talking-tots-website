import jsPDF from 'jspdf';
import { ReportData } from '@/components/admin/ReportTemplateEditor';

// Roboto Regular font with full UTF-8 support (Latin Extended for šumniki)
// This is a subset of Roboto that includes č, š, ž and other Slovenian characters
const loadRobotoFont = async (): Promise<string> => {
  // Fetch the font from Google Fonts CDN and convert to base64
  const response = await fetch('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf');
  const arrayBuffer = await response.arrayBuffer();
  const base64 = btoa(
    new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
  return base64;
};

export async function generateReportPdf(data: ReportData): Promise<Blob> {
  const doc = new jsPDF();
  
  // Load and register custom font with UTF-8 support
  try {
    const robotoBase64 = await loadRobotoFont();
    doc.addFileToVFS('Roboto-Regular.ttf', robotoBase64);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
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
  const lightGray: [number, number, number] = [245, 245, 245];
  const borderGray: [number, number, number] = [200, 200, 200];
  
  // Helper function for gender formatting
  const formatGender = (gender: string | null) => {
    if (!gender) return 'Ni podatka';
    switch (gender.toLowerCase()) {
      case 'male': return 'Moški';
      case 'female': return 'Ženski';
      default: return gender;
    }
  };
  
  // Helper function for age formatting
  const formatAge = (age: number | null) => {
    if (!age) return 'Ni podatka';
    if (age === 1) return '1 leto';
    if (age === 2) return '2 leti';
    if (age >= 3 && age <= 4) return `${age} leta`;
    return `${age} let`;
  };
  
  // ===== HEADER - TomiTalk branding =====
  doc.setFontSize(28);
  doc.setTextColor(...greenColor);
  doc.text('Tomi', margin, yPos);
  const tomiWidth = doc.getTextWidth('Tomi');
  doc.setTextColor(...orangeColor);
  doc.text('Talk', margin + tomiWidth + 2, yPos);
  
  yPos += 12;
  
  // Decorative line under logo
  doc.setDrawColor(...greenColor);
  doc.setLineWidth(2);
  doc.line(margin, yPos, margin + 60, yPos);
  
  yPos += 15;
  
  // ===== DOCUMENT TITLE =====
  doc.setFontSize(18);
  doc.setTextColor(...darkGray);
  doc.text('LOGOPEDSKO POROČILO', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  
  // Title underline
  const titleWidth = doc.getTextWidth('LOGOPEDSKO POROČILO');
  doc.setDrawColor(...orangeColor);
  doc.setLineWidth(1);
  doc.line((pageWidth - titleWidth) / 2, yPos, (pageWidth + titleWidth) / 2, yPos);
  
  yPos += 15;
  
  // ===== HELPER: Draw info box with header =====
  const drawInfoBox = (title: string, items: { label: string; value: string }[], startY: number): number => {
    const boxPadding = 8;
    const lineHeight = 7;
    const headerHeight = 10;
    const boxHeight = headerHeight + boxPadding + (items.length * lineHeight) + boxPadding;
    
    // Box background
    doc.setFillColor(...lightGray);
    doc.setDrawColor(...borderGray);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, startY, contentWidth, boxHeight, 3, 3, 'FD');
    
    // Header background
    doc.setFillColor(...greenColor);
    doc.roundedRect(margin, startY, contentWidth, headerHeight, 3, 3, 'F');
    // Cover bottom corners of header
    doc.rect(margin, startY + headerHeight - 3, contentWidth, 3, 'F');
    
    // Header text
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(title, margin + boxPadding, startY + 7);
    
    // Content
    let contentY = startY + headerHeight + boxPadding + 2;
    doc.setFontSize(10);
    doc.setTextColor(...darkGray);
    
    items.forEach(item => {
      doc.setTextColor(...mediumGray);
      doc.text(`${item.label}:`, margin + boxPadding, contentY);
      doc.setTextColor(...darkGray);
      const labelWidth = doc.getTextWidth(`${item.label}: `);
      doc.text(item.value, margin + boxPadding + labelWidth, contentY);
      contentY += lineHeight;
    });
    
    return startY + boxHeight + 8;
  };
  
  // ===== PARENT DATA SECTION =====
  yPos = drawInfoBox('PODATKI O STARŠU / SKRBNIKU', [
    { label: 'Ime in priimek', value: data.parentName || 'Ni podatka' },
    { label: 'E-poštni naslov', value: data.parentEmail || 'Ni podatka' }
  ], yPos);
  
  // ===== CHILD DATA SECTION =====
  yPos = drawInfoBox('PODATKI O OTROKU', [
    { label: 'Ime', value: data.childName || 'Ni podatka' },
    { label: 'Starost', value: formatAge(data.childAge) },
    { label: 'Spol', value: formatGender(data.childGender) }
  ], yPos);
  
  // ===== ASSESSMENT DATA SECTION =====
  yPos = drawInfoBox('PODATKI O PREVERJANJU', [
    { label: 'Datum preverjanja', value: data.testDate || 'Ni podatka' }
  ], yPos);
  
  // ===== HELPER: Add text section with title =====
  const addTextSection = (title: string, content: string) => {
    // Check if we need a new page (leave space for footer)
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 25;
    }
    
    // Section title
    doc.setFontSize(11);
    doc.setTextColor(...greenColor);
    doc.text(title, margin, yPos);
    
    // Title underline
    const sectionTitleWidth = doc.getTextWidth(title);
    doc.setDrawColor(...greenColor);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos + 2, margin + sectionTitleWidth, yPos + 2);
    
    yPos += 10;
    
    // Content
    doc.setFontSize(10);
    doc.setTextColor(...darkGray);
    
    const textContent = content.trim() || '(ni vnosa)';
    const lines = doc.splitTextToSize(textContent, contentWidth);
    
    lines.forEach((line: string) => {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 25;
      }
      doc.text(line, margin, yPos);
      yPos += 6;
    });
    
    yPos += 8;
  };
  
  // ===== REPORT CONTENT SECTIONS =====
  addTextSection('ANAMNEZA', data.anamneza);
  addTextSection('UGOTOVITVE', data.ugotovitve);
  addTextSection('PREDLOG ZA VAJE', data.predlogVaj);
  addTextSection('OPOMBE', data.opombe);
  
  // ===== FOOTER =====
  // Ensure footer is at bottom of page
  const footerY = Math.max(yPos + 15, pageHeight - 35);
  
  // Check if footer fits on current page
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
