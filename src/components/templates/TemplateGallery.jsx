import { createTemplate } from '../../utils/templateStorage';
import TemplateCard from './TemplateCard';

export default function TemplateGallery({ templates, activeTemplateId, onCreate, onEdit, onDuplicate, onDelete, onActivate }) {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Templates</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">Galeria de templates guardados</h2>
        </div>
        <button onClick={() => onCreate(createTemplate({ name: 'Nuevo template' }))} className="touch-target rounded-lg bg-slate-950 px-5 py-3 text-base font-bold text-white shadow-sm">
          Nuevo template
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            active={template.id === activeTemplateId}
            onEdit={() => onEdit(template)}
            onDuplicate={() => onDuplicate(template.id)}
            onDelete={() => onDelete(template.id)}
            onActivate={() => onActivate(template.id)}
          />
        ))}
      </div>
    </section>
  );
}
