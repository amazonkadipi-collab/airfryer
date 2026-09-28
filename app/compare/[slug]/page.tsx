import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getComparisonBySlug } from "@/lib/products";
import { getCatalogImage, getCatalogSource } from "@/lib/product-images";

type Props = { params: Promise<{ slug: string }> };

function value(raw: unknown): string {
  if (raw === null || raw === undefined || raw === "") return "Not listed in source";
  if (typeof raw === "boolean") return raw ? "Yes" : "No";
  return String(raw);
}

function temperature(p: any): string {
  if (p.temperature_min != null && p.temperature_max != null) return `${p.temperature_min}–${p.temperature_max} °F`;
  if (p.temperature_max != null) return `Up to ${p.temperature_max} °F`;
  if (p.temperature_min != null) return `From ${p.temperature_min} °F`;
  return "Not listed in source";
}

function dimensions(raw: unknown): string {
  if (!raw || typeof raw !== "object") return value(raw);
  const d = raw as Record<string, unknown>;
  const inch = d.width_in !== undefined || d.depth_in !== undefined || d.length_in !== undefined || d.height_in !== undefined;
  const w = d.width_in ?? d.width ?? d.width_cm;
  const depth = d.depth_in ?? d.length_in ?? d.depth ?? d.depth_cm ?? d.length_cm;
  const h = d.height_in ?? d.height ?? d.height_cm;
  if (w != null && depth != null && h != null) return inch ? `${w}" W × ${depth}" D × ${h}" H` : `${w} cm W × ${depth} cm D × ${h} cm H`;
  return value(raw);
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  if (!comparison || comparison.status !== "published" || (comparison.quality_score ?? 0) < 80) {
    return { title: "Compare Air Fryers", robots: { index: false, follow: true } };
  }
  return {
    title: `${comparison.a.title} vs ${comparison.b.title}`,
    description: "Side-by-side comparison using source-backed product specifications.",
    robots: { index: true, follow: true },
    alternates: { canonical: `/compare/${comparison.slug}` },
  };
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  if (!comparison || comparison.status !== "published" || (comparison.quality_score ?? 0) < 80) notFound();

  const a = comparison.a;
  const b = comparison.b;
  const rows: [string, string, string][] = [
    ["Brand", value(a.brand_name), value(b.brand_name)],
    ["Model", value(a.model), value(b.model)],
    ["Capacity", a.capacity_quart != null ? `${a.capacity_quart} qt` : value(null), b.capacity_quart != null ? `${b.capacity_quart} qt` : value(null)],
    ["Capacity liters", a.capacity_liters != null ? `${a.capacity_liters} L` : value(null), b.capacity_liters != null ? `${b.capacity_liters} L` : value(null)],
    ["Power", a.wattage != null ? `${a.wattage} W` : value(null), b.wattage != null ? `${b.wattage} W` : value(null)],
    ["Temperature", temperature(a), temperature(b)],
    ["Dimensions", dimensions(a.dimensions), dimensions(b.dimensions)],
    ["Weight", a.weight != null ? `${a.weight} kg` : value(null), b.weight != null ? `${b.weight} kg` : value(null)],
    ["Basket", value(a.basket_type), value(b.basket_type)],
    ["Basket count", value(a.basket_count), value(b.basket_count)],
    ["Controls", a.digital_controls == null ? value(null) : a.digital_controls ? "Digital" : "Manual", b.digital_controls == null ? value(null) : b.digital_controls ? "Digital" : "Manual"],
    ["Dishwasher safe", value(a.dishwasher_safe), value(b.dishwasher_safe)],
    ["Rotisserie", value(a.rotisserie), value(b.rotisserie)],
  ];

  return (
    <main>
      <header className="site-header">
        <div className="shell nav">
          <Link href="/" className="brand"><span className="brand-mark">AF</span><span>Air Fryer</span></Link>
          <nav aria-label="Primary"><Link href="/air-fryers">Browse</Link><Link href="/compare">Compare</Link><Link href="/brands">Brands</Link><Link href="/search">Search</Link></nav>
          <Link href="/search" className="nav-cta">Find an air fryer</Link>
        </div>
      </header>
      <section className="section compare-page">
        <div className="shell">
          <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/compare">Compare</Link><span>/</span><span>{a.title} vs {b.title}</span></div>
          <span className="eyebrow">COMPARISON</span>
          <h1 className="page-title">{a.title} vs {b.title}</h1>
          <p className="page-lead">A side-by-side view of the specifications stored for these two catalog records. Values are not estimated when a source does not list them.</p>

          <div className="compare-products">
            {[a, b].map((p) => {
              const image = getCatalogImage(p.slug, p.image_url);
              const source = getCatalogSource(p.slug);
              return (
                <article className="compare-product" key={p.slug}>
                  <div className="compare-product__image">
                    {image ? <Image src={image} alt={p.title} width={420} height={320} sizes="(max-width: 700px) 100vw, 42vw" /> : <span>AF</span>}
                  </div>
                  <div className="compare-product__body">
                    <span className="eyebrow">{p.brand_name ?? "CATALOG"}</span>
                    <h2>{p.title}</h2>
                    <p>{p.model ? `Model ${p.model}` : "Model not listed in source"}</p>
                    <div className="compare-product__facts">
                      <span>{p.capacity_quart != null ? `${p.capacity_quart} qt` : "Capacity not listed"}</span>
                      <span>{p.wattage != null ? `${p.wattage} W` : "Power not listed"}</span>
                      <span>{temperature(p)}</span>
                    </div>
                    <div className="compare-product__actions">
                      <Link href={`/products/${p.slug}`} className="button">View product</Link>
                      {source && <a href={source} target="_blank" rel="noopener noreferrer" className="button button-outline">View source ↗</a>}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="compare-table" role="table" aria-label="Air fryer comparison">
            <div className="compare-table__head"><b>Specification</b><b>{a.model ?? a.title}</b><b>{b.model ?? b.title}</b></div>
            {rows.map(([label, x, y]) => <div className="compare-table__row" key={label}><b>{label}</b><span>{x}</span><span>{y}</span></div>)}
          </div>

          <div className="compare-trust">
            <span className="eyebrow">SOURCE BASIS</span>
            <p>This comparison uses the stored catalog fields for both models. “Not listed in source” means the source record does not provide that value; it is not a generated estimate.</p>
          </div>

          <div className="action-row">
            <Link href={`/products/${a.slug}`} className="button button-outline">View {a.model ?? "Model A"}</Link>
            <Link href={`/products/${b.slug}`} className="button button-outline">View {b.model ?? "Model B"}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
