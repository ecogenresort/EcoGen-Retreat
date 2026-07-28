import { img } from '../assets';

interface ItineraryDetails {
  documentTitle: string;
  guestName: string;
  phone: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: number | string;
  requirements?: string;
  footerNote: string;
  filenamePrefix: string;
}

async function loadImageAsDataUrl(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function downloadItineraryPdf(details: ItineraryDetails): Promise<void> {
  // Lazy-loaded: jsPDF's core (embedded default fonts) adds ~400KB, which
  // shouldn't cost every visitor upfront for a rarely-used download button.
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 20;
  let y = 20;

  try {
    const logoDataUrl = await loadImageAsDataUrl(img.logo);
    doc.addImage(logoDataUrl, 'JPEG', marginX, y, 30, 30);
  } catch {
    // Logo failed to load (offline, blocked, etc.) — don't fail the whole
    // download over a missing image.
  }

  y += 38;
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(47, 93, 80); // matches --color-forest
  doc.text('EcoGen Retreat', marginX, y);

  y += 8;
  doc.setFont('times', 'italic');
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text(details.documentTitle, marginX, y);

  y += 6;
  doc.setDrawColor(200, 178, 125); // matches --color-gold
  doc.line(marginX, y, pageWidth - marginX, y);

  y += 12;
  doc.setFontSize(11);

  const rows: [string, string][] = [
    ['Guest Name', details.guestName],
    ['Phone', details.phone],
    ['Email', details.email],
    ['Check-In', details.checkIn],
    ['Check-Out', details.checkOut],
    ['Guests', String(details.guests)],
    ['Requirements', details.requirements || 'None'],
  ];

  for (const [label, value] of rows) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 34, 34);
    doc.text(`${label}:`, marginX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, marginX + 45, y, { maxWidth: pageWidth - marginX - (marginX + 45) });
    y += 8;
  }

  y += 10;
  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(96, 122, 95); // matches --color-sage
  doc.text(details.footerNote, marginX, y, { maxWidth: pageWidth - marginX * 2 });

  doc.save(`${details.filenamePrefix}_${details.guestName.replace(/\s+/g, '_')}.pdf`);
}
