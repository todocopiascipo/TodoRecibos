import { Link } from 'react-router-dom';

export default function ToolFrame({ title, description, children }) {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:px-6">
        <div className="mx-auto flex max-w-[1520px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
<<<<<<< HEAD
            <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Todo Copias</p>
=======
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#1e61a8]">Todo Copias</p>
>>>>>>> 728f2f2 (Integra suite Todo Copias con rutas principales)
            <h1 className="text-xl font-black tracking-tight text-slate-950">{title}</h1>
            {description && <p className="text-sm font-semibold text-slate-500">{description}</p>}
          </div>
          <Link
            to="/"
            className="touch-target inline-flex w-fit items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Volver al inicio
          </Link>
        </div>
      </header>
      {children}
    </main>
  );
}
