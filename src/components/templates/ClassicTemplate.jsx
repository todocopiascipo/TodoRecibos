import { BusinessDetails, Footer, ItemsTable, LogoMark, Observations, ReceiptMeta, Totals, normalizeBrand } from './TemplateParts';

export default function ClassicTemplate({ brand, receipt }) {
  const safeBrand = normalizeBrand(brand);

  return (
    <article className="receipt-paper classic-template" style={{ '--primary': safeBrand.primaryColor, '--secondary': safeBrand.secondaryColor, '--accent': safeBrand.accentColor }}>
      <header className="classic-header">
        <div className="flex items-center gap-4">
          <LogoMark brand={safeBrand} />
          <div>
            <p className="receipt-eyebrow">Recibo de pago</p>
            <h1>{safeBrand.businessName}</h1>
          </div>
        </div>
        <BusinessDetails brand={safeBrand} />
      </header>
      <ReceiptMeta receipt={receipt} />
      <ItemsTable receipt={receipt} />
      <Observations receipt={receipt} />
      <Totals receipt={receipt} accentColor={safeBrand.accentColor} />
      <Footer brand={safeBrand} />
    </article>
  );
}
