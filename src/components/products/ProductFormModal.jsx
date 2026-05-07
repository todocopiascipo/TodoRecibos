import ProductForm from './ProductForm';

export default function ProductFormModal({ product, categories, title, onCancel, onSave, onNameCheck, onCreateCategory }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/40 p-0 sm:place-items-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-4 shadow-soft sm:max-w-5xl sm:rounded-lg">
        <ProductForm
          product={product}
          categories={categories}
          title={title}
          onCancel={onCancel}
          onSave={onSave}
          onNameCheck={onNameCheck}
          onCreateCategory={onCreateCategory}
        />
      </div>
    </div>
  );
}
