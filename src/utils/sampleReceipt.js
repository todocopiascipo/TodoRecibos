import { calculateDiscountAmount, calculateDiscountPercent, calculateFinalTotal, calculateLineTotal, calculateSubtotal, roundMoney } from './receiptCalculations';
import { createId } from './id';

const today = new Date();
const isoDate = today.toISOString().slice(0, 10);

export function createReceiptItem(overrides = {}) {
  return {
    id: createId('item'),
    detail: '',
    unitPrice: 0,
    quantity: 1,
    ...overrides,
  };
}

export function createEmptyReceipt() {
  return {
    receiptNumber: 'REC-000001',
    date: isoDate,
    receivedFrom: '',
    paymentMethod: 'Efectivo',
    observations: '',
    items: [createReceiptItem()],
    discountAmount: 0,
    discountPercent: 0,
  };
}

export function createSampleReceiptForm() {
  return {
    receiptNumber: 'REC-000001',
    date: isoDate,
    receivedFrom: 'Juan Perez',
    paymentMethod: 'Transferencia',
    observations: 'Pago correspondiente a servicios de mostrador.',
    items: [
      createReceiptItem({
        detail: 'Fotocopias B&N',
        unitPrice: 200,
        quantity: 10,
      }),
      createReceiptItem({
        detail: 'Anillado',
        unitPrice: 2000,
        quantity: 1,
      }),
    ],
    discountAmount: 0,
    discountPercent: 0,
  };
}

export function normalizeReceiptForm(receipt) {
  const safeReceipt = {
    ...createEmptyReceipt(),
    ...receipt,
    items: receipt?.items?.length ? receipt.items : [createReceiptItem()],
  };
  const items = safeReceipt.items.map((item) => ({
    ...createReceiptItem(),
    ...item,
    detail: item.detail || '',
    unitPrice: item.unitPrice === '' ? 0 : item.unitPrice,
    quantity: item.quantity === '' ? 1 : item.quantity,
  }));

  return {
    ...safeReceipt,
    items,
    discountAmount: safeReceipt.discountAmount ?? safeReceipt.discount ?? 0,
    discountPercent: safeReceipt.discountPercent ?? 0,
  };
}

export function buildPreviewReceipt(receiptForm) {
  const receipt = normalizeReceiptForm(receiptForm);
  const subtotal = calculateSubtotal(receipt.items);
  const discount = Math.min(subtotal, Math.max(0, Number(receipt.discountAmount) || 0));
  const total = calculateFinalTotal(subtotal, discount);

  return {
    number: receipt.receiptNumber || 'REC-000001',
    payer: receipt.receivedFrom || 'Sin completar',
    date: receipt.date || isoDate,
    paymentMethod: receipt.paymentMethod || 'Efectivo',
    observations: receipt.observations || '',
    items: receipt.items.map((item) => ({
      id: item.id,
      description: item.detail || 'Detalle del item',
      unitPrice: Number(item.unitPrice) || 0,
      quantity: item.quantity === '' ? 1 : Number(item.quantity) || 1,
      total: calculateLineTotal(item),
    })),
    subtotal: roundMoney(subtotal),
    discount: roundMoney(discount),
    discountAmount: roundMoney(discount),
    discountPercent: calculateDiscountPercent(subtotal, discount),
    total: roundMoney(total),
    hasDiscountWarning: (Number(receipt.discountAmount) || 0) > subtotal,
  };
}

export function applyDiscountPercent(receipt, discountPercent) {
  const subtotal = calculateSubtotal(receipt.items || []);
  const discountAmount = calculateDiscountAmount(subtotal, discountPercent);

  return {
    ...receipt,
    discountPercent,
    discountAmount: roundMoney(discountAmount),
  };
}

export function applyDiscountAmount(receipt, discountAmount) {
  const subtotal = calculateSubtotal(receipt.items || []);
  const discountPercent = calculateDiscountPercent(subtotal, discountAmount);

  return {
    ...receipt,
    discountAmount,
    discountPercent: Number(discountPercent.toFixed(2)),
  };
}

export const sampleReceipt = buildPreviewReceipt(createSampleReceiptForm());
