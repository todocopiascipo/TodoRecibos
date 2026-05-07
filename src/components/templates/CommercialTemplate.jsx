import { BusinessDetails, Footer, ItemsTable, LogoMark, Observations, ReceiptMeta, Totals, normalizeBrand } from './TemplateParts';

export default function CommercialTemplate({ brand, receipt }) {
  const safeBrand = normalizeBrand(brand);

  return (
    <article className="receipt-paper commercial-template" style={{ '--primary': safeBrand.primaryColor, '--secondary': safeBrand.secondaryColor, '--accent': safeBrand.accentColor }}>
      <header className="commercial-header">
        <div className="commercial-brand">
          <LogoMark brand={safeBrand} />
          <div>
            <p>Comprobante de pago</p>
            <h1>{safeBrand.businessName}</h1>
          </div>
        </div>
        <div className="commercial-number">{receipt.number}</div>
      </header>
      <BusinessDetails brand={safeBrand} align="left" />
      <ReceiptMeta receipt={receipt} />
      <ItemsTable receipt={receipt} />
      <Observations receipt={receipt} />
      <Totals receipt={receipt} accentColor={safeBrand.accentColor} />
      <Footer brand={safeBrand} />
    </article>
  );
}
