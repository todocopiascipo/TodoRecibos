export default function ProductFilters({ query, category, status, sort, categories, onQueryChange, onCategoryChange, onStatusChange, onSortChange }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-panel">
      <div className="grid gap-3 xl:grid-cols-[1fr_180px_220px]">
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-100"
          placeholder="Buscar producto"
        />
        <select value={status} onChange={(event) => onStatusChange(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-100">
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
        <select value={sort} onChange={(event) => onSortChange(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-100">
          <option value="recent">Mas recientes</option>
          <option value="name">Nombre A-Z</option>
          <option value="priceAsc">Precio menor a mayor</option>
          <option value="priceDesc">Precio mayor a menor</option>
        </select>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {[{ id: 'Todas', name: 'Todas' }, ...categories].map((item) => (
          <button
            key={item.id}
            onClick={() => onCategoryChange(item.id)}
            className={`touch-target whitespace-nowrap rounded-lg border px-4 py-3 text-sm font-bold ${
              category === item.id ? 'border-teal-600 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-600'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
