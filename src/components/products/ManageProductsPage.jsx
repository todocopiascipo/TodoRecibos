import { useMemo, useState } from 'react';
import { normalizeProduct } from '../../utils/database/productsDb';
import CategoryFormModal from './CategoryFormModal';
import CategoryManager from './CategoryManager';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import ProductFormModal from './ProductFormModal';

export default function ManageProductsPage({
  products,
  categories,
  onSave,
  onUpdate,
  onDelete,
  onNameCheck,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  onCategoryNameCheck,
}) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('recent');

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products
      .filter((product) => {
        const matchesQuery = !normalizedQuery || product.name.toLowerCase().includes(normalizedQuery);
        const matchesCategory = selectedCategory === 'Todas' || product.categoryId === selectedCategory;
        const matchesStatus = status === 'all' || (status === 'active' ? product.active : !product.active);
        return matchesQuery && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sort === 'name') return a.name.localeCompare(b.name);
        if (sort === 'priceAsc') return Number(a.unitPrice) - Number(b.unitPrice);
        if (sort === 'priceDesc') return Number(b.unitPrice) - Number(a.unitPrice);
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
  }, [products, query, selectedCategory, sort, status]);

  async function handleSaveProduct(product) {
    const cleanProduct = {
      ...product,
      name: product.name.trim(),
      unitPrice: Number(product.unitPrice) || 0,
    };

    if (products.some((item) => item.id === product.id)) {
      await onUpdate(product.id, cleanProduct);
    } else {
      await onSave(cleanProduct);
    }
    setEditingProduct(null);
  }

  async function handleDeleteProduct(product) {
    const confirmed = window.confirm(`Eliminar "${product.name}"? Los recibos historicos no se modifican.`);
    if (!confirmed) return;
    await onDelete(product.id);
  }

  async function handleSaveCategory(category) {
    if (category.id) {
      await onUpdateCategory(category.id, category);
    } else {
      await onCreateCategory(category);
    }
    setEditingCategory(null);
    setCategoryModalOpen(false);
  }

  async function handleDeleteCategory(category) {
    const associated = products.filter((product) => product.categoryId === category.id).length;
    if (associated > 0) {
      const confirmed = window.confirm(`Esta categoria tiene ${associated} producto(s). Se reasignaran a Otros.`);
      if (!confirmed) return;
    }
    await onDeleteCategory(category.id);
    if (selectedCategory === category.id) setSelectedCategory('Todas');
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Catalogo comercial</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">Gestionar productos</h2>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button onClick={() => setCategoryModalOpen(true)} className="touch-target rounded-lg border border-teal-200 bg-teal-50 px-5 py-3 text-base font-bold text-teal-800 shadow-sm">
            Nueva categoria
          </button>
          <button onClick={() => setEditingProduct(normalizeProduct({}, categories))} className="touch-target rounded-lg bg-slate-950 px-5 py-3 text-base font-bold text-white shadow-sm">
            Nuevo producto
          </button>
        </div>
      </div>

      <ProductFilters
        query={query}
        category={selectedCategory}
        status={status}
        sort={sort}
        categories={categories}
        onQueryChange={setQuery}
        onCategoryChange={setSelectedCategory}
        onStatusChange={setStatus}
        onSortChange={setSort}
      />

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:block">
          <CategoryManager
            categories={categories}
            products={products}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onCreate={() => setCategoryModalOpen(true)}
            onEdit={(category) => {
              setEditingCategory(category);
              setCategoryModalOpen(true);
            }}
            onDelete={handleDeleteCategory}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-400">{filteredProducts.length} producto(s)</p>
            <p className="text-sm font-semibold text-slate-500">{products.filter((product) => product.active).length} activos</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={categories.find((item) => item.id === product.categoryId)?.name || 'Otros'}
                onEdit={() => setEditingProduct(product)}
                onDelete={() => handleDeleteProduct(product)}
                onToggle={() => onUpdate(product.id, { ...product, active: !product.active })}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-panel">
              <h3 className="text-lg font-black text-slate-950">No hay productos para mostrar</h3>
              <p className="mt-2 text-slate-500">Ajusta filtros o crea un producto nuevo.</p>
            </div>
          )}
        </div>
      </div>

      {editingProduct && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          title={products.some((product) => product.id === editingProduct.id) ? 'Editar producto' : 'Nuevo producto'}
          onCancel={() => setEditingProduct(null)}
          onSave={handleSaveProduct}
          onNameCheck={onNameCheck}
          onCreateCategory={onCreateCategory}
        />
      )}

      {categoryModalOpen && (
        <CategoryFormModal
          category={editingCategory}
          onCancel={() => {
            setEditingCategory(null);
            setCategoryModalOpen(false);
          }}
          onSave={handleSaveCategory}
          onNameCheck={onCategoryNameCheck}
        />
      )}
    </section>
  );
}
