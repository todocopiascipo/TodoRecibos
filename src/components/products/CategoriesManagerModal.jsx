import { useEffect, useState } from 'react';

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-100';

export default function CategoriesManagerModal({ categories, products, onSave, onUpdate, onDelete, onClose, onNameCheck }) {
  const [draftName, setDraftName] = useState('');
  const [editingId, setEditingId] = useState('');
  const [error, setError] = useState('');

  const editingCategory = categories.find((category) => category.id === editingId);

  useEffect(() => {
    setDraftName(editingCategory?.name || '');
    setError('');
  }, [editingCategory]);

  async function handleSubmit() {
    const name = draftName.trim();
    const duplicate = await onNameCheck(name, editingId || null);

    if (duplicate) {
      setError('Categoria ya existente');
      return;
    }

    if (!name) return;

    if (editingId) {
      await onUpdate(editingId, { name });
    } else {
      await onSave({ name });
    }

    setDraftName('');
    setEditingId('');
    setError('');
  }

  async function handleDelete(category) {
    const associated = products.filter((product) => product.categoryId === category.id).length;
    if (associated > 0) {
      const confirmed = window.confirm(`Esta categoria tiene ${associated} producto(s). Se reasignaran a Otros.`);
      if (!confirmed) return;
    }

    await onDelete(category.id);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/40 p-0 sm:place-items-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-soft sm:max-w-3xl sm:rounded-lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Categorias</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Gestionar categorias</h2>
          </div>
          <button onClick={onClose} className="touch-target rounded-lg border border-slate-200 bg-white px-5 py-3 text-base font-bold text-slate-700">
            Cerrar
          </button>
        </div>

        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <label>
            <span className="text-sm font-semibold text-slate-700">{editingId ? 'Editar categoria' : 'Nueva categoria'}</span>
            <input value={draftName} onChange={(event) => setDraftName(event.target.value)} className={`${inputClass} mt-2 ${error ? 'border-rose-400 bg-rose-50' : ''}`} placeholder="Nombre de categoria" />
          </label>
          {error && <p className="mt-2 text-sm font-bold text-rose-700">{error}</p>}
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <button onClick={handleSubmit} className="touch-target rounded-lg bg-slate-950 px-5 py-3 text-base font-bold text-white">
              {editingId ? 'Guardar cambios' : 'Crear categoria'}
            </button>
            {editingId && (
              <button onClick={() => setEditingId('')} className="touch-target rounded-lg border border-slate-200 bg-white px-5 py-3 text-base font-bold text-slate-700">
                Cancelar edicion
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          {categories.map((category) => (
            <article key={category.id} className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-black text-slate-950">{category.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{category.isDefault ? 'Categoria base' : `${products.filter((product) => product.categoryId === category.id).length} producto(s)`}</p>
              </div>
              <div className="flex gap-2">
                <button disabled={category.isDefault} onClick={() => setEditingId(category.id)} className="touch-target rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">
                  Editar
                </button>
                <button disabled={category.isDefault} onClick={() => handleDelete(category)} className="touch-target rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 disabled:cursor-not-allowed disabled:opacity-40">
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
