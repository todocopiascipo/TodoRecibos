import ReceiptPreview from '../ReceiptPreview';
import { sampleReceipt } from '../../utils/sampleReceipt';
import { getVisualTemplate } from './templateRegistry';

export default function TemplateCard({ template, active, onEdit, onDuplicate, onDelete, onActivate }) {
  const visual = getVisualTemplate(template.type);
  const updatedAt = new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(template.updatedAt));

  return (
    <article className={`rounded-lg border bg-white p-3 shadow-panel transition ${active ? 'border-teal-600 ring-4 ring-teal-100' : 'border-slate-200'}`}>
      <button onClick={onActivate} className="block w-full text-left">
        <div className="template-thumb overflow-hidden rounded-md bg-slate-100">
          <div className="origin-top-left scale-[0.34]">
            <ReceiptPreview brand={template.brand} receipt={sampleReceipt} selectedTemplate={template.type} printSettings={template.printSettings} compact />
          </div>
        </div>
      </button>

      <div className="mt-4 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-black text-slate-950">{template.name}</h3>
            {active && <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-800">Activo</span>}
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-500">{visual.name}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Modificado {updatedAt}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={onEdit} className="touch-target rounded-lg bg-slate-950 px-3 py-2 text-sm font-bold text-white">Editar</button>
          <button onClick={onDuplicate} className="touch-target rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700">Duplicar</button>
          <button onClick={onActivate} className="touch-target rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-bold text-teal-800">Usar</button>
          <button onClick={onDelete} className="touch-target rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">Eliminar</button>
        </div>
      </div>
    </article>
  );
}
