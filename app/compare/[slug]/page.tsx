import Link from "next/link";
import { notFound } from "next/navigation";
import { getComparisonBySlug } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  if (!comparison || comparison.status !== "published" || (comparison.quality_score ?? 0) < 80) return { title: "Compare Air Fryers", robots: { index: false, follow: true } };
  return { title: comparison.a.title + " vs " + comparison.b.title, description: "Structured comparison using verified product data.", robots: { index: true, follow: true }, alternates: { canonical: "/compare/" + comparison.slug } };
}
export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params; const comparison = await getComparisonBySlug(slug); if (!comparison) notFound();
  const a=comparison.a, b=comparison.b;
  const fields:[string,unknown,unknown][]=[["Capacity",a.capacity_quart&&a.capacity_quart+" qt",b.capacity_quart&&b.capacity_quart+" qt"],["Power",a.wattage&&a.wattage+" W",b.wattage&&b.wattage+" W"],["Basket",a.basket_type,b.basket_type],["Basket count",a.basket_count,b.basket_count],["Controls",a.digital_controls===null?null:a.digital_controls?"Digital":"Manual",b.digital_controls===null?null:b.digital_controls?"Digital":"Manual"],["Dishwasher safe",a.dishwasher_safe,b.dishwasher_safe],["Rotisserie",a.rotisserie,b.rotisserie],["Temperature",a.temperature_min&&a.temperature_max?a.temperature_min+"–"+a.temperature_max:null,b.temperature_min&&b.temperature_max?b.temperature_min+"–"+b.temperature_max:null]];
  const v=(x:unknown)=>x===null||x===undefined||x===""?"Not verified":typeof x==="boolean"?(x?"Yes":"No"):String(x);
  return <main><header className="site-header"><div className="shell nav"><Link href="/" className="brand"><span className="brand-mark">AF</span><span>Air Fryer</span></Link><nav><Link href="/air-fryers">Browse</Link><Link href="/brands">Brands</Link><Link href="/search">Search</Link></nav><Link href="/search" className="nav-cta">Search models</Link></div></header>
    <section className="section"><div className="shell"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/compare">Compare</Link><span>/</span><span>{a.title} vs {b.title}</span></div><span className="eyebrow">COMPARISON</span><h1 className="page-title">{a.title} vs {b.title}</h1><p className="page-lead">A field-by-field comparison from the verified product catalog.</p>
    <div className="compare-table"><div className="compare-head"><span>SPECIFICATION</span><b>{a.title}</b><b>{b.title}</b></div>{fields.map(([label,x,y])=><div className="compare-row" key={label}><span>{label}</span><b>{v(x)}</b><b>{v(y)}</b></div>)}</div></div></section></main>;
}