import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.indexable) return { title: "Product", robots: { index: false, follow: true } };
  return {
    title: product.title,
    description: product.description ?? `Structured product information for ${product.title}.`,
    alternates: { canonical: `/products/${product.slug}` },
    robots: { index: true, follow: true },
  };
}

function value(value: unknown) {
  if (value === null || value === undefined || value === "") return "Not verified";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const fields: Array<[string, unknown]> = [
    ["Capacity", product.capacity_quart ? `${product.capacity_quart} qt` : null],
    ["Power", product.wattage ? `${product.wattage} W` : null],
    ["Basket", product.basket_type],
    ["Basket count", product.basket_count],
    ["Controls", product.digital_controls === null ? null : product.digital_controls ? "Digital" : "Manual"],
    ["Dishwasher safe", product.dishwasher_safe],
    ["Rotisserie", product.rotisserie],
    ["Temperature", product.temperature_min && product.temperature_max ? `${product.temperature_min}–${product.temperature_max}` : null],
    ["Dimensions", product.dimensions ? JSON.stringify(product.dimensions) : null],
    ["Weight", product.weight ? String(product.weight) : null],
  ];

  return <main>
    <header className="site-header"><div className="shell nav">
      <Link href="/" className="brand"><span className="brand-mark">AF</span><span>Air Fryer</span></Link>
      <nav><Link href="/air-fryers">Browse</Link><Link href="/brands">Brands</Link><Link href="/search">Search</Link></nav>
      <Link href="/compare" className="nav-cta">Compare</Link>
    </div></header>
    <section className="product-hero"><div className="shell">
      <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/air-fryers">Air Fryers</Link><span>/</span><span>{product.title}</span></div>
      <div className="product-grid">
        <div className="product-visual"><span className="eyebrow">PRODUCT RECORD</span><div className="product-placeholder"><span>AF</span><small>Image shown only when a licensed source is available.</small></div></div>
        <div className="product-copy"><span className="eyebrow">{product.brand_name ?? "BRAND UNVERIFIED"}</span><h1>{product.title}</h1>
          <p>{product.description ?? "Structured product information sourced from the verified catalog."}</p>
          <div className="identifier-box"><b>MODEL</b><span>{value(product.model)}</span><small>Identifiers are displayed only when verified in the catalog.</small></div>
          <div className="action-row"><Link href="/search" className="button dark">Find another model</Link><Link href="/compare" className="button light">Compare products</Link></div>
        </div>
      </div>
    </div></section>
    <section className="section"><div className="shell">
      <div className="section-head"><div><span className="eyebrow">PRODUCT DETAILS</span><h2>Structured information</h2></div></div>
      <div className="spec-table">{fields.map(([label, v]) => <div key={label}><b>{label}</b><span>{value(v)}</span></div>)}</div>
      <p className="narrow-copy">Specifications are presented from stored product records. Missing values are not inferred or generated.</p>
    </div></section>
  </main>;
}