import { defaultBrand, defaultPrintSettings, defaultTemplateId } from '../../data/defaultBrand';
import { createId } from '../id';
import { STORES, deleteFromStore, getAllFromStore, getFromStore, putInStore } from './db';
import { SETTINGS_KEYS, getSetting, setSetting } from './settingsDb';

const templateNames = {
  classic: 'Clasica Profesional',
  modern: 'Moderna con Banda Superior',
  minimal: 'Minimalista Premium',
  commercial: 'Comercial Colorida',
};

let seedPromise = null;

function safeParse(value, fallback) {
  if (!value) return fallback;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function now() {
  return new Date().toISOString();
}

export function normalizePrintSettings(settings = {}) {
  return {
    size: settings.size || settings.paperSize?.toLowerCase?.() || defaultPrintSettings.size,
    margins: settings.margins || settings.margin || defaultPrintSettings.margins,
    mode: settings.mode === 'original-copy' ? 'copy' : settings.mode || defaultPrintSettings.mode,
  };
}

export function normalizeTemplate(template = {}) {
  const type = template.type || defaultTemplateId;
  const timestamp = now();

  return {
    id: template.id || createId('template'),
    name: template.name || `Template ${templateNames[type] || templateNames[defaultTemplateId]}`,
    type,
    createdAt: template.createdAt || timestamp,
    updatedAt: template.updatedAt || timestamp,
    brand: {
      ...defaultBrand,
      ...template.brand,
    },
    printSettings: normalizePrintSettings(template.printSettings),
  };
}

export function createTemplate(overrides = {}) {
  return normalizeTemplate(overrides);
}

function legacyTemplates() {
  if (typeof window === 'undefined') return [];

  const templates = safeParse(window.localStorage.getItem('receipt.templates.v1'), []);
  return Array.isArray(templates) ? templates.map(normalizeTemplate) : [];
}

function seedTemplates() {
  const baseTemplates = ['classic', 'modern', 'minimal', 'commercial'].map((type) =>
    createTemplate({
      type,
      name: templateNames[type],
      brand: defaultBrand,
      printSettings: defaultPrintSettings,
    }),
  );

  if (typeof window === 'undefined') return baseTemplates;

  const legacyStoredTemplates = legacyTemplates();
  if (legacyStoredTemplates.length) return legacyStoredTemplates;

  const legacyBrand = safeParse(window.localStorage.getItem('receipt.brand.v1'), null);
  const legacyPrint = safeParse(window.localStorage.getItem('receipt.print.v1'), null);
  const legacyType = safeParse(window.localStorage.getItem('receipt.template.v1'), null);

  if (!legacyBrand && !legacyPrint && !legacyType) return baseTemplates;

  return [
    createTemplate({
      name: legacyBrand?.businessName ? `Template ${legacyBrand.businessName}` : 'Template migrado',
      type: legacyType || defaultTemplateId,
      brand: legacyBrand || defaultBrand,
      printSettings: legacyPrint || defaultPrintSettings,
    }),
    ...baseTemplates,
  ];
}

export async function ensureTemplatesSeeded() {
  if (seedPromise) return seedPromise;

  const templates = await getAllFromStore(STORES.templates);
  if (templates.length) return templates.map(normalizeTemplate);

  seedPromise = (async () => {
    const seeded = seedTemplates();
    await Promise.all(seeded.map((template) => putInStore(STORES.templates, template)));
    await setSetting(SETTINGS_KEYS.activeTemplateId, seeded[0]?.id || null);
    await setSetting(SETTINGS_KEYS.dbSeeded, true);
    return seeded;
  })();

  return seedPromise;
}

export async function getTemplates() {
  const templates = await ensureTemplatesSeeded();
  return templates.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export async function saveTemplate(template) {
  const nextTemplate = normalizeTemplate({
    ...template,
    id: template.id || createId('template'),
    createdAt: template.createdAt || now(),
    updatedAt: now(),
  });

  await putInStore(STORES.templates, nextTemplate);
  await setActiveTemplate(nextTemplate.id);
  return nextTemplate;
}

export async function updateTemplate(id, template) {
  const existing = await getFromStore(STORES.templates, id);
  const updated = normalizeTemplate({
    ...existing,
    ...template,
    id,
    createdAt: template.createdAt || existing?.createdAt || now(),
    updatedAt: now(),
  });

  await putInStore(STORES.templates, updated);
  return updated;
}

export async function deleteTemplate(id) {
  const activeId = await getSetting(SETTINGS_KEYS.activeTemplateId, null);
  await deleteFromStore(STORES.templates, id);
  const templates = await getTemplates();

  if (activeId === id && templates.length) {
    await setActiveTemplate(templates[0].id);
  }

  return templates;
}

export async function duplicateTemplate(id) {
  const source = await getFromStore(STORES.templates, id);
  if (!source) return null;

  return saveTemplate({
    ...source,
    id: createId('template'),
    name: `${source.name} copia`,
    createdAt: now(),
    updatedAt: now(),
  });
}

export async function getActiveTemplate() {
  const templates = await getTemplates();
  if (!templates.length) return null;
  const activeId = await getSetting(SETTINGS_KEYS.activeTemplateId, null);
  return templates.find((template) => template.id === activeId) || templates[0];
}

export async function setActiveTemplate(id) {
  return setSetting(SETTINGS_KEYS.activeTemplateId, id);
}
