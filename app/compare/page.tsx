import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getFeaturedProducts, getProductBySlug } from "@/lib/products";

export const metadata: Metadata = {
  title: "Compare Air Fryers",
  description: "Compare air fryer models side by side using structured product data.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/compare" }, openGraph: { url: "/compare", type: "website" },
};

function v(value: unknown) {
  if (value === null || value === undefined || value === "") return "Not verified";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ a?: string; b?: string }> }) {
  const { a, b } = await searchParams;
  const [left, right, products] = await Promise.all([a ? getProductBySlug(a) : null, b ? getProductBySlug(b) : null, getFeaturedProducts(12)]);
  const rows: Array<[string, unknown, unknown]> = [
    ["Brand", left?.brand_name, right?.brand_name],
    ["Model", left?.model, right?.model],
    ["Capacity", left?.capacity_quart ? `${left.capacity_quart} qt` : null, right?.capacity_quart ? `${right.capacity_quart} qt` : null],
    ["Capacity liters", left?.capacity_liters ? `${left.capacity_liters} L` : null, right?.capacity_liters ? `${right.capacity_liters} L` : null],
    ["Basket", left?.basket_type, right?.basket_type],
    ["Basket count", left?.basket_count, right?.basket_count],
    ["Power", left?.wattage ? `${left.wattage} W` : null, right?.wattage ? `${right.wattage} W` : null],
    ["Controls", left?.digital_controls == null ? null : left.digital_controls ? "Digital" : "Manual", right?.digital_controls == null ? null : right.digital_controls ? "Digital" : "Manual"],
    ["Dishwasher safe", left?.dishwasher_safe, right?.dishwasher_safe],
    ["Rotisserie", left?.rotisserie, right?.rotisserie],
    ["Quality score", left?.quality_score, right?.quality_score],
  ];

  return <main>
    <SiteHeader />
    <section className="section"><div className="shell">
      <span className="eyebrow">COMPARE · SIDE BY SIDE</span>
      <h1 className="page-title">Compare two air fryers without the guesswork.</h1>
      <p className="page-lead">Only fields supported by the catalog are compared. Missing information stays clearly marked instead of being guessed.</p>
      {!left || !right ? (
        <div className="compare-select"><div><span>MODEL A</span><strong>{left?.title ?? "Choose a product"}</strong><div className="compare-options">{products.map(p => <Link key={p.slug} href={"/compare?a=" + encodeURIComponent(p.slug) + (b ? "&b=" + encodeURIComponent(b) : "")}>{p.model ?? p.title}</Link>)}</div></div><b>VS</b><div><span>MODEL B</span><strong>{right?.title ?? "Choose a product"}</strong><div className="compare-options">{products.map(p => <Link key={p.slug} href={"/compare?" + (a ? "a=" + encodeURIComponent(a) + "&" : "") + "b=" + encodeURIComponent(p.slug)}>{p.model ?? p.title}</Link>)}</div></div></div>
      ) : (
        <>
          <div className="compare-select"><div><span>MODEL A</span><strong>{left.title}</strong><small>{left.brand_name} · {left.model ?? "Model not verified"}</small></div><b>VS</b><div><span>MODEL B</span><strong>{right.title}</strong><small>{right.brand_name} · {right.model ?? "Model not verified"}</small></div></div>
          <div className="compare-table" role="table" aria-label="Air fryer comparison">
            <div className="compare-table__head"><b>Specification</b><b>{left.model ?? left.title}</b><b>{right.model ?? right.title}</b></div>
            {rows.map(([label, x, y], i) => <div className="compare-table__row" key={`${label}-${i}`}><b>{label}</b><span>{v(x)}</span><span>{v(y)}</span></div>)}
          </div>
          <div className="action-row"><Link href={`/products/${left.slug}`} className="button">View {left.model ?? "model A"}</Link><Link href={`/products/${right.slug}`} className="button">View {right.model ?? "model B"}</Link></div>
        </>
      )}
      <div className="empty-panel compare-help"><span className="eyebrow">HOW TO USE IT</span><h2>Choose two models, then compare.</h2><p>For direct comparisons, use <code>/compare?a=PRODUCT-SLUG&amp;b=PRODUCT-SLUG</code>. The comparison page never invents price, ratings, or features.</p><Link href="/search" className="button">Find products</Link></div>
    </div></section>
    <SiteFooter />
  </main>;
}
