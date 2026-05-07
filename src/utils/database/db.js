import { openDB } from 'idb';

export const DB_NAME = 'recibos-pro-db';
export const DB_VERSION = 3;

export const STORES = {
  templates: 'templates',
  receipts: 'receipts',
  settings: 'settings',
  products: 'products',
  categories: 'categories',
};

export function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      if (!db.objectStoreNames.contains(STORES.templates)) {
        const templates = db.createObjectStore(STORES.templates, { keyPath: 'id' });
        templates.createIndex('updatedAt', 'updatedAt');
        templates.createIndex('type', 'type');
      }

      if (!db.objectStoreNames.contains(STORES.receipts)) {
        const receipts = db.createObjectStore(STORES.receipts, { keyPath: 'id' });
        receipts.createIndex('createdAt', 'createdAt');
        receipts.createIndex('date', 'date');
        receipts.createIndex('templateId', 'templateId');
        receipts.createIndex('status', 'status');
      }

      if (!db.objectStoreNames.contains(STORES.settings)) {
        db.createObjectStore(STORES.settings, { keyPath: 'key' });
      }

      let products;
      if (!db.objectStoreNames.contains(STORES.products)) {
        products = db.createObjectStore(STORES.products, { keyPath: 'id' });
        products.createIndex('name', 'name');
        products.createIndex('category', 'category');
        products.createIndex('active', 'active');
        products.createIndex('updatedAt', 'updatedAt');
      } else {
        products = transaction.objectStore(STORES.products);
      }

      if (products && !products.indexNames.contains('categoryId')) {
        products.createIndex('categoryId', 'categoryId');
      }

      if (!db.objectStoreNames.contains(STORES.categories)) {
        const categories = db.createObjectStore(STORES.categories, { keyPath: 'id' });
        categories.createIndex('name', 'name');
        categories.createIndex('updatedAt', 'updatedAt');
      }
    },
  });
}

export async function getAllFromStore(storeName) {
  const db = await getDb();
  return db.getAll(storeName);
}

export async function getFromStore(storeName, key) {
  const db = await getDb();
  return db.get(storeName, key);
}

export async function putInStore(storeName, value) {
  const db = await getDb();
  await db.put(storeName, value);
  return value;
}

export async function deleteFromStore(storeName, key) {
  const db = await getDb();
  await db.delete(storeName, key);
}
