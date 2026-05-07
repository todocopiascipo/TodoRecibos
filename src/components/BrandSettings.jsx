import { defaultBrand } from '../data/defaultBrand';

const fields = [
  { id: 'businessName', label: 'Nombre del negocio', type: 'text' },
  { id: 'cuit', label: 'CUIT', type: 'text' },
  { id: 'address', label: 'Direccion', type: 'text' },
  { id: 'phone', label: 'Telefono / WhatsApp', type: 'text' },
  { id: 'email', label: 'Email', type: 'email' },
  { id: 'instagram', label: 'Instagram', type: 'text' },
  { id: 'footerNote', label: 'Leyenda inferior', type: 'text' },
];

const colorFields = [
  { id: 'primaryColor', label: 'Principal' },
  { id: 'secondaryColor', label: 'Secundario' },
  { id: 'accentColor', label: 'Acento' },
];

export default function BrandSettings({ brand, onBrandChange, onSave, onReset }) {
  function updateField(id, value) {
    onBrandChange({ ...brand, [id]: value });
  }

  function handleLogoUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => updateField('logo', reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Marca</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">Configuracion visual</h2>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
          <label className="text-sm font-semibold text-slate-800">Logo</label>
          <div className="mt-4 flex min-h-44 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5">
            {brand.logo ? (
              <img src={brand.logo} alt="Logo del negocio" className="max-h-28 max-w-full object-contain" />
            ) : (
              <div className="text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg bg-white text-xl font-bold text-teal-700 shadow-sm">
                  {(brand.businessName || defaultBrand.businessName).charAt(0)}
                </div>
                <p className="mt-3 text-sm text-slate-500">Placeholder de logo</p>
              </div>
            )}
          </div>
          <input
            className="mt-4 block w-full cursor-pointer rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
          />
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <label key={field.id} className={field.id === 'footerNote' ? 'sm:col-span-2' : ''}>
                <span className="text-sm font-semibold text-slate-700">{field.label}</span>
                <input
                  type={field.type}
                  value={brand[field.id] || ''}
                  onChange={(event) => updateField(field.id, event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-100"
                  placeholder={field.label}
                />
              </label>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {colorFields.map((field) => (
              <label key={field.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <span className="text-sm font-semibold text-slate-700">{field.label}</span>
                <div className="mt-3 flex items-center gap-3">
                  <input
                    type="color"
                    value={brand[field.id] || defaultBrand[field.id]}
                    onChange={(event) => updateField(field.id, event.target.value)}
                    className="h-11 w-12 cursor-pointer rounded-md border border-slate-200 bg-white"
                  />
                  <input
                    type="text"
                    value={brand[field.id] || defaultBrand[field.id]}
                    onChange={(event) => updateField(field.id, event.target.value)}
                    className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-600"
                  />
                </div>
              </label>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button onClick={onSave} className="touch-target rounded-lg bg-slate-950 px-5 py-3 text-base font-bold text-white shadow-sm transition hover:bg-slate-800">
              Guardar configuracion
            </button>
            <button onClick={onReset} className="touch-target rounded-lg border border-slate-200 bg-white px-5 py-3 text-base font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
              Restablecer configuracion
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
