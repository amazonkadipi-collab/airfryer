import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getProductBySlug, getSimilarProducts } from "@/lib/products";
import { getCatalogImage } from "@/lib/product-images";

type Props = { params: Promise<{ slug: string }> };

function value(v: unknown) {
  if (v === null || v === undefined || v === "") return "Not verified";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  return String(v);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.indexable) {
    return { title: "Product", robots: { index: false, follow: true } };
  }

  const specs = [
    product.capacity_quart ? `${product.capacity_quart} qt` : null,
    product.wattage ? `${product.wattage}W` : null,
    product.basket_type,
  ].filter(Boolean).join(", ");

  return {
    title: `${product.title} — Specs & Retailers`,
    description: `${product.title}: ${specs || "structured specifications"}. Compare product details and retailer options.`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.title,
      description: product.description ?? `Structured specifications for ${product.title}.`,
      type: "website",
      images: catalogImage ? [catalogImage] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [similar] = await Promise.all([getSimilarProducts(product.id, 4)]);
  const catalogImage = getCatalogImage(product.slug, product.image_url);
  const fields: Array<[string, unknown]> = [
    ["Capacity", product.capacity_quart ? `${product.capacity_quart} qt` : null],
    ["Capacity liters", product.capacity_liters ? `${product.capacity_liters} L` : null],
    ["Power", product.wattage ? `${product.wattage} W` : null],
    ["Basket", product.basket_type],
    ["Basket count", product.basket_count],
    ["Controls", product.digital_controls === null ? null : product.digital_controls ? "Digital" : "Manual"],
    ["Dishwasher safe", product.dishwasher_safe],
    ["Rotisserie", product.rotisserie],
    ["Temperature", product.temperature_min != null && product.temperature_max != null ? `${product.temperature_min}–${product.temperature_max}` : null],
    ["Dimensions", product.dimensions ? JSON.stringify(product.dimensions) : null],
    ["Weight", product.weight ? String(product.weight) : null],
  ];

  const identifiers = product.identifiers ?? [];
  const offers = product.offers ?? [];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    brand: product.brand_name ? { "@type": "Brand", name: product.brand_name } : undefined,
    model: product.model ?? undefined,
    image: catalogImage ? [catalogImage] : undefined,
    sku: product.model ?? undefined,
    ...(identifiers.find((i) => i.identifier_type.toUpperCase() === "UPC")?.identifier_value
      ? { gtin12: identifiers.find((i) => i.identifier_type.toUpperCase() === "UPC")?.identifier_value }
      : {}),
    ...(identifiers.find((i) => i.identifier_type.toUpperCase() === "EAN")?.identifier_value
      ? { gtin13: identifiers.find((i) => i.identifier_type.toUpperCase() === "EAN")?.identifier_value }
      : {}),
    ...(offers.some((o) => o.price != null) ? {
      offers: offers.filter((o) => o.price != null).map((o) => ({
        "@type": "Offer",
        price: o.price,
        priceCurrency: o.currency ?? "USD",
        availability: "https://schema.org/InStock",
        url: o.affiliate_url ?? undefined,
      })),
    } : {}),
  };

  return (
    <main>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="product-hero">
        <div className="shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><Link href="/air-fryers">Air Fryers</Link>
            {product.brand_name && <><span>/</span><span>{product.brand_name}</span></>}
            <span>/</span><span>{product.model ?? product.title}</span>
          </nav>

          <div className="product-grid">
            <div className="product-visual">
              <span className="eyebrow">PRODUCT IMAGE</span>
              {product.image_url ? (
                <div className="product-image">
                  <Image src={product.image_url} alt={product.title} width={800} height={800} priority sizes="(max-width: 767px) 100vw, 50vw" />
                </div>
              ) : (
                <div className="product-placeholder" aria-label="Product image not available">
                  <span>AF</span>
                </div>
              )}
            </div>

            <div className="product-copy">
              <span className="eyebrow">{product.brand_name ?? "BRAND UNVERIFIED"}</span>
              <h1>{product.title}</h1>
              {product.model && <p className="product-hero__model">Model: {product.model}</p>}
              <p>{product.description ?? "Structured product information from the current catalog record. Missing values are not inferred or generated."}</p>

              <dl className="quick-specs">
                {[
                  ["Capacity", product.capacity_quart ? `${product.capacity_quart} qt` : null],
                  ["Basket", product.basket_type],
                  ["Power", product.wattage ? `${product.wattage} W` : null],
                  ["Controls", product.digital_controls === null ? null : product.digital_controls ? "Digital" : "Manual"],
                ].map(([label, v]) => v ? (
                  <div className="quick-specs__item" key={label}>
                    <dt className="quick-specs__label">{label}</dt><dd className="quick-specs__value">{v}</dd>
                  </div>
                ) : null)}
              </dl>

              {offers.length > 0 ? (
                <a href="#where-to-buy" className="cta">Check retailers</a>
              ) : (
                <span className="cta cta--muted">Retailer data coming soon</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head"><div><span className="eyebrow">SPECIFICATIONS</span><h2>Key specifications</h2></div></div>
          <div className="spec-table">
            {fields.map(([label, v]) => <div key={label}><b>{label}</b><span>{value(v)}</span></div>)}
          </div>
        </div>
      </section>

      {identifiers.length > 0 && (
        <section className="section">
          <div className="shell">
            <div className="section-head"><div><span className="eyebrow">IDENTITY</span><h2>Verified identifiers</h2></div></div>
            <div className="identifiers">
              {identifiers.map((item) => (
                <span className="identifiers__item" key={`${item.identifier_type}-${item.identifier_value}`}>
                  <span className="identifiers__type">{item.identifier_type}</span>{item.identifier_value}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {offers.length > 0 && (
        <section className="section" id="where-to-buy">
          <div className="shell">
            <div className="section-head"><div><span className="eyebrow">RETAILERS</span><h2>Where to buy</h2></div></div>
            <ul className="retailer-list">
              {offers.map((offer) => (
                <li key={`${offer.retailer_slug}-${offer.retailer_name}`}>
                  <a href={offer.affiliate_url ?? "#"} className="retailer-link" rel="nofollow sponsored">
                    <span className="retailer-link__name">{offer.retailer_name}</span>
                    {offer.price != null && <span className="retailer-link__price">{offer.currency ?? "USD"} {Number(offer.price).toFixed(2)}</span>}
                    <span className="retailer-link__cta">Check price →</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section className="section">
          <div className="shell">
            <div className="section-head"><div><span className="eyebrow">ALTERNATIVES</span><h2>Similar air fryers</h2></div></div>
            <div className="product-grid">
              {similar.map((item) => <ProductCard key={item.slug} product={item} />)}
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
