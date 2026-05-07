import { useEffect, useState } from 'react';
import ProductImagePicker from './ProductImagePicker';

const inputClass =
  'mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-100';

export default function ProductForm({ product, categories, onCancel, onSave, onNameCheck, onCreateCategory, title = 'Producto' }) {
  const [draft, setDraft] = useState(product);
  const [duplicate, setDuplicate] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function checkName() {
      const exists = await onNameCheck(draft.name, draft.id);
      if (mounted) setDuplicate(exists);
    }

    checkName();
    return () => {
      mounted = false;
    };
  }, [draft.name, draft.id, onNameCheck]);

  function update(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  const priceIsValid = draft.unitPrice !== '' && Number.isFinite(Number(draft.unitPrice)) && Number(draft.unitPrice) >= 0;
  const canSave = draft.name.trim() && priceIsValid && !duplicate;

  async function handleCreateCategory() {
    const name = newCategoryName.trim();
    if (!name) return;

    const category = await onCreateCategory({ name });
    if (!category) {
      setCategoryError('Categoria ya existente');
      return;
    }

    update('categoryId', category.id);
    update('category', category.name);
    setNewCategoryName('');
    setCategoryError('');
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Catalogo</p>
          <h3 className="mt-2 text-2xl font-black text-slate-950">{title}</h3>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="touch-target rounded-lg border border-slate-200 bg-white px-5 py-3 text-base font-bold text-slate-700">
            Cancelar
          </button>
          <button
            onClick={() => canSave && onSave(draft)}
            disabled={!canSave}
            className="touch-target rounded-lg bg-slate-950 px-5 py-3 text-base font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Guardar
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[260px_1fr]">
        <ProductImagePicker image={draft.image} onChange={(image) => update('image', image)} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Nombre</span>
            <input
              value={draft.name}
              onChange={(event) => update('name', event.target.value)}
              className={`${inputClass} ${duplicate ? 'border-rose-400 bg-rose-50 focus:border-rose-500 focus:ring-rose-100' : ''}`}
              placeholder="Fotocopia A4"
            />
            {duplicate && <p className="mt-2 text-sm font-bold text-rose-700">Item ya existente</p>}
          </label>

          <label>
            <span className="text-sm font-semibold text-slate-700">Categoria</span>
            <select
              value={draft.categoryId}
              onChange={(event) => {
                const category = categories.find((item) => item.id === event.target.value);
                update('categoryId', event.target.value);
                update('category', category?.name || 'Otros');
              }}
              className={inputClass}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="text-sm font-semibold text-slate-700">Precio unitario</span>
            <input type="number" min="0" step="0.01" value={draft.unitPrice} onChange={(event) => update('unitPrice', event.target.value)} className={`${inputClass} ${!priceIsValid ? 'border-rose-400 bg-rose-50' : ''}`} placeholder="0" />
            {!priceIsValid && <p className="mt-2 text-sm font-bold text-rose-700">Precio invalido</p>}
          </label>

          <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
            <input type="checkbox" checked={draft.active} onChange={(event) => update('active', event.target.checked)} className="h-5 w-5 accent-teal-700" />
            <span className="text-sm font-bold text-slate-700">Producto activo</span>
          </label>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Nueva categoria rapida</span>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input value={newCategoryName} onChange={(event) => setNewCategoryName(event.target.value)} className={inputClass.replace('mt-2 ', '')} placeholder="Nombre de categoria" />
              <button type="button" onClick={handleCreateCategory} className="touch-target rounded-lg bg-teal-700 px-4 py-3 text-sm font-bold text-white">
                + Nueva categoria
              </button>
            </div>
            {categoryError && <p className="mt-2 text-sm font-bold text-rose-700">{categoryError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
