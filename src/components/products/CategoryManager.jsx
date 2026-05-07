export default function CategoryManager({ categories, products, selectedCategory, onSelectCategory, onCreate, onEdit, onDelete }) {
  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-black text-slate-950">Categorias</h3>
        <button onClick={onCreate} className="touch-target rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white">
          Nueva
        </button>
      </div>

      <div className="mt-4 grid gap-2">
        {[{ id: 'Todas', name: 'Todas', isDefault: true }, ...categories].map((category) => {
          const count = category.id === 'Todas' ? products.length : products.filter((product) => product.categoryId === category.id).length;

          return (
            <div key={category.id} className={`rounded-lg border p-3 ${selectedCategory === category.id ? 'border-teal-600 bg-teal-50' : 'border-slate-200 bg-white'}`}>
              <button onClick={() => onSelectCategory(category.id)} className="flex w-full items-center justify-between gap-3 text-left">
                <span className="font-black text-slate-950">{category.name}</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500">{count}</span>
              </button>
              {category.id !== 'Todas' && !category.isDefault && (
                <div className="mt-3 flex gap-2">
                  <button onClick={() => onEdit(category)} className="touch-target flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700">
                    Editar
                  </button>
                  <button onClick={() => onDelete(category)} className="touch-target flex-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
