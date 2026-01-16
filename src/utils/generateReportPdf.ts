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

// Load logo from Supabase storage
const loadLogoImage = async (): Promise<string> => {
  const logoUrl = 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/TomiTalk_logo.png';
  const response = await fetch(logoUrl);
  const arrayBuffer = await response.arrayBuffer();
  const base64 = btoa(
    new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
  return 'data:image/png;base64,' + base64;
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
  const darkGray: [number, number, number] = [40, 40, 40];
  const mediumGray: [number, number, number] = [100, 100, 100];
  const lightGray: [number, number, number] = [150, 150, 150];
  
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
  try {
    const logoBase64 = await loadLogoImage();
    doc.addImage(logoBase64, 'PNG', margin, yPos, 35, 12);
    yPos += 18;
  } catch (error) {
    console.warn('Failed to load logo, using text fallback:', error);
    doc.setFontSize(20);
    doc.setTextColor(...darkGray);
    doc.text('TomiTalk', margin, yPos + 8);
    yPos += 15;
  }
  
  yPos += 5;
  
  // ===== DOCUMENT TITLE =====
  doc.setFontSize(16);
  doc.setTextColor(...darkGray);
  doc.text('LOGOPEDSKO POROČILO', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 12;
  
  // ===== HELPER: Add compact data section (black on white, no boxes) =====
  const addDataSection = (title: string, items: { label: string; value: string }[]) => {
    // Section title - bold style simulation with slightly larger font
    doc.setFontSize(10);
    doc.setTextColor(...darkGray);
    doc.text(title, margin, yPos);
    yPos += 5;
    
    // Data items on single lines, compact
    doc.setFontSize(9);
    items.forEach(item => {
      doc.setTextColor(...mediumGray);
      const labelText = `${item.label}: `;
      doc.text(labelText, margin + 2, yPos);
      doc.setTextColor(...darkGray);
      doc.text(item.value, margin + 2 + doc.getTextWidth(labelText), yPos);
      yPos += 4.5;
    });
    
    yPos += 3;
  };
  
  // ===== PARENT DATA SECTION =====
  addDataSection('PODATKI O STARŠU / SKRBNIKU', [
    { label: 'Ime in priimek', value: data.parentName || 'Ni podatka' },
    { label: 'E-poštni naslov', value: data.parentEmail || 'Ni podatka' }
  ]);
  
  // ===== CHILD DATA SECTION =====
  addDataSection('PODATKI O OTROKU', [
    { label: 'Ime', value: data.childName || 'Ni podatka' },
    { label: 'Starost', value: formatAge(data.childAge) },
    { label: 'Spol', value: formatGender(data.childGender) }
  ]);
  
  // ===== ASSESSMENT DATA SECTION =====
  addDataSection('PODATKI O PREVERJANJU', [
    { label: 'Datum preverjanja', value: data.testDate || 'Ni podatka' }
  ]);
  
  yPos += 5;
  
  // ===== HELPER: Add text section with flowing layout =====
  const addTextSection = (title: string, content: string) => {
    const textContent = content.trim();
    if (!textContent) return; // Skip empty sections entirely
    
    // Check if we need a new page
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = 25;
    }
    
    // Section title in dark gray (not green)
    doc.setFontSize(10);
    doc.setTextColor(...darkGray);
    doc.text(title, margin, yPos);
    
    yPos += 5;
    
    // Content
    doc.setFontSize(9);
    doc.setTextColor(...mediumGray);
    
    const lines = doc.splitTextToSize(textContent, contentWidth);
    
    lines.forEach((line: string) => {
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = 25;
      }
      doc.text(line, margin, yPos);
      yPos += 4.5;
    });
    
    yPos += 4; // Minimal spacing before next section
  };
  
  // ===== REPORT CONTENT SECTIONS (flowing layout) =====
  addTextSection('ANAMNEZA', data.anamneza);
  addTextSection('UGOTOVITVE', data.ugotovitve);
  addTextSection('PREDLOG ZA VAJE', data.predlogVaj);
  addTextSection('OPOMBE', data.opombe);
  
  // ===== FOOTER =====
  const footerY = Math.max(yPos + 15, pageHeight - 30);
  
  if (footerY > pageHeight - 15) {
    doc.addPage();
  }
  
  const actualFooterY = footerY > pageHeight - 15 ? pageHeight - 30 : footerY;
  
  // Footer separator line
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.3);
  doc.line(margin, actualFooterY, pageWidth - margin, actualFooterY);
  
  // Footer content
  const footerTextY = actualFooterY + 8;
  doc.setFontSize(8);
  doc.setTextColor(...mediumGray);
  doc.text(`Datum: ${data.reportDate}`, margin, footerTextY);
  doc.text(`Poročilo izdelal/a: ${data.logopedistName || 'Ni podatka'}`, pageWidth - margin, footerTextY, { align: 'right' });
  
  // Disclaimer
  const disclaimerY = footerTextY + 8;
  doc.setFontSize(7);
  doc.setTextColor(...lightGray);
  const disclaimer = 'To poročilo je informativne narave in ne nadomešča strokovnega logopedskega pregleda.';
  doc.text(disclaimer, pageWidth / 2, disclaimerY, { align: 'center' });
  
  return doc.output('blob');
}
