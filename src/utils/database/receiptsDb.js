import { createId } from '../id';
import { STORES, deleteFromStore, getAllFromStore, getFromStore, putInStore } from './db';

function safeParse(value, fallback) {
  if (!value) return fallback;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function legacyReceipts() {
  if (typeof window === 'undefined') return [];
  const receipts = safeParse(window.localStorage.getItem('receipt.history.v1'), []);
  return Array.isArray(receipts) ? receipts : [];
}

function normalizeReceipt(receipt = {}) {
  const timestamp = new Date().toISOString();

  return {
    ...receipt,
    id: receipt.id || createId('receipt'),
    items: Array.isArray(receipt.items) ? receipt.items : [],
    subtotal: Number(receipt.subtotal) || 0,
    discountAmount: Number(receipt.discountAmount) || 0,
    discountPercent: Number(receipt.discountPercent) || 0,
    total: Number(receipt.total) || 0,
    templateId: receipt.templateId || '',
    status: receipt.status || 'issued',
    observations: receipt.observations || '',
    createdAt: receipt.createdAt || timestamp,
    updatedAt: receipt.updatedAt || receipt.createdAt || timestamp,
  };
}

async function ensureLegacyReceiptsMigrated() {
  const existing = await getAllFromStore(STORES.receipts);
  if (existing.length) return existing.map(normalizeReceipt);

  const legacy = legacyReceipts().map(normalizeReceipt);
  if (!legacy.length) return [];

  await Promise.all(legacy.map((receipt) => putInStore(STORES.receipts, receipt)));
  return legacy;
}

export async function getReceipts() {
  const receipts = await ensureLegacyReceiptsMigrated();
  const allReceipts = receipts.length ? receipts : await getAllFromStore(STORES.receipts);
  return allReceipts.map(normalizeReceipt).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function saveReceipt(receipt) {
  const nextReceipt = normalizeReceipt({
    ...receipt,
    id: receipt.id || createId('receipt'),
    createdAt: receipt.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: receipt.status || 'issued',
  });

  await putInStore(STORES.receipts, nextReceipt);
  return nextReceipt;
}

export async function deleteReceipt(id) {
  await deleteFromStore(STORES.receipts, id);
  return getReceipts();
}

export async function duplicateReceipt(id) {
  const source = await getFromStore(STORES.receipts, id);
  if (!source) return null;

  return saveReceipt({
    ...source,
    id: createId('receipt'),
    receiptNumber: `${source.receiptNumber}-COPIA`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'draft',
  });
}
