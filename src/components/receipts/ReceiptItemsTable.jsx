import { calculateLineTotal, formatCurrency } from '../../utils/receiptCalculations';
import { createReceiptItem } from '../../utils/sampleReceipt';

const inputClass =
  'mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-100';

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export default function ReceiptItemsTable({ items, onItemsChange, onPickProduct, onSaveItem }) {
  function updateItem(id, field, value) {
    onItemsChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  function addItem() {
    onItemsChange([...items, createReceiptItem()]);
  }

  function removeItem(id) {
    const nextItems = items.filter((item) => item.id !== id);
    onItemsChange(nextItems.length ? nextItems : [createReceiptItem()]);
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-black text-slate-950">Items del recibo</h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button onClick={addItem} className="touch-target rounded-lg bg-slate-950 px-5 py-3 text-base font-bold text-white shadow-sm transition hover:bg-slate-800">
            Agregar item
          </button>
          <button onClick={onPickProduct} className="touch-target rounded-lg border border-teal-200 bg-teal-50 px-5 py-3 text-base font-bold text-teal-800 transition hover:bg-teal-100">
            Añadir item existente
          </button>
        </div>
      </div>

      <div className="mt-5 hidden overflow-hidden rounded-lg border border-slate-200 lg:block">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-950 text-left text-xs uppercase tracking-[0.1em] text-white">
            <tr>
              <th className="px-4 py-3">Detalle</th>
              <th className="px-4 py-3">Costo unitario</th>
              <th className="px-4 py-3">Cantidad</th>
              <th className="px-4 py-3 text-right">Total linea</th>
              <th className="px-4 py-3 text-right">Accion</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-200">
                <td className="px-4 py-3">
                  <input className={inputClass} value={item.detail} onChange={(event) => updateItem(item.id, 'detail', event.target.value)} placeholder="Detalle del item" />
                </td>
                <td className="px-4 py-3">
                  <input className={inputClass} type="number" min="0" step="0.01" value={item.unitPrice} onChange={(event) => updateItem(item.id, 'unitPrice', event.target.value)} placeholder="0" />
                </td>
                <td className="px-4 py-3">
                  <input className={inputClass} type="number" min="0" step="0.01" value={item.quantity} onChange={(event) => updateItem(item.id, 'quantity', event.target.value)} placeholder="1" />
                </td>
                <td className="px-4 py-3 text-right text-base font-black text-slate-950">{formatCurrency(calculateLineTotal(item))}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onSaveItem(item)} className="touch-target rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 font-bold text-teal-800 hover:bg-teal-100">
                    Guardar
                  </button>
                  <button onClick={() => removeItem(item.id)} className="touch-target ml-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-bold text-slate-600 hover:bg-slate-50">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 lg:hidden">
        {items.map((item, index) => (
          <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-black text-slate-950">Item {index + 1}</h4>
              <div className="flex gap-2">
                <button onClick={() => onSaveItem(item)} className="touch-target rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-bold text-teal-800">
                  Guardar
                </button>
                <button onClick={() => removeItem(item.id)} className="touch-target rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600">
                  Eliminar
                </button>
              </div>
            </div>
            <div className="mt-4 grid gap-4">
              <Field label="Detalle">
                <input className={inputClass} value={item.detail} onChange={(event) => updateItem(item.id, 'detail', event.target.value)} placeholder="Detalle del item" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Costo unitario">
                  <input className={inputClass} type="number" min="0" step="0.01" value={item.unitPrice} onChange={(event) => updateItem(item.id, 'unitPrice', event.target.value)} placeholder="0" />
                </Field>
                <Field label="Cantidad">
                  <input className={inputClass} type="number" min="0" step="0.01" value={item.quantity} onChange={(event) => updateItem(item.id, 'quantity', event.target.value)} placeholder="1" />
                </Field>
              </div>
              <div className="rounded-lg bg-white px-4 py-3 text-right">
                <span className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Total linea</span>
                <strong className="text-xl text-slate-950">{formatCurrency(calculateLineTotal(item))}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
