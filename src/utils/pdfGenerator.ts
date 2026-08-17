import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Utility to generate and download a clean, professionally formatted PDF
 * with 100% full Unicode Hindi & English support without font corruption.
 */
export async function generateStudyNotesPdf(options: {
  title?: string;
  topic?: string;
  content: string;
  author?: string;
  language?: string;
}): Promise<boolean> {
  const docTitle = options.title || options.topic || 'HansAI Academic Study Notes';
  const authorName = options.author || 'Hanslal Pal (Founder Owner)';
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Clean and parse markdown to structured HTML
  const formattedHtml = parseMarkdownToHtml(options.content);

  // Create temporary container for high-res PDF rendering
  const container = document.createElement('div');
  container.id = 'pdf-render-temp-container';
  container.style.position = 'fixed';
  container.style.top = '-99999px';
  container.style.left = '-99999px';
  container.style.width = '794px'; // Standard A4 width at 96 DPI
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#1e293b';
  container.style.fontFamily = "'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  container.style.padding = '0';
  container.style.margin = '0';
  container.style.boxSizing = 'border-box';

  container.innerHTML = `
    <div style="width: 100%; min-height: 1123px; background: #ffffff; padding: 32px 36px; box-sizing: border-box; font-family: 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      
      <!-- Top Branding Header -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); border-radius: 12px; padding: 18px 24px; margin-bottom: 24px; color: #ffffff; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 16px; font-weight: 800; letter-spacing: 0.5px; color: #ffffff;">
            HansAI • Student Academic & Exam Prep Studio
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">
            Created by ${authorName} • Generated on ${dateStr}
          </div>
        </div>
        <div style="background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.4); padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 700; color: #a5b4fc;">
          100% Student Verified Notes
        </div>
      </div>

      <!-- Document Title -->
      <div style="border-bottom: 2px solid #6366f1; padding-bottom: 12px; margin-bottom: 20px;">
        <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0; line-height: 1.3;">
          ${escapeHtml(docTitle)}
        </h1>
        <div style="font-size: 11px; font-weight: 600; color: #6366f1; text-transform: uppercase; letter-spacing: 0.5px;">
          High-Yield Academic Summary & Comprehensive Reference
        </div>
      </div>

      <!-- Body Content -->
      <div style="font-size: 13px; line-height: 1.7; color: #334155;">
        ${formattedHtml}
      </div>

      <!-- Footer Bar -->
      <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 12px; display: flex; justify-content: space-between; font-size: 10px; color: #64748b;">
        <span>HansAI • Student Academic & Exam Prep Studio (www.hansai.edu)</span>
        <span>Secure Academic Record • Powered by HansAI Engine</span>
      </div>

    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2, // 2x high resolution rendering for razor-sharp text
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;
    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Additional pages if content spans across multiple A4 pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    const filename = `${docTitle.slice(0, 35).replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '_')}_HansAI_Notes.pdf`;
    pdf.save(filename);

    return true;
  } catch (err) {
    console.error('Failed to generate canvas-based PDF, falling back to direct download:', err);
    // Fallback: save clean text file or open print window
    const blob = new Blob([options.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docTitle.slice(0, 30).replace(/\s+/g, '_')}_Notes.txt`;
    a.click();
    URL.revokeObjectURL(url);
    return false;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function parseMarkdownToHtml(markdown: string): string {
  const lines = markdown.split('\n');
  let html = '';
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += '<div style="height: 10px;"></div>';
      continue;
    }

    // Headers
    if (line.startsWith('### ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 16px 0 8px 0; padding-bottom: 4px; border-bottom: 1px dashed #cbd5e1;">${formatInline(line.slice(4))}</h3>`;
      continue;
    }
    if (line.startsWith('## ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h2 style="font-size: 17px; font-weight: 800; color: #1e1b4b; margin: 18px 0 10px 0; padding-bottom: 6px; border-bottom: 1px solid #cbd5e1;">${formatInline(line.slice(3))}</h2>`;
      continue;
    }
    if (line.startsWith('# ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h1 style="font-size: 19px; font-weight: 800; color: #0f172a; margin: 20px 0 12px 0;">${formatInline(line.slice(2))}</h1>`;
      continue;
    }

    // List items
    if (line.match(/^(\d+\.|•|-)\s+/)) {
      if (!inList) {
        html += '<ul style="margin: 6px 0; padding-left: 20px; list-style-type: disc;">';
        inList = true;
      }
      const itemText = line.replace(/^(\d+\.|•|-)\s+/, '');
      html += `<li style="margin-bottom: 6px; color: #1e293b;">${formatInline(itemText)}</li>`;
      continue;
    }

    // Regular paragraph
    if (inList) {
      html += '</ul>';
      inList = false;
    }

    html += `<p style="margin: 6px 0; color: #334155;">${formatInline(line)}</p>`;
  }

  if (inList) {
    html += '</ul>';
  }

  return html;
}

function formatInline(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #0f172a; font-weight: 700;">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background: #f1f5f9; padding: 2px 5px; border-radius: 4px; font-family: monospace; font-size: 12px; color: #6366f1;">$1</code>');
}
