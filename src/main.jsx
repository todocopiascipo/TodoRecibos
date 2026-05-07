import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import HomeDashboard from './HomeDashboard.jsx';
import ToolFrame from './ToolFrame.jsx';
import './index.css';
import './styles/receipt.css';

function ExternalTool({ title, description, src }) {
  return (
    <ToolFrame title={title} description={description}>
      <div className="mx-auto max-w-[1520px] px-4 py-5 md:px-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
          <iframe className="h-[calc(100vh-120px)] min-h-[780px] w-full border-0" title={title} src={src} />
        </div>
      </div>
    </ToolFrame>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeDashboard />} />
        <Route
          path="/recibos"
          element={
<<<<<<< HEAD
            <ToolFrame title="RecibosPro" description="Sistema de emisión de recibos, templates, productos e historial.">
=======
            <ToolFrame title="RecibosPro" description="Sistema de emision de recibos, templates, productos e historial.">
>>>>>>> 728f2f2 (Integra suite Todo Copias con rutas principales)
              <App />
            </ToolFrame>
          }
        />
        <Route
          path="/presupuestos"
          element={
            <ExternalTool
<<<<<<< HEAD
              title="Calculadora de Presupuestos"
              description="Herramienta integrada desde /presupuestos.html."
=======
              title="Calcular Presupuestos"
              description="Calculadora integrada desde /presupuestos.html."
>>>>>>> 728f2f2 (Integra suite Todo Copias con rutas principales)
              src="/presupuestos.html"
            />
          }
        />
        <Route
          path="/talonarios"
          element={
            <ExternalTool
<<<<<<< HEAD
              title="Generador de Talonarios"
=======
              title="Generar Talonarios"
>>>>>>> 728f2f2 (Integra suite Todo Copias con rutas principales)
              description="Numerador PDF ORIGINAL/COPIA integrado."
              src="/talonarios-app/index.html"
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
