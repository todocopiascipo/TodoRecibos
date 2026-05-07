import { createId } from '../id';
import { STORES, deleteFromStore, getAllFromStore, getFromStore, putInStore } from './db';

export const DEFAULT_CATEGORY_ID = 'category-otros';
export const DEFAULT_CATEGORY_NAME = 'Otros';

function now() {
  return new Date().toISOString();
}

function normalizeName(name = '') {
  return name.trim().toLowerCase();
}

export function normalizeCategory(category = {}) {
  const isDefault = category.isDefault || category.id === DEFAULT_CATEGORY_ID;
  const timestamp = now();

  return {
    id: isDefault ? DEFAULT_CATEGORY_ID : category.id || createId('category'),
    name: isDefault ? DEFAULT_CATEGORY_NAME : category.name || '',
    isDefault,
    createdAt: category.createdAt || timestamp,
    updatedAt: category.updatedAt || timestamp,
  };
}

export async function ensureDefaultCategory() {
  const existing = await getFromStore(STORES.categories, DEFAULT_CATEGORY_ID);
  if (existing) return normalizeCategory(existing);

  const defaultCategory = normalizeCategory({
    id: DEFAULT_CATEGORY_ID,
    name: DEFAULT_CATEGORY_NAME,
    isDefault: true,
  });

  await putInStore(STORES.categories, defaultCategory);
  return defaultCategory;
}

export async function getCategories() {
  await ensureDefaultCategory();
  const categories = await getAllFromStore(STORES.categories);
  return categories
    .map(normalizeCategory)
    .sort((a, b) => {
      if (a.isDefault) return -1;
      if (b.isDefault) return 1;
      return a.name.localeCompare(b.name);
    });
}

export async function categoryNameExists(name, excludeId = null) {
  const normalized = normalizeName(name);
  if (!normalized) return false;

  const categories = await getCategories();
  return categories.some((category) => normalizeName(category.name) === normalized && category.id !== excludeId);
}

export async function saveCategory(category) {
  const duplicate = await categoryNameExists(category.name, category.id);
  if (duplicate) {
    throw new Error('Categoria ya existente');
  }

  const nextCategory = normalizeCategory({
    ...category,
    id: category.id || createId('category'),
    isDefault: false,
    name: category.name.trim(),
    createdAt: category.createdAt || now(),
    updatedAt: now(),
  });

  await putInStore(STORES.categories, nextCategory);
  return nextCategory;
}

export async function updateCategory(id, category) {
  const existing = await getFromStore(STORES.categories, id);
  const safeExisting = normalizeCategory(existing);

  if (safeExisting.isDefault) {
    return safeExisting;
  }

  const duplicate = await categoryNameExists(category.name, id);
  if (duplicate) {
    throw new Error('Categoria ya existente');
  }

  const updated = normalizeCategory({
    ...safeExisting,
    ...category,
    id,
    isDefault: false,
    name: category.name.trim(),
    updatedAt: now(),
  });

  await putInStore(STORES.categories, updated);
  return updated;
}

export async function deleteCategory(id) {
  const category = await getFromStore(STORES.categories, id);
  const safeCategory = normalizeCategory(category);

  if (safeCategory.isDefault) {
    return getCategories();
  }

  await deleteFromStore(STORES.categories, id);
  return getCategories();
}
