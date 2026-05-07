import { Link } from 'react-router-dom';

const tools = [
  {
    title: 'RecibosPro',
    description: 'Emití recibos, gestioná templates, productos, historial y PDFs desde el sistema principal.',
    path: '/recibos',
    icon: 'RP',
  },
  {
    title: 'Calculadora de Presupuestos',
    description: 'Calculá rápidamente trabajos de fotocopias, impresiones, papeles especiales y anillados.',
    path: '/presupuestos',
    icon: '$',
  },
  {
    title: 'Generador de Talonarios',
    description: 'Numerá PDFs de talonarios con ORIGINAL/COPIA, prefijos, rangos y vista previa visual.',
    path: '/talonarios',
    icon: 'PDF',
  },
];

export default function HomeDashboard() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-950 md:px-8">
      <section className="mx-auto max-w-6xl">
        <header className="rounded-2xl border border-white/80 bg-white p-6 shadow-panel md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-teal-700">Todo Copias</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">Panel principal</h1>
          <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-slate-500">
            Elegí una herramienta para trabajar. Cada módulo mantiene su flujo propio, con acceso claro para volver al inicio.
          </p>
        </header>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {tools.map((tool) => (
            <article key={tool.path} className="flex min-h-72 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-panel">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#1e61a8] to-[#312783] text-lg font-black text-white shadow-soft">
                {tool.icon}
              </div>
              <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-950">{tool.title}</h2>
              <p className="mt-3 flex-1 text-sm font-semibold leading-6 text-slate-500">{tool.description}</p>
              <Link
                to={tool.path}
                className="touch-target mt-6 inline-flex w-fit items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-base font-black text-white shadow-sm transition hover:bg-slate-800"
              >
                Abrir
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
