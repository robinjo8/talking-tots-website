import jsPDF from 'jspdf';
import { ReportData } from '@/components/admin/ReportTemplateEditor';

export async function generateReportPdf(data: ReportData): Promise<Blob> {
  const doc = new jsPDF();
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = 20;
  
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
  
  // Header - TomiTalk branding
  doc.setFontSize(24);
  doc.setTextColor(76, 175, 80); // dragon-green
  doc.text('Tomi', margin, yPos);
  doc.setTextColor(255, 152, 0); // app-orange
  doc.text('Talk', margin + 25, yPos);
  
  yPos += 15;
  
  // Document title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('LOGOPEDSKO POROČILO', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  
  // Line separator
  doc.setDrawColor(76, 175, 80);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  yPos += 10;
  
  // Parent data section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(76, 175, 80);
  doc.text('PODATKI O STARŠU / SKRBNIKU', margin, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`Ime in priimek: ${data.parentName || 'Ni podatka'}`, margin, yPos);
  
  yPos += 6;
  doc.text(`E-poštni naslov: ${data.parentEmail || 'Ni podatka'}`, margin, yPos);
  
  yPos += 12;
  
  // Child data section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(76, 175, 80);
  doc.text('PODATKI O OTROKU', margin, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`Ime: ${data.childName || 'Ni podatka'}`, margin, yPos);
  
  yPos += 6;
  doc.text(`Starost: ${formatAge(data.childAge)}`, margin, yPos);
  
  yPos += 6;
  doc.text(`Spol: ${formatGender(data.childGender)}`, margin, yPos);
  
  yPos += 12;
  
  // Assessment data section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(76, 175, 80);
  doc.text('PODATKI O PREVERJANJU', margin, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`Datum preverjanja: ${data.testDate || 'Ni podatka'}`, margin, yPos);
  
  yPos += 12;
  
  // Helper to add wrapped text section
  const addTextSection = (title: string, content: string) => {
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(76, 175, 80);
    doc.text(title, margin, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    const textContent = content.trim() || '(ni vnosa)';
    const lines = doc.splitTextToSize(textContent, contentWidth);
    
    lines.forEach((line: string) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, margin, yPos);
      yPos += 5;
    });
    
    yPos += 7;
  };
  
  // Add report sections
  addTextSection('ANAMNEZA', data.anamneza);
  addTextSection('UGOTOVITVE', data.ugotovitve);
  addTextSection('PREDLOG ZA VAJE', data.predlogVaj);
  addTextSection('OPOMBE', data.opombe);
  
  // Footer - signature line
  yPos = Math.max(yPos + 10, 260);
  
  // Check if footer fits on current page
  if (yPos > 270) {
    doc.addPage();
    yPos = 260;
  }
  
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  yPos += 8;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Datum: ${data.reportDate}`, margin, yPos);
  doc.text(`Poročilo izdelal/a: ${data.logopedistName || 'Ni podatka'}`, pageWidth - margin, yPos, { align: 'right' });
  
  yPos += 8;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  const disclaimer = 'To poročilo je informativne narave in ne nadomešča strokovnega logopedskega pregleda.';
  doc.text(disclaimer, pageWidth / 2, yPos, { align: 'center' });
  
  return doc.output('blob');
}
