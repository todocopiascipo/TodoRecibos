import { BusinessDetails, Footer, ItemsTable, LogoMark, Observations, ReceiptMeta, Totals, normalizeBrand } from './TemplateParts';

export default function MinimalTemplate({ brand, receipt }) {
  const safeBrand = normalizeBrand(brand);

  return (
    <article className="receipt-paper minimal-template" style={{ '--primary': safeBrand.primaryColor, '--secondary': safeBrand.secondaryColor, '--accent': safeBrand.accentColor }}>
      <header className="minimal-header">
        <LogoMark brand={safeBrand} centered />
        <h1>{safeBrand.businessName}</h1>
        <p>Recibo de pago {receipt.number}</p>
      </header>
      <BusinessDetails brand={safeBrand} align="center" />
      <ReceiptMeta receipt={receipt} />
      <ItemsTable receipt={receipt} />
      <Observations receipt={receipt} />
      <Totals receipt={receipt} accentColor={safeBrand.accentColor} />
      <Footer brand={safeBrand} />
    </article>
  );
}
