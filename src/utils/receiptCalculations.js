export function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function calculateLineTotal(item) {
  const unitPrice = Math.max(0, toNumber(item.unitPrice, 0));
  const quantity = Math.max(0, toNumber(item.quantity, 1));
  return unitPrice * quantity;
}

export function calculateSubtotal(items) {
  return items.reduce((total, item) => total + calculateLineTotal(item), 0);
}

export function calculateFinalTotal(subtotal, discount) {
  return Math.max(0, toNumber(subtotal, 0) - Math.max(0, toNumber(discount, 0)));
}

export function calculateDiscountAmount(subtotal, discountPercent) {
  const safeSubtotal = Math.max(0, toNumber(subtotal, 0));
  const safePercent = Math.max(0, toNumber(discountPercent, 0));
  return Math.min(safeSubtotal, (safeSubtotal * safePercent) / 100);
}

export function calculateDiscountPercent(subtotal, discountAmount) {
  const safeSubtotal = Math.max(0, toNumber(subtotal, 0));
  if (!safeSubtotal) return 0;
  return Math.min(100, (Math.max(0, toNumber(discountAmount, 0)) / safeSubtotal) * 100);
}

export function roundMoney(value) {
  return Math.round(toNumber(value, 0));
}

export function formatCurrency(value) {
  const formatted = new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(toNumber(value, 0));

  return `$ ${formatted}`;
}
