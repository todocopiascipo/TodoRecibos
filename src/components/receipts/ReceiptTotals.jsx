import { calculateFinalTotal, calculateSubtotal, formatCurrency } from '../../utils/receiptCalculations';

const inputClass =
  'mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-100';

export default function ReceiptTotals({ receipt, onDiscountAmountChange, onDiscountPercentChange }) {
  const subtotal = calculateSubtotal(receipt.items);
  const discountAmount = Number(receipt.discountAmount) || 0;
  const total = calculateFinalTotal(subtotal, discountAmount);
  const hasDiscountWarning = discountAmount > subtotal;

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="text-sm font-semibold text-slate-700">Descuento %</span>
            <input className={inputClass} type="number" min="0" max="100" step="0.01" value={receipt.discountPercent} onChange={(event) => onDiscountPercentChange(event.target.value)} placeholder="0" />
          </label>
          <label>
            <span className="text-sm font-semibold text-slate-700">Descuento $</span>
            <input className={inputClass} type="number" min="0" step="0.01" value={receipt.discountAmount} onChange={(event) => onDiscountAmountChange(event.target.value)} placeholder="0" />
          </label>
        </div>
        {hasDiscountWarning && (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
            El descuento supera el subtotal. El total final se mantiene en $ 0.
          </p>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-white shadow-panel">
        <div className="flex justify-between py-2 text-slate-300">
          <span>Subtotal</span>
          <strong>{formatCurrency(subtotal)}</strong>
        </div>
        <div className="flex justify-between py-2 text-slate-300">
          <span>Descuento</span>
          <strong>{formatCurrency(Math.min(subtotal, discountAmount))}</strong>
        </div>
        <div className="mt-3 flex justify-between border-t border-white/20 pt-4 text-xl font-black">
          <span>Total</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
      </div>
    </div>
  );
}
