import { BusinessDetails, Footer, ItemsTable, LogoMark, Observations, ReceiptMeta, Totals, normalizeBrand } from './TemplateParts';

export default function ModernTemplate({ brand, receipt }) {
  const safeBrand = normalizeBrand(brand);

  return (
    <article className="receipt-paper modern-template" style={{ '--primary': safeBrand.primaryColor, '--secondary': safeBrand.secondaryColor, '--accent': safeBrand.accentColor }}>
      <header className="modern-hero">
        <div className="flex items-center gap-4">
          <LogoMark brand={safeBrand} />
          <div>
            <p>Recibo de pago</p>
            <h1>{receipt.number}</h1>
          </div>
        </div>
        <BusinessDetails brand={safeBrand} />
      </header>
      <section className="modern-body">
        <ReceiptMeta receipt={receipt} />
        <ItemsTable receipt={receipt} />
        <Observations receipt={receipt} />
        <Totals receipt={receipt} accentColor={safeBrand.accentColor} />
        <Footer brand={safeBrand} />
      </section>
    </article>
  );
}
