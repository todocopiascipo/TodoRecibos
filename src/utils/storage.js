import { SETTINGS_KEYS, clearCurrentReceipt, deleteSetting, getCurrentReceipt, getSetting, saveCurrentReceipt, setSetting } from './database/settingsDb';

export const storageKeys = {
  currentReceipt: SETTINGS_KEYS.currentReceipt,
  activeTemplate: SETTINGS_KEYS.activeTemplateId,
};

export async function loadFromStorage(key, fallback) {
  return getSetting(key, fallback);
}

export async function saveToStorage(key, value) {
  return setSetting(key, value);
}

export async function removeFromStorage(key) {
  return deleteSetting(key);
}

export { clearCurrentReceipt, getCurrentReceipt, saveCurrentReceipt };
