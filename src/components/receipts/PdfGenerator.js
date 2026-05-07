import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const pageSizes = {
  a4: { format: 'a4', orientation: 'portrait' },
  half: { format: [148, 210], orientation: 'portrait' },
  ticket: { format: [80, 210], orientation: 'portrait' },
};

export async function createReceiptPdf(element, fileName = 'recibo.pdf', printSettings = {}) {
  if (!element) {
    throw new Error('No hay preview disponible para generar el PDF.');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
  });

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

  return {
    pdf,
    save: () => pdf.save(fileName),
    print: () => {
      pdf.autoPrint();
      window.open(pdf.output('bloburl'), '_blank');
    },
  };
}
