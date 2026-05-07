import { useEffect, useMemo, useRef, useState } from 'react';
import ReceiptHistory from './components/history/ReceiptHistory';
import ManageProductsPage from './components/products/ManageProductsPage';
import ReceiptForm from './components/receipts/ReceiptForm';
import {
  createReceiptPdf,
  createReceiptPdfFile,
  downloadReceiptPdf,
  generateReceiptPdfBlob,
  openWhatsAppFallback,
  shareReceiptPdf,
} from './components/receipts/PdfGenerator';
import ReceiptPreview from './components/ReceiptPreview';
import TemplateEditor from './components/templates/TemplateEditor';
import TemplateGallery from './components/templates/TemplateGallery';
import { buildPreviewReceipt, createEmptyReceipt, createSampleReceiptForm, normalizeReceiptForm } from './utils/sampleReceipt';
import { clearCurrentReceipt, getCurrentReceipt, saveCurrentReceipt } from './utils/storage';
import {
  deleteTemplate,
  duplicateTemplate,
  getActiveTemplate,
  getTemplates,
  saveTemplate,
  setActiveTemplate,
  updateTemplate,
} from './utils/templateStorage';
import { deleteReceipt, duplicateReceipt, getReceipts, saveReceipt } from './utils/receiptHistoryStorage';
import { categoryNameExists, deleteCategory, getCategories, saveCategory, updateCategory } from './utils/database/categoriesDb';
import { deleteProduct, getProducts, productNameExists, reassignProductsToCategory, saveProduct, updateProduct } from './utils/database/productsDb';

const sections = [
  { id: 'templates', label: 'Templates' },
  { id: 'receipt', label: 'Nuevo recibo' },
  { id: 'products', label: 'Gestionar productos' },
  { id: 'history', label: 'Historial' },
  { id: 'settings', label: 'Configuracion general' },
];

export default function App() {
  const [activeSection, setActiveSection] = useState('templates');
  const [templates, setTemplates] = useState([]);
  const [activeTemplateId, setActiveTemplateId] = useState('');
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [currentReceipt, setCurrentReceipt] = useState(() => createEmptyReceipt());
  const [receipts, setReceipts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [viewReceipt, setViewReceipt] = useState(null);
  const [saveState, setSaveState] = useState('');
  const [loading, setLoading] = useState(true);

  const previewRef = useRef(null);
  const historyPreviewRef = useRef(null);

  const activeTemplate = useMemo(
    () => templates.find((template) => template.id === activeTemplateId) || templates[0],
    [activeTemplateId, templates],
  );

  const previewReceipt = useMemo(() => buildPreviewReceipt(currentReceipt), [currentReceipt]);
  const viewedTemplate = useMemo(
    () => templates.find((template) => template.id === viewReceipt?.templateId) || activeTemplate,
    [activeTemplate, templates, viewReceipt],
  );
  const viewedPreviewReceipt = useMemo(() => (viewReceipt ? buildPreviewReceipt(viewReceipt) : null), [viewReceipt]);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const dbTemplates = await getTemplates();
      const [dbActiveTemplate, dbCurrentReceipt, dbReceipts, dbCategories] = await Promise.all([
        getActiveTemplate(),
        getCurrentReceipt(createEmptyReceipt()),
        getReceipts(),
        getCategories(),
      ]);
      const dbProducts = await getProducts();

      if (!mounted) return;

      setTemplates(dbTemplates);
      setActiveTemplateId(dbActiveTemplate?.id || dbTemplates[0]?.id || '');
      setCurrentReceipt(normalizeReceiptForm(dbCurrentReceipt || createEmptyReceipt()));
      setReceipts(dbReceipts);
      setCategories(dbCategories);
      setProducts(dbProducts);
      setLoading(false);
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      saveCurrentReceipt(currentReceipt);
    }
  }, [currentReceipt, loading]);

  function flash(message) {
    setSaveState(message);
    window.setTimeout(() => setSaveState(''), 1800);
  }

  async function refreshTemplates(nextActiveId = activeTemplateId) {
    const nextTemplates = await getTemplates();
    setTemplates(nextTemplates);
    setActiveTemplateId(nextTemplates.find((template) => template.id === nextActiveId)?.id || nextTemplates[0]?.id);
  }

  async function handleActivateTemplate(id) {
    await setActiveTemplate(id);
    setActiveTemplateId(id);
    flash('Template activo actualizado');
  }

  async function handleSaveTemplate(template) {
    const exists = templates.some((item) => item.id === template.id);
    const saved = exists ? await updateTemplate(template.id, template) : await saveTemplate(template);
    await setActiveTemplate(saved.id);
    await refreshTemplates(saved.id);
    setEditingTemplate(null);
    flash('Template guardado');
  }

  async function handleDeleteTemplate(id) {
    if (templates.length <= 1) {
      flash('Debe quedar al menos un template');
      return;
    }

    const nextTemplates = await deleteTemplate(id);
    const nextActiveTemplate = await getActiveTemplate();
    setTemplates(nextTemplates);
    setActiveTemplateId(nextActiveTemplate?.id || nextTemplates[0]?.id);
    flash('Template eliminado');
  }

  async function handleDuplicateTemplate(id) {
    const duplicated = await duplicateTemplate(id);
    await refreshTemplates(duplicated?.id);
    flash('Template duplicado');
  }

  async function handleClearReceipt() {
    await clearCurrentReceipt();
    setCurrentReceipt(createEmptyReceipt());
    flash('Recibo limpio');
  }

  function handleUseSampleReceipt() {
    setCurrentReceipt(createSampleReceiptForm());
    flash('Datos de ejemplo cargados');
  }

  async function downloadFromElement(element, receipt, template = activeTemplate) {
    const pdf = await createReceiptPdf(element, `${receipt.receiptNumber || 'recibo'}.pdf`, template.printSettings);
    pdf.save();
  }

  async function printFromElement(element, receipt, template = activeTemplate) {
    const pdf = await createReceiptPdf(element, `${receipt.receiptNumber || 'recibo'}.pdf`, template.printSettings);
    pdf.print();
  }

  function validateReceiptForIssue() {
    if (!activeTemplate) {
      flash('Selecciona un template antes de emitir');
      return false;
    }

    if (!currentReceipt.receiptNumber?.trim()) {
      flash('Completa el numero de recibo');
      return false;
    }

    if (!currentReceipt.items?.length) {
      flash('Agrega al menos un item');
      return false;
    }

    return true;
  }

  async function issueCurrentReceipt() {
    const calculated = buildPreviewReceipt(currentReceipt);
    const saved = await saveReceipt({
      ...currentReceipt,
      subtotal: calculated.subtotal,
      discountAmount: calculated.discountAmount,
      discountPercent: calculated.discountPercent,
      total: calculated.total,
      templateId: activeTemplate.id,
    });

    setReceipts(await getReceipts());
    setViewReceipt(saved);
    return { saved, calculated };
  }

  async function handleEmitReceipt() {
    if (!validateReceiptForIssue()) return;

    await issueCurrentReceipt();
    flash('Recibo emitido y guardado');
  }

  async function handleEmitAndShareReceipt() {
    if (!validateReceiptForIssue()) return;

    const { saved, calculated } = await issueCurrentReceipt();
    const fileName = `${calculated.receiptNumber || calculated.number || 'recibo'}.pdf`;
    const pdfBlob = await generateReceiptPdfBlob(previewRef.current, activeTemplate.printSettings);
    const pdfFile = createReceiptPdfFile(pdfBlob, fileName);

    try {
      const shared = await shareReceiptPdf(pdfFile, calculated);

      if (shared) {
        flash('Recibo emitido y listo para compartir');
        return;
      }

      downloadReceiptPdf(pdfBlob, fileName);
      openWhatsAppFallback(calculated);
      flash('PDF descargado. WhatsApp abierto como alternativa');
    } catch (error) {
      if (error?.name === 'AbortError') {
        flash('Recibo emitido y guardado');
        return;
      }

      downloadReceiptPdf(pdfBlob, fileName);
      openWhatsAppFallback(saved);
      flash('PDF descargado. WhatsApp abierto como alternativa');
    }
  }

  async function handleDuplicateReceipt(id) {
    const duplicated = await duplicateReceipt(id);
    setReceipts(await getReceipts());
    if (duplicated) setCurrentReceipt(normalizeReceiptForm(duplicated));
    flash('Recibo duplicado');
  }

  async function handleDeleteReceipt(id) {
    setReceipts(await deleteReceipt(id));
    if (viewReceipt?.id === id) setViewReceipt(null);
    flash('Recibo eliminado');
  }

  async function handleSaveProduct(product) {
    const saved = await saveProduct(product);
    setProducts(await getProducts());
    flash('Producto guardado');
    return saved;
  }

  async function handleUpdateProduct(id, product) {
    const updated = await updateProduct(id, product);
    setProducts(await getProducts());
    flash('Producto actualizado');
    return updated;
  }

  async function handleDeleteProduct(id) {
    setProducts(await deleteProduct(id));
    flash('Producto eliminado');
  }

  async function refreshCategoriesAndProducts() {
    const [nextCategories, nextProducts] = await Promise.all([getCategories(), getProducts()]);
    setCategories(nextCategories);
    setProducts(nextProducts);
    return { categories: nextCategories, products: nextProducts };
  }

  async function handleCreateCategory(category) {
    try {
      const saved = await saveCategory(category);
      await refreshCategoriesAndProducts();
      flash('Categoria creada');
      return saved;
    } catch {
      return null;
    }
  }

  async function handleUpdateCategory(id, category) {
    try {
      const updated = await updateCategory(id, category);
      await refreshCategoriesAndProducts();
      flash('Categoria actualizada');
      return updated;
    } catch {
      return null;
    }
  }

  async function handleDeleteCategory(id) {
    await reassignProductsToCategory(id);
    await deleteCategory(id);
    await refreshCategoriesAndProducts();
    flash('Categoria eliminada');
  }

  function handleDownloadHistoryReceipt(receipt) {
    setViewReceipt(receipt);
    window.setTimeout(() => {
      const template = templates.find((item) => item.id === receipt.templateId) || activeTemplate;
      downloadFromElement(historyPreviewRef.current, buildPreviewReceipt(receipt), template);
    }, 100);
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 px-4 text-slate-900">
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-panel">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Recibos Pro</p>
          <h1 className="mt-2 text-2xl font-black text-slate-950">Cargando base local</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex w-full max-w-[1520px] flex-col gap-5 px-4 py-4 md:px-6 lg:grid lg:grid-cols-[248px_1fr] lg:py-6">
        <aside className="rounded-lg border border-white/70 bg-white/95 p-3 shadow-panel lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <div className="px-3 py-3">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-teal-700 text-lg font-black text-white">R</div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-slate-950">Recibos Pro</h1>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Emission Studio</p>
              </div>
            </div>
          </div>

          <nav className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  setEditingTemplate(null);
                }}
                className={`touch-target rounded-lg px-4 py-3 text-left text-sm font-bold transition ${
                  activeSection === section.id ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>

          <div className="mt-5 hidden rounded-lg border border-slate-200 bg-slate-50 p-4 lg:block">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Template activo</p>
            <p className="mt-2 text-base font-black text-slate-950">{activeTemplate?.name}</p>
            <div className="mt-4 flex gap-2">
              {[activeTemplate?.brand.primaryColor, activeTemplate?.brand.secondaryColor, activeTemplate?.brand.accentColor].filter(Boolean).map((color) => (
                <span key={color} className="h-8 flex-1 rounded-md border border-white shadow-sm" style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
        </aside>

        <div className="space-y-5">
          <header className="rounded-lg border border-white/70 bg-white p-5 shadow-panel">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Sistema profesional</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Templates, emision y PDFs</h2>
              </div>
              {saveState && <span className="w-fit rounded-full bg-teal-50 px-4 py-2 text-sm font-bold text-teal-800">{saveState}</span>}
            </div>
          </header>

          {activeSection === 'templates' && (
            editingTemplate ? (
              <TemplateEditor template={editingTemplate} onCancel={() => setEditingTemplate(null)} onSave={handleSaveTemplate} />
            ) : (
              <TemplateGallery
                templates={templates}
                activeTemplateId={activeTemplate?.id}
                onCreate={setEditingTemplate}
                onEdit={setEditingTemplate}
                onDuplicate={handleDuplicateTemplate}
                onDelete={handleDeleteTemplate}
                onActivate={handleActivateTemplate}
              />
            )
          )}

          {activeSection === 'receipt' && activeTemplate && (
            <>
              <ReceiptForm
                receipt={currentReceipt}
                activeTemplate={activeTemplate}
                templates={templates}
                products={products}
                categories={categories}
                onReceiptChange={(receipt) => setCurrentReceipt(normalizeReceiptForm(receipt))}
                onClearReceipt={handleClearReceipt}
                onUseSample={handleUseSampleReceipt}
                onEmit={handleEmitReceipt}
                onEmitAndShare={handleEmitAndShareReceipt}
                onTemplateChange={handleActivateTemplate}
                onSaveProduct={handleSaveProduct}
                onProductNameCheck={productNameExists}
                onCreateCategory={handleCreateCategory}
              />
              <div className="flex flex-col gap-3 sm:flex-row">
                <button onClick={() => downloadFromElement(previewRef.current, previewReceipt, activeTemplate)} className="touch-target rounded-lg border border-teal-200 bg-teal-50 px-5 py-3 text-base font-bold text-teal-800">
                  Descargar PDF
                </button>
                <button onClick={() => printFromElement(previewRef.current, previewReceipt, activeTemplate)} className="touch-target rounded-lg border border-slate-200 bg-white px-5 py-3 text-base font-bold text-slate-700">
                  Imprimir PDF
                </button>
              </div>
              <ReceiptPreview ref={previewRef} brand={activeTemplate.brand} receipt={previewReceipt} selectedTemplate={activeTemplate.type} printSettings={activeTemplate.printSettings} />
            </>
          )}

          {activeSection === 'products' && (
            <ManageProductsPage
              products={products}
              categories={categories}
              onSave={handleSaveProduct}
              onUpdate={handleUpdateProduct}
              onDelete={handleDeleteProduct}
              onNameCheck={productNameExists}
              onCreateCategory={handleCreateCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
              onCategoryNameCheck={categoryNameExists}
            />
          )}

          {activeSection === 'history' && (
            <>
              <ReceiptHistory
                receipts={receipts}
                templates={templates}
                onView={setViewReceipt}
                onDownload={handleDownloadHistoryReceipt}
                onDuplicate={handleDuplicateReceipt}
                onDelete={handleDeleteReceipt}
              />
              {viewReceipt && viewedTemplate && viewedPreviewReceipt && (
                <div className="space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button onClick={() => downloadFromElement(historyPreviewRef.current, viewedPreviewReceipt, viewedTemplate)} className="touch-target rounded-lg border border-teal-200 bg-teal-50 px-5 py-3 text-base font-bold text-teal-800">
                      Descargar PDF
                    </button>
                    <button onClick={() => printFromElement(historyPreviewRef.current, viewedPreviewReceipt, viewedTemplate)} className="touch-target rounded-lg border border-slate-200 bg-white px-5 py-3 text-base font-bold text-slate-700">
                      Imprimir PDF
                    </button>
                  </div>
                  <ReceiptPreview ref={historyPreviewRef} brand={viewedTemplate.brand} receipt={viewedPreviewReceipt} selectedTemplate={viewedTemplate.type} printSettings={viewedTemplate.printSettings} title="Recibo del historial" />
                </div>
              )}
            </>
          )}

          {activeSection === 'settings' && (
            <section className="space-y-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Configuracion</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">Configuracion general</h2>
              </div>
              <div className="grid gap-5 xl:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-400">Templates</p>
                  <strong className="mt-2 block text-3xl text-slate-950">{templates.length}</strong>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-400">Recibos emitidos</p>
                  <strong className="mt-2 block text-3xl text-slate-950">{receipts.length}</strong>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-400">Productos activos</p>
                  <strong className="mt-2 block text-3xl text-slate-950">{products.filter((product) => product.active).length}</strong>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-400">Template activo</p>
                  <strong className="mt-2 block text-xl text-slate-950">{activeTemplate?.name}</strong>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
