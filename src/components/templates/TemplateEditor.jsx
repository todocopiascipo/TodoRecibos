import { useState } from 'react';
import BrandSettings from '../shared/BrandSettings';
import PrintSettings from '../shared/PrintSettings';
import ReceiptPreview from '../ReceiptPreview';
import { sampleReceipt } from '../../utils/sampleReceipt';
import { visualTemplates } from './templateRegistry';

export default function TemplateEditor({ template, onCancel, onSave }) {
  const [draft, setDraft] = useState(template);

  function updateDraft(updates) {
    setDraft((current) => ({ ...current, ...updates }));
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Editor</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">Editar template</h2>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button onClick={onCancel} className="touch-target rounded-lg border border-slate-200 bg-white px-5 py-3 text-base font-bold text-slate-700">Cancelar</button>
          <button onClick={() => onSave(draft)} className="touch-target rounded-lg bg-slate-950 px-5 py-3 text-base font-bold text-white">Guardar template</button>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
        <label>
          <span className="text-sm font-semibold text-slate-700">Nombre del template</span>
          <input
            value={draft.name}
            onChange={(event) => updateDraft({ name: event.target.value })}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-100"
            placeholder="Template Todo Copias"
          />
        </label>

        <div className="mt-5">
          <h3 className="text-sm font-bold text-slate-800">Tipo visual</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            {visualTemplates.map((visual) => (
              <button
                key={visual.id}
                onClick={() => updateDraft({ type: visual.id })}
                className={`touch-target rounded-lg border px-4 py-3 text-sm font-bold ${
                  draft.type === visual.id ? 'border-teal-600 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                {visual.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <BrandSettings
        brand={draft.brand}
        onBrandChange={(brand) => updateDraft({ brand })}
        onSave={() => onSave(draft)}
        onReset={() => updateDraft({ brand: template.brand })}
      />

      <PrintSettings settings={draft.printSettings} onSettingsChange={(printSettings) => updateDraft({ printSettings })} />

      <ReceiptPreview brand={draft.brand} receipt={sampleReceipt} selectedTemplate={draft.type} printSettings={draft.printSettings} title="Preview del template" />
    </section>
  );
}
