import { STORES, deleteFromStore, getFromStore, putInStore } from './db';

export const SETTINGS_KEYS = {
  activeTemplateId: 'activeTemplateId',
  currentReceipt: 'currentReceipt',
  dbSeeded: 'dbSeeded',
};

export async function getSetting(key, fallback = null) {
  const record = await getFromStore(STORES.settings, key);
  return record ? record.value : fallback;
}

export async function setSetting(key, value) {
  return putInStore(STORES.settings, {
    key,
    value,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteSetting(key) {
  return deleteFromStore(STORES.settings, key);
}

export async function getCurrentReceipt(fallback = null) {
  const currentReceipt = await getSetting(SETTINGS_KEYS.currentReceipt, null);
  if (currentReceipt) return currentReceipt;

  if (typeof window !== 'undefined') {
    const legacyReceipt = window.localStorage.getItem('receipt.current.v1');
    if (legacyReceipt) {
      try {
        const parsed = JSON.parse(legacyReceipt);
        await saveCurrentReceipt(parsed);
        return parsed;
      } catch {
        return fallback;
      }
    }
  }

  return fallback;
}

export async function saveCurrentReceipt(receipt) {
  return setSetting(SETTINGS_KEYS.currentReceipt, receipt);
}

export async function clearCurrentReceipt() {
  return deleteSetting(SETTINGS_KEYS.currentReceipt);
}
