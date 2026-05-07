import { createId } from '../id';
import { STORES, deleteFromStore, getAllFromStore, getFromStore, putInStore } from './db';
import { DEFAULT_CATEGORY_ID, DEFAULT_CATEGORY_NAME, ensureDefaultCategory, getCategories } from './categoriesDb';

function now() {
  return new Date().toISOString();
}

function normalizeName(name = '') {
  return name.trim().toLowerCase();
}

export function normalizeProduct(product = {}, categories = []) {
  const timestamp = now();
  const fallbackCategory = categories.find((category) => category.name === product.category);
  const categoryId = product.categoryId || fallbackCategory?.id || DEFAULT_CATEGORY_ID;
  const categoryName = categories.find((category) => category.id === categoryId)?.name || DEFAULT_CATEGORY_NAME;

  return {
    id: product.id || createId('product'),
    name: product.name || '',
    categoryId,
    category: categoryName,
    unitPrice: Number(product.unitPrice) || 0,
    image: product.image || '',
    active: product.active ?? true,
    createdAt: product.createdAt || timestamp,
    updatedAt: product.updatedAt || timestamp,
  };
}

export async function getProducts() {
  await ensureDefaultCategory();
  const categories = await getCategories();
  const products = await getAllFromStore(STORES.products);
  const normalizedProducts = products.map((product) => normalizeProduct(product, categories));

  await Promise.all(
    normalizedProducts
      .filter((product, index) => product.categoryId !== products[index]?.categoryId)
      .map((product) => putInStore(STORES.products, product)),
  );

  return normalizedProducts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export async function getActiveProducts() {
  const products = await getProducts();
  return products.filter((product) => product.active);
}

export async function productNameExists(name, excludeId = null) {
  const normalized = normalizeName(name);
  if (!normalized) return false;

  const products = await getProducts();
  return products.some((product) => normalizeName(product.name) === normalized && product.id !== excludeId);
}

export async function saveProduct(product) {
  const categories = await getCategories();
  const nextProduct = normalizeProduct({
    ...product,
    id: product.id || createId('product'),
    createdAt: product.createdAt || now(),
    updatedAt: now(),
  }, categories);

  await putInStore(STORES.products, nextProduct);
  return nextProduct;
}

export async function updateProduct(id, product) {
  const existing = await getFromStore(STORES.products, id);
  const categories = await getCategories();
  const updated = normalizeProduct({
    ...existing,
    ...product,
    id,
    createdAt: product.createdAt || existing?.createdAt || now(),
    updatedAt: now(),
  }, categories);

  await putInStore(STORES.products, updated);
  return updated;
}

export async function deleteProduct(id) {
  await deleteFromStore(STORES.products, id);
  return getProducts();
}

export async function reassignProductsToCategory(fromCategoryId, toCategoryId = DEFAULT_CATEGORY_ID) {
  const products = await getProducts();
  const affectedProducts = products.filter((product) => product.categoryId === fromCategoryId);

  await Promise.all(
    affectedProducts.map((product) =>
      updateProduct(product.id, {
        ...product,
        categoryId: toCategoryId,
        category: DEFAULT_CATEGORY_NAME,
      }),
    ),
  );

  return getProducts();
}
