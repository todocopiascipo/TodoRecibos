import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const pageSizes = {
  a4: { format: 'a4', orientation: 'portrait' },
  half: { format: [148, 210], orientation: 'portrait' },
  ticket: { format: [80, 210], orientation: 'portrait' },
};

function buildPdfFromCanvas(canvas, printSettings = {}) {
  const config = pageSizes[printSettings.size] || pageSizes.a4;
  const pdf = new jsPDF({
    unit: 'mm',
    format: config.format,
    orientation: config.orientation,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const image = canvas.toDataURL('image/png');

  let remainingHeight = imgHeight;
  let position = 0;

  pdf.addImage(image, 'PNG', 0, position, imgWidth, imgHeight);
  remainingHeight -= pageHeight;

  while (remainingHeight > 0) {
    position -= pageHeight;
    pdf.addPage();
    pdf.addImage(image, 'PNG', 0, position, imgWidth, imgHeight);
    remainingHeight -= pageHeight;
  }

  return pdf;
}

async function createPdf(element, printSettings = {}) {
  if (!element) {
    throw new Error('No hay preview disponible para generar el PDF.');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
  });

  return buildPdfFromCanvas(canvas, printSettings);
}

export async function generateReceiptPdfBlob(element, printSettings = {}) {
  const pdf = await createPdf(element, printSettings);
  return pdf.output('blob');
}

export function createReceiptPdfFile(pdfBlob, fileName = 'recibo.pdf') {
  return new File([pdfBlob], fileName, { type: 'application/pdf' });
}

export function downloadReceiptPdf(pdfBlob, fileName = 'recibo.pdf') {
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function shareReceiptPdf(pdfFile, receipt) {
  const shareData = {
    title: `Recibo ${receipt.number || receipt.receiptNumber || ''}`.trim(),
    text: 'Te envio el comprobante de pago.',
    files: [pdfFile],
  };

  if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
    await navigator.share(shareData);
    return true;
  }

  return false;
}

export function openWhatsAppFallback(receipt) {
  const receiptNumber = receipt.number || receipt.receiptNumber || '';
  const text = encodeURIComponent(`Te envio el comprobante de pago ${receiptNumber}.`);
  window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
}

export async function createReceiptPdf(element, fileName = 'recibo.pdf', printSettings = {}) {
  const pdf = await createPdf(element, printSettings);

  return {
    pdf,
    save: () => pdf.save(fileName),
    blob: () => pdf.output('blob'),
    file: () => createReceiptPdfFile(pdf.output('blob'), fileName),
    print: () => {
      pdf.autoPrint();
      window.open(pdf.output('bloburl'), '_blank');
    },
  };
}
