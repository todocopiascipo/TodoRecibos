const sizes = [
  { id: 'a4', label: 'A4' },
  { id: 'half', label: 'Media A4' },
  { id: 'ticket', label: 'Ticket vertical' },
];

const modes = [
  { id: 'original', label: 'Solo original' },
  { id: 'copy', label: 'Original + copia' },
];

const margins = [
  { id: 'normal', label: 'Normal' },
  { id: 'reduced', label: 'Reducido' },
  { id: 'wide', label: 'Amplio' },
];

function OptionGroup({ title, value, options, onChange }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`touch-target rounded-lg border px-4 py-3 text-sm font-bold transition ${
              value === option.id
                ? 'border-teal-600 bg-teal-50 text-teal-800'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PrintSettings({ settings, onSettingsChange }) {
  const update = (id, value) => onSettingsChange({ ...settings, [id]: value });

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Impresion</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">Ajustes visuales</h2>
      </div>

      <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
        <OptionGroup title="Tamano" value={settings.size} options={sizes} onChange={(value) => update('size', value)} />
        <OptionGroup title="Modo" value={settings.mode} options={modes} onChange={(value) => update('mode', value)} />
        <OptionGroup title="Margenes" value={settings.margins} options={margins} onChange={(value) => update('margins', value)} />
      </div>
    </section>
  );
}
