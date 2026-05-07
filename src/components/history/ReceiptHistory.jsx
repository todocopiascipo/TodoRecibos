import ReceiptHistoryCard from './ReceiptHistoryCard';

export default function ReceiptHistory({ receipts, templates, onView, onDownload, onDuplicate, onDelete }) {
  const templateName = (id) => templates.find((template) => template.id === id)?.name || 'Template eliminado';

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Historial</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">Recibos emitidos</h2>
      </div>

      {receipts.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-panel">
          <h3 className="text-lg font-black text-slate-950">Todavia no hay recibos emitidos</h3>
          <p className="mt-2 text-slate-500">Cuando emitas el primer recibo, va a aparecer aca con sus acciones.</p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {receipts.map((receipt) => (
            <ReceiptHistoryCard
              key={receipt.id}
              receipt={receipt}
              templateName={templateName(receipt.templateId)}
              onView={() => onView(receipt)}
              onDownload={() => onDownload(receipt)}
              onDuplicate={() => onDuplicate(receipt.id)}
              onDelete={() => onDelete(receipt.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
