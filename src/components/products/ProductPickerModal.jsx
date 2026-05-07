import { useMemo, useState } from 'react';
import { formatCurrency } from '../../utils/receiptCalculations';

export default function ProductPickerModal({ products, categories, onAddProduct, onClose }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todas');

  const groupedProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesQuery = !normalizedQuery || product.name.toLowerCase().includes(normalizedQuery);
      const matchesCategory = category === 'Todas' || product.categoryId === category;
      return product.active && matchesQuery && matchesCategory;
    });

    return filtered.reduce((groups, product) => {
      const key = categories.find((item) => item.id === product.categoryId)?.name || 'Otros';
      return {
        ...groups,
        [key]: [...(groups[key] || []), product],
      };
    }, {});
  }, [categories, category, products, query]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/40 p-0 sm:place-items-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-soft sm:max-w-5xl sm:rounded-lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Catalogo</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Anadir item existente</h2>
          </div>
          <button onClick={onClose} className="touch-target rounded-lg border border-slate-200 bg-white px-5 py-3 text-base font-bold text-slate-700">
            Cerrar
          </button>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-100"
            placeholder="Buscar producto"
          />
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[{ id: 'Todas', name: 'Todas' }, ...categories].map((item) => (
              <button
                key={item.id}
                onClick={() => setCategory(item.id)}
                className={`touch-target whitespace-nowrap rounded-lg border px-4 py-3 text-sm font-bold ${
                  category === item.id ? 'border-teal-600 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {Object.entries(groupedProducts).map(([group, groupProducts]) => (
            <section key={group}>
              <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-400">{group}</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {groupProducts.map((product) => (
                  <article key={product.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="flex gap-3">
                      <div className="grid h-16 w-16 flex-none place-items-center overflow-hidden rounded-lg bg-white">
                        {product.image ? <img src={product.image} alt="" className="h-full w-full object-cover" /> : <span className="font-black text-teal-700">P</span>}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-black text-slate-950">{product.name}</h4>
                        <p className="mt-1 text-sm font-bold text-slate-500">{formatCurrency(product.unitPrice)}</p>
                      </div>
                    </div>
                    <button onClick={() => onAddProduct(product)} className="touch-target mt-3 w-full rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white">
                      Anadir
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ))}

          {Object.keys(groupedProducts).length === 0 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
              <h3 className="text-lg font-black text-slate-950">No hay productos activos</h3>
              <p className="mt-2 text-slate-500">Guarda productos desde una fila del recibo o desde la seccion Productos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
