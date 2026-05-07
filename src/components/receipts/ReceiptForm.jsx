import { applyDiscountAmount, applyDiscountPercent, createReceiptItem } from '../../utils/sampleReceipt';
import ProductPickerModal from '../products/ProductPickerModal';
import SaveProductModal from '../products/SaveProductModal';
import ReceiptItemsTable from './ReceiptItemsTable';
import ReceiptTotals from './ReceiptTotals';
import { useState } from 'react';

const paymentMethods = ['Efectivo', 'Transferencia', 'Mercado Pago', 'Tarjeta', 'Otro'];

const inputClass =
  'mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-100';

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export default function ReceiptForm({
  receipt,
  activeTemplate,
  templates,
  products,
  categories,
  onReceiptChange,
  onClearReceipt,
  onUseSample,
  onEmit,
  onTemplateChange,
  onSaveProduct,
  onProductNameCheck,
  onCreateCategory,
}) {
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [itemToSave, setItemToSave] = useState(null);

  function updateField(field, value) {
    onReceiptChange({ ...receipt, [field]: value });
  }

  function addProductToReceipt(product) {
    const nextItem = createReceiptItem({
      detail: product.name,
      unitPrice: product.unitPrice,
      quantity: 1,
      productId: product.id,
    });

    onReceiptChange(applyDiscountPercent({ ...receipt, items: [...receipt.items, nextItem] }, receipt.discountPercent));
  }

  async function handleSaveProduct(product) {
    await onSaveProduct(product);
    setItemToSave(null);
  }

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-teal-100 bg-white p-5 shadow-panel">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Emision independiente</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Nuevo recibo</h2>
            <p className="mt-1 text-sm text-slate-500">Template utilizado: <strong className="text-slate-900">{activeTemplate?.name || 'Sin template'}</strong></p>
          </div>
          <label className="w-full xl:w-80">
            <span className="text-sm font-semibold text-slate-700">Cambiar template</span>
            <select className={inputClass} value={activeTemplate?.id || ''} onChange={(event) => onTemplateChange(event.target.value)}>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Numero de recibo">
            <input className={inputClass} value={receipt.receiptNumber} onChange={(event) => updateField('receiptNumber', event.target.value)} />
          </Field>
          <Field label="Fecha">
            <input className={inputClass} type="date" value={receipt.date} onChange={(event) => updateField('date', event.target.value)} />
          </Field>
          <Field label="Recibi de">
            <input className={inputClass} value={receipt.receivedFrom} onChange={(event) => updateField('receivedFrom', event.target.value)} placeholder="Nombre del cliente" />
          </Field>
          <Field label="Medio de pago">
            <select className={inputClass} value={receipt.paymentMethod} onChange={(event) => updateField('paymentMethod', event.target.value)}>
              {paymentMethods.map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Observaciones opcionales">
          <textarea className={`${inputClass} min-h-24 resize-y`} value={receipt.observations} onChange={(event) => updateField('observations', event.target.value)} placeholder="Notas o aclaraciones para el recibo" />
        </Field>
      </div>

      <ReceiptItemsTable
        items={receipt.items}
        onItemsChange={(items) => onReceiptChange(applyDiscountPercent({ ...receipt, items }, receipt.discountPercent))}
        onPickProduct={() => setProductPickerOpen(true)}
        onSaveItem={setItemToSave}
      />
      <ReceiptTotals
        receipt={receipt}
        onDiscountPercentChange={(value) => onReceiptChange(applyDiscountPercent(receipt, value))}
        onDiscountAmountChange={(value) => onReceiptChange(applyDiscountAmount(receipt, value))}
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <button onClick={onEmit} className="touch-target rounded-lg bg-teal-700 px-5 py-3 text-base font-black text-white shadow-sm transition hover:bg-teal-800">
          Emitir recibo
        </button>
        <button onClick={onClearReceipt} className="touch-target rounded-lg border border-slate-200 bg-white px-5 py-3 text-base font-bold text-slate-700 transition hover:bg-slate-50">
          Limpiar recibo
        </button>
        <button onClick={onUseSample} className="touch-target rounded-lg border border-teal-200 bg-teal-50 px-5 py-3 text-base font-bold text-teal-800 transition hover:bg-teal-100">
          Usar datos de ejemplo
        </button>
      </div>

      {productPickerOpen && (
        <ProductPickerModal products={products} categories={categories} onAddProduct={addProductToReceipt} onClose={() => setProductPickerOpen(false)} />
      )}

      {itemToSave && (
        <SaveProductModal item={itemToSave} categories={categories} onCancel={() => setItemToSave(null)} onSave={handleSaveProduct} onNameCheck={onProductNameCheck} onCreateCategory={onCreateCategory} />
      )}
    </section>
  );
}
