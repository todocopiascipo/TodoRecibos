import { useEffect, useState } from 'react';

const inputClass =
  'mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-100';

export default function CategoryFormModal({ category, onCancel, onSave, onNameCheck }) {
  const [name, setName] = useState(category?.name || '');
  const [duplicate, setDuplicate] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkDuplicate() {
      const exists = await onNameCheck(name, category?.id || null);
      if (mounted) setDuplicate(exists);
    }

    checkDuplicate();
    return () => {
      mounted = false;
    };
  }, [category?.id, name, onNameCheck]);

  const canSave = name.trim() && !duplicate;

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/40 p-0 sm:place-items-center sm:p-4">
      <div className="w-full rounded-t-2xl bg-white p-5 shadow-soft sm:max-w-lg sm:rounded-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Categoria</p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">{category ? 'Editar categoria' : 'Nueva categoria'}</h2>

        <label className="mt-5 block">
          <span className="text-sm font-semibold text-slate-700">Nombre</span>
          <input value={name} onChange={(event) => setName(event.target.value)} className={`${inputClass} ${duplicate ? 'border-rose-400 bg-rose-50' : ''}`} placeholder="Nombre de categoria" />
          {duplicate && <p className="mt-2 text-sm font-bold text-rose-700">Categoria ya existente</p>}
        </label>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button onClick={() => canSave && onSave({ ...category, name: name.trim() })} disabled={!canSave} className="touch-target rounded-lg bg-slate-950 px-5 py-3 text-base font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300">
            Guardar
          </button>
          <button onClick={onCancel} className="touch-target rounded-lg border border-slate-200 bg-white px-5 py-3 text-base font-bold text-slate-700">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
