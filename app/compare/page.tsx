import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getCatalogImage, getCatalogSource } from "@/lib/product-images";
import { getFeaturedProducts, getProductBySlug, getSimilarProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Compare Air Fryers",
  description: "Compare air fryer models side by side using source-backed product specifications.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/compare" },
  openGraph: { url: "/compare", type: "website" },
};

type Product = NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>;

function value(raw: unknown): string {
  if (raw === null || raw === undefined || raw === "") return "Not listed in source";
  if (typeof raw === "boolean") return raw ? "Yes" : "No";
  return String(raw);
}

function temperature(p: Product): string {
  if (p.temperature_min != null && p.temperature_max != null) return `${p.temperature_min}–${p.temperature_max} °F`;
  if (p.temperature_max != null) return `Up to ${p.temperature_max} °F`;
  if (p.temperature_min != null) return `From ${p.temperature_min} °F`;
  return "Not listed in source";
}

function dimensions(raw: unknown): string {
  if (!raw || typeof raw !== "object") return value(raw);
  const d = raw as Record<string, unknown>;
  const hasInches = d.width_in !== undefined || d.depth_in !== undefined || d.length_in !== undefined || d.height_in !== undefined;
  const width = d.width_in ?? d.width ?? d.width_cm;
  const depth = d.depth_in ?? d.length_in ?? d.depth ?? d.depth_cm ?? d.length_cm;
  const height = d.height_in ?? d.height ?? d.height_cm;
  if (width != null && depth != null && height != null) {
    return hasInches
      ? `${width}" W × ${depth}" D × ${height}" H`
      : `${width} cm W × ${depth} cm D × ${height} cm H`;
  }
  return value(raw);
}

function completeness(p: Product): number {
  const fields = [
    p.brand_name, p.model, p.description, p.capacity_quart, p.capacity_liters, p.wattage,
    p.basket_type, p.basket_count, p.dishwasher_safe, p.rotisserie, p.digital_controls,
    p.temperature_min, p.temperature_max, p.dimensions, p.weight, p.identifiers.length,
  ];
  return Math.round(fields.filter((item) => item !== null && item !== undefined && item !== "").length / fields.length * 100);
}

function optionLabel(p: { brand_name: string | null; model: string | null; title: string }) {
  return `${p.brand_name ?? ""}${p.model ? ` · ${p.model}` : ` · ${p.title}`}`;
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const { a, b } = await searchParams;
  const products = await getFeaturedProducts(50);

  const left = a ? await getProductBySlug(a) : null;
  let suggestedSlug: string | null = null;
  if (left && !b) {
    const similar = await getSimilarProducts(left.id, 1);
    suggestedSlug = similar[0]?.slug ?? products.find((p) => p.slug !== left.slug)?.slug ?? null;
  }
  const rightSlug = b ?? suggestedSlug;
  const right = rightSlug ? await getProductBySlug(rightSlug) : null;
  const comparison = left && right && left.slug !== right.slug ? { a: left, b: right } : null;

  const rows: Array<[string, string, string]> = comparison
    ? [
        ["Brand", value(comparison.a.brand_name), value(comparison.b.brand_name)],
        ["Model", value(comparison.a.model), value(comparison.b.model)],
        ["Capacity", comparison.a.capacity_quart != null ? `${comparison.a.capacity_quart} qt` : value(null), comparison.b.capacity_quart != null ? `${comparison.b.capacity_quart} qt` : value(null)],
        ["Capacity liters", comparison.a.capacity_liters != null ? `${comparison.a.capacity_liters} L` : value(null), comparison.b.capacity_liters != null ? `${comparison.b.capacity_liters} L` : value(null)],
        ["Power", comparison.a.wattage != null ? `${comparison.a.wattage} W` : value(null), comparison.b.wattage != null ? `${comparison.b.wattage} W` : value(null)],
        ["Temperature", temperature(comparison.a), temperature(comparison.b)],
        ["Dimensions", dimensions(comparison.a.dimensions), dimensions(comparison.b.dimensions)],
        ["Weight", comparison.a.weight != null ? `${comparison.a.weight} kg` : value(null), comparison.b.weight != null ? `${comparison.b.weight} kg` : value(null)],
        ["Basket", value(comparison.a.basket_type), value(comparison.b.basket_type)],
        ["Basket count", value(comparison.a.basket_count), value(comparison.b.basket_count)],
        ["Controls", comparison.a.digital_controls == null ? value(null) : comparison.a.digital_controls ? "Digital" : "Manual", comparison.b.digital_controls == null ? value(null) : comparison.b.digital_controls ? "Digital" : "Manual"],
        ["Dishwasher safe", value(comparison.a.dishwasher_safe), value(comparison.b.dishwasher_safe)],
        ["Rotisserie", value(comparison.a.rotisserie), value(comparison.b.rotisserie)],
        ["Verified IDs", String(comparison.a.identifiers.length), String(comparison.b.identifiers.length)],
        ["Data completeness", `${completeness(comparison.a)}%`, `${completeness(comparison.b)}%`],
      ]
    : [];

  return (
    <main>
      <SiteHeader />
      <section className="section compare-page" data-page="real-comparison">
        <div className="shell">
          <span className="eyebrow">COMPARE · SIDE BY SIDE</span>
          <h1 className="page-title">Compare air fryers using real catalog data.</h1>
          <p className="page-lead">
            Pick two models and compare the specifications actually stored for each product. Nothing is invented when a source does not list a field.
          </p>

          <form className="compare-picker" action="/compare" method="get">
            <label>
              <span>MODEL A</span>
              <select name="a" defaultValue={left?.slug ?? ""}>
                <option value="">Choose a model</option>
                {products.map((p) => (
                  <option key={p.slug} value={p.slug}>{optionLabel(p)}</option>
                ))}
              </select>
            </label>
            <div className="compare-picker__vs" aria-hidden="true">VS</div>
            <label>
              <span>MODEL B</span>
              <select name="b" defaultValue={b ?? suggestedSlug ?? ""}>
                <option value="">Choose a model</option>
                {products.map((p) => (
                  <option key={p.slug} value={p.slug}>{optionLabel(p)}</option>
                ))}
              </select>
            </label>
            <button className="button" type="submit">Compare models</button>
          </form>

          {left && !b && suggestedSlug && (
            <div className="compare-note">
              <strong>Showing a suggested second model.</strong>
              <span>Choose Model B above to change the comparison, then the URL becomes a shareable two-model comparison.</span>
            </div>
          )}

          {comparison ? (
            <>
              <div className="compare-products">
                {[comparison.a, comparison.b].map((p) => {
                  const image = getCatalogImage(p.slug, p.image_url);
                  const source = getCatalogSource(p.slug);
                  return (
                    <article className="compare-product" key={p.slug}>
                      <div className="compare-product__image">
                        {image ? (
                          <Image src={image} alt={p.title} width={420} height={320} sizes="(max-width: 700px) 100vw, 42vw" />
                        ) : (
                          <span>AF</span>
                        )}
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
                <div className="compare-table__head">
                  <b>Specification</b>
                  <b>{comparison.a.model ?? comparison.a.title}</b>
                  <b>{comparison.b.model ?? comparison.b.title}</b>
                </div>
                {rows.map(([label, x, y]) => (
                  <div className="compare-table__row" key={label}>
                    <b>{label}</b>
                    <span>{x}</span>
                    <span>{y}</span>
                  </div>
                ))}
              </div>

              <div className="compare-trust">
                <span className="eyebrow">SOURCE BASIS</span>
                <p>Specifications above come from the catalog records for these two models. A field marked “Not listed in source” means the cited source did not provide that value; it is not estimated.</p>
              </div>

              <div className="action-row">
                <Link href={`/compare?a=${encodeURIComponent(comparison.a.slug)}`} className="button button-outline">Keep {comparison.a.model ?? "Model A"}</Link>
                <Link href={`/compare?a=${encodeURIComponent(comparison.b.slug)}&b=${encodeURIComponent(comparison.a.slug)}`} className="button button-outline">Swap models</Link>
              </div>
            </>
          ) : (
            <div className="empty-panel compare-help">
              <span className="eyebrow">START HERE</span>
              <h2>Select two real products to compare.</h2>
              <p>The catalog currently contains source-backed product records with model, capacity, power, temperature, dimensions, weight and other specifications where the sources publish them.</p>
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
