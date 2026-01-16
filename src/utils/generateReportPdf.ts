import jsPDF from 'jspdf';
import { ReportData } from '@/components/admin/ReportTemplateEditor';
import { supabase } from '@/integrations/supabase/client';

// Roboto Regular font with full UTF-8 support (Latin Extended for šumniki)
const loadRobotoFont = async (): Promise<string> => {
  const response = await fetch('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf');
  const arrayBuffer = await response.arrayBuffer();
  const base64 = btoa(
    new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
  return base64;
};

// Load logo from Supabase storage
const loadLogo = async (): Promise<string | null> => {
  try {
    const { data } = supabase.storage
      .from('slike-ostalo')
      .getPublicUrl('TomiTalk_logo.png');
    
    const response = await fetch(data.publicUrl);
    const blob = await response.blob();
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn('Failed to load logo:', error);
    return null;
  }
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
  let yPos = 15;
  
  // Colors
  const greenColor: [number, number, number] = [76, 175, 80];
  const orangeColor: [number, number, number] = [255, 152, 0];
  const darkGray: [number, number, number] = [60, 60, 60];
  const mediumGray: [number, number, number] = [120, 120, 120];
  const whiteColor: [number, number, number] = [255, 255, 255];
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
  
  // ===== HEADER - TomiTalk logo from Supabase =====
  const logoBase64 = await loadLogo();
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', margin, yPos, 45, 15);
    yPos += 20;
  } else {
    // Fallback to text if logo fails to load
    doc.setFontSize(28);
    doc.setTextColor(...greenColor);
    doc.text('Tomi', margin, yPos + 10);
    const tomiWidth = doc.getTextWidth('Tomi');
    doc.setTextColor(...orangeColor);
    doc.text('Talk', margin + tomiWidth + 2, yPos + 10);
    yPos += 18;
  }
  
  // Decorative line under logo
  doc.setDrawColor(...greenColor);
  doc.setLineWidth(2);
  doc.line(margin, yPos, margin + 60, yPos);
  
  yPos += 12;
  
  // ===== DOCUMENT TITLE =====
  doc.setFontSize(18);
  doc.setTextColor(...darkGray);
  doc.text('LOGOPEDSKO POROČILO', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  
  // Title underline (orange)
  const titleWidth = doc.getTextWidth('LOGOPEDSKO POROČILO');
  doc.setDrawColor(...orangeColor);
  doc.setLineWidth(1);
  doc.line((pageWidth - titleWidth) / 2, yPos, (pageWidth + titleWidth) / 2, yPos);
  
  yPos += 12;
  
  // ===== HELPER: Draw info box with header (single column) =====
  const drawInfoBoxColumn = (
    title: string, 
    items: { label: string; value: string }[], 
    xPos: number,
    startY: number, 
    boxWidth: number,
    minHeight?: number
  ): number => {
    const boxPadding = 6;
    const lineHeight = 6;
    const headerHeight = 9;
    const calculatedHeight = headerHeight + boxPadding + (items.length * lineHeight) + boxPadding;
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
    doc.setTextColor(255, 255, 255);
    doc.text(title, xPos + boxPadding, startY + 6);
    
    // Content
    let contentY = startY + headerHeight + boxPadding + 2;
    doc.setFontSize(9);
    doc.setTextColor(...darkGray);
    
    items.forEach(item => {
      doc.setTextColor(...mediumGray);
      doc.text(`${item.label}:`, xPos + boxPadding, contentY);
      doc.setTextColor(...darkGray);
      const labelWidth = doc.getTextWidth(`${item.label}: `);
      doc.text(item.value, xPos + boxPadding + labelWidth, contentY);
      contentY += lineHeight;
    });
    
    return boxHeight;
  };
  
  // ===== TWO COLUMN LAYOUT: Parent + Child =====
  const columnGap = 8;
  const columnWidth = (contentWidth - columnGap) / 2;
  
  const parentItems = [
    { label: 'Ime in priimek', value: data.parentName || 'Ni podatka' },
    { label: 'E-poštni naslov', value: data.parentEmail || 'Ni podatka' }
  ];
  
  const childItems = [
    { label: 'Ime', value: data.childName || 'Ni podatka' },
    { label: 'Starost', value: formatAge(data.childAge) },
    { label: 'Spol', value: formatGender(data.childGender) }
  ];
  
  // Calculate heights to make them equal
  const parentHeight = 9 + 6 + (parentItems.length * 6) + 6;
  const childHeight = 9 + 6 + (childItems.length * 6) + 6;
  const maxHeight = Math.max(parentHeight, childHeight);
  
  // Draw both boxes side by side
  drawInfoBoxColumn('PODATKI O STARŠU / SKRBNIKU', parentItems, margin, yPos, columnWidth, maxHeight);
  drawInfoBoxColumn('PODATKI O OTROKU', childItems, margin + columnWidth + columnGap, yPos, columnWidth, maxHeight);
  
  yPos += maxHeight + 8;
  
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
    
    yPos += 6;
  };
  
  // ===== REPORT CONTENT SECTIONS =====
  addTextSection('ANAMNEZA', data.anamneza);
  addTextSection('UGOTOVITVE', data.ugotovitve);
  addTextSection('PREDLOG ZA VAJE', data.predlogVaj);
  addTextSection('OPOMBE', data.opombe);
  
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
