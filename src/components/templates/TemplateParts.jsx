import { defaultBrand } from '../../data/defaultBrand';
import { formatCurrency } from '../../utils/receiptCalculations';

export function normalizeBrand(brand) {
  return {
    ...defaultBrand,
    ...brand,
    businessName: brand.businessName?.trim() || defaultBrand.businessName,
    primaryColor: brand.primaryColor || defaultBrand.primaryColor,
    secondaryColor: brand.secondaryColor || defaultBrand.secondaryColor,
    accentColor: brand.accentColor || defaultBrand.accentColor,
  };
}

export function LogoMark({ brand, centered = false }) {
  const safeBrand = normalizeBrand(brand);

  return (
    <div className={`logo-mark ${centered ? 'mx-auto' : ''}`}>
      {safeBrand.logo ? (
        <img src={safeBrand.logo} alt="" />
      ) : (
        <span>{safeBrand.businessName.charAt(0)}</span>
      )}
    </div>
  );
}

export function BusinessDetails({ brand, align = 'right' }) {
  const safeBrand = normalizeBrand(brand);
  const details = [safeBrand.cuit && `CUIT ${safeBrand.cuit}`, safeBrand.address, safeBrand.phone, safeBrand.email, safeBrand.instagram].filter(Boolean);

  return (
    <div className={`business-details text-${align}`}>
      <h3>{safeBrand.businessName}</h3>
      {details.map((detail) => (
        <p key={detail}>{detail}</p>
      ))}
    </div>
  );
}

export function ReceiptMeta({ receipt }) {
  return (
    <div className="receipt-meta">
      <div>
        <span>Recibo</span>
        <strong>{receipt.number}</strong>
      </div>
      <div>
        <span>Fecha</span>
        <strong>{receipt.date}</strong>
      </div>
      <div>
        <span>Medio de pago</span>
        <strong>{receipt.paymentMethod}</strong>
      </div>
      <div>
        <span>Recibi de</span>
        <strong>{receipt.payer}</strong>
      </div>
    </div>
  );
}

export function ItemsTable({ receipt }) {
  return (
    <table className="receipt-table">
      <thead>
        <tr>
          <th>Detalle</th>
          <th>Precio</th>
          <th>Cant.</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {receipt.items.map((item, index) => (
          <tr key={item.id || `${item.description}-${index}`}>
            <td>{item.description}</td>
            <td>{formatCurrency(item.unitPrice)}</td>
            <td>{item.quantity}</td>
            <td>{formatCurrency(item.total)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Observations({ receipt }) {
  if (!receipt.observations) return null;

  return (
    <div className="receipt-observations">
      <span>Observaciones</span>
      <p>{receipt.observations}</p>
    </div>
  );
}

export function Totals({ receipt, accentColor }) {
  return (
    <div className="totals">
      <div>
        <span>Subtotal</span>
        <strong>{formatCurrency(receipt.subtotal)}</strong>
      </div>
      <div>
        <span>Descuento</span>
        <strong>{formatCurrency(receipt.discount)}</strong>
      </div>
      <div className="total-row" style={{ borderColor: accentColor }}>
        <span>Total</span>
        <strong>{formatCurrency(receipt.total)}</strong>
      </div>
    </div>
  );
}

export function Footer({ brand }) {
  const safeBrand = normalizeBrand(brand);

  return (
    <footer className="receipt-footer">
      <p>{safeBrand.footerNote || defaultBrand.footerNote}</p>
      <div className="signature-line">
        <span>Firma y aclaracion</span>
      </div>
    </footer>
  );
}
