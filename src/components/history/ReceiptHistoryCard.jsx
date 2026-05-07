import { formatCurrency } from '../../utils/receiptCalculations';

export default function ReceiptHistoryCard({ receipt, templateName, onView, onDownload, onDuplicate, onDelete }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-950">{receipt.receiptNumber}</h3>
          <p className="mt-1 text-sm text-slate-500">{receipt.receivedFrom || 'Sin cliente'} · {receipt.date}</p>
        </div>
        <strong className="text-xl text-slate-950">{formatCurrency(receipt.total)}</strong>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
        <span>Pago: <strong className="text-slate-900">{receipt.paymentMethod}</strong></span>
        <span>Template: <strong className="text-slate-900">{templateName}</strong></span>
        <span>Items: <strong className="text-slate-900">{receipt.items?.length || 0}</strong></span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
        <button onClick={onView} className="touch-target rounded-lg bg-slate-950 px-3 py-2 text-sm font-bold text-white">Ver</button>
        <button onClick={onDownload} className="touch-target rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-bold text-teal-800">PDF</button>
        <button onClick={onDuplicate} className="touch-target rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700">Duplicar</button>
        <button onClick={onDelete} className="touch-target rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">Eliminar</button>
      </div>
    </article>
  );
}
