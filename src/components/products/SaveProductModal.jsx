import { useMemo } from 'react';
import { normalizeProduct } from '../../utils/database/productsDb';
import ProductForm from './ProductForm';

export default function SaveProductModal({ item, categories, onCancel, onSave, onNameCheck, onCreateCategory }) {
  const product = useMemo(
    () =>
      normalizeProduct({
        name: item.detail || '',
        unitPrice: item.unitPrice || 0,
        category: 'Otros',
        categoryId: categories[0]?.id,
      }),
    [categories, item],
  );

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/40 p-0 sm:place-items-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-4 shadow-soft sm:max-w-4xl sm:rounded-lg">
        <ProductForm product={product} categories={categories} title="Guardar item como producto" onCancel={onCancel} onSave={onSave} onNameCheck={onNameCheck} onCreateCategory={onCreateCategory} />
      </div>
    </div>
  );
}
