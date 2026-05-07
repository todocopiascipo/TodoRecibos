import { formatCurrency } from '../../utils/receiptCalculations';

export default function ProductCard({ product, categoryName, onEdit, onDelete, onToggle }) {
  return (
    <article className={`rounded-lg border bg-white p-4 shadow-panel ${product.active ? 'border-slate-200' : 'border-slate-200 opacity-70'}`}>
      <div className="flex gap-4">
        <div className="grid h-20 w-20 flex-none place-items-center overflow-hidden rounded-lg bg-slate-100">
          {product.image ? <img src={product.image} alt="" className="h-full w-full object-cover" /> : <span className="text-xl font-black text-teal-700">P</span>}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="truncate text-base font-black text-slate-950">{product.name}</h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">{categoryName}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-black ${product.active ? 'bg-teal-50 text-teal-800' : 'bg-slate-100 text-slate-500'}`}>
              {product.active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <strong className="mt-3 block text-xl text-slate-950">{formatCurrency(product.unitPrice)}</strong>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <button onClick={onEdit} className="touch-target rounded-lg bg-slate-950 px-3 py-2 text-sm font-bold text-white">Editar</button>
        <button onClick={onToggle} className="touch-target rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700">{product.active ? 'Desactivar' : 'Activar'}</button>
        <button onClick={onDelete} className="touch-target rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">Eliminar</button>
      </div>
    </article>
  );
}
