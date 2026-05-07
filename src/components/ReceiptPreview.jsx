import { forwardRef } from 'react';
import { getVisualTemplate } from './templates/templateRegistry';

const ReceiptPreview = forwardRef(function ReceiptPreview({ brand, receipt, selectedTemplate, printSettings, title = 'Recibo listo para imprimir', compact = false }, ref) {
  const Template = getVisualTemplate(selectedTemplate).Component;
  const copies = printSettings.mode === 'copy' ? ['Original', 'Copia'] : ['Original'];

  return (
    <section className="space-y-5">
      {!compact && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Preview</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">{title}</h2>
          </div>
          <span className="w-fit rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white">{copies.length === 2 ? 'Original + copia' : 'Solo original'}</span>
        </div>
      )}

      <div ref={ref} className={`preview-shell preview-${printSettings.size} margin-${printSettings.margins}`}>
        {copies.map((copyLabel) => (
          <div key={copyLabel} className="receipt-copy">
            <div className="copy-label">{copyLabel}</div>
            <Template brand={brand} receipt={receipt} />
          </div>
        ))}
      </div>
    </section>
  );
});

export default ReceiptPreview;
