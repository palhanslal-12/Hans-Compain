import { jsPDF } from 'jspdf';

/**
 * Utility to generate and download a clean, professionally formatted PDF
 * for any study notes, AI solutions, syllabus or chat responses.
 */
export function generateStudyNotesPdf(options: {
  title?: string;
  topic?: string;
  content: string;
  author?: string;
  language?: string;
}) {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const maxLineWidth = pageWidth - margin * 2;
    let y = 18;

    // Header Branding Bar
    doc.setFillColor(15, 23, 42); // Dark slate (#0F172A)
    doc.rect(0, 0, pageWidth, 24, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('HansAI • Student Academic & Exam Prep Studio', margin, 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text(`Created by Hanslal Pal • Generated on ${new Date().toLocaleString('en-IN')}`, margin, 18);

    y = 32;

    // Document Title
    const docTitle = options.title || options.topic || 'HansAI Academic Study Notes';
    doc.setTextColor(30, 41, 59); // Slate 800
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    
    const titleLines = doc.splitTextToSize(docTitle, maxLineWidth);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 7 + 2;

    // Separator line
    doc.setDrawColor(99, 102, 241); // Indigo 500
    doc.setLineWidth(0.8);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    // Clean markdown symbols for crisp PDF rendering
    const cleanContent = options.content
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/###\s+/g, '\n📌 ')
      .replace(/##\s+/g, '\n🎯 ')
      .replace(/#\s+/g, '\n🏆 ')
      .replace(/`{3}[\w]*\n?/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(51, 65, 85); // Slate 700

    const paragraphs = cleanContent.split('\n');

    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (!trimmed) {
        y += 4;
        continue;
      }

      // Check if heading or bullet
      const isHeading = trimmed.startsWith('📌') || trimmed.startsWith('🎯') || trimmed.startsWith('🏆') || trimmed.startsWith('✨') || trimmed.startsWith('💡');
      
      if (isHeading) {
        y += 3;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(11.5);
      } else if (trimmed.match(/^(\d+\.|•|-)\s+/)) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(10.5);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        doc.setFontSize(10);
      }

      const lines = doc.splitTextToSize(trimmed, maxLineWidth);

      // Check page overflow
      if (y + lines.length * 5.5 > pageHeight - 18) {
        // Footer on previous page
        drawPageFooter(doc, pageWidth, pageHeight);
        doc.addPage();
        y = 18;
      }

      doc.text(lines, margin, y);
      y += lines.length * 5.5 + (isHeading ? 2 : 1.5);
    }

    // Add footer to final page
    drawPageFooter(doc, pageWidth, pageHeight);

    // Save PDF
    const filename = `${docTitle.slice(0, 30).replace(/[^a-zA-Z0-9_-]/g, '_')}_HansAI_Notes.pdf`;
    doc.save(filename);
    return true;
  } catch (err) {
    console.error('Failed to generate PDF:', err);
    return false;
  }
}

function drawPageFooter(doc: jsPDF, pageWidth: number, pageHeight: number) {
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.setLineWidth(0.4);
  doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text('HansAI • Student Academic & Exam Prep Studio (www.hansai.edu)', 14, pageHeight - 7);
  doc.text('100% Student Verified Notes', pageWidth - 55, pageHeight - 7);
}
