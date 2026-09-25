import Link from "next/link";
import { notFound } from "next/navigation";
import { getAlternatives } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params; const data = await getAlternatives(slug);
  if (!data.product || !data.product.indexable) return { title: "Air Fryer Alternatives", robots: { index: false, follow: true } };
  return { title: "Alternatives to " + data.product.title, description: "Structured alternatives selected from verified product data.", robots: { index: true, follow: true }, alternates: { canonical: "/alternatives/" + data.product.slug } };
}
export default async function AlternativesPage({ params }: Props) {
  const { slug } = await params; const data=await getAlternatives(slug); if(!data.product) notFound();
  return <main><header className="site-header"><div className="shell nav"><Link href="/" className="brand"><span className="brand-mark">AF</span><span>Air Fryer</span></Link><nav><Link href="/air-fryers">Browse</Link><Link href="/brands">Brands</Link><Link href="/search">Search</Link></nav><Link href="/search" className="nav-cta">Search models</Link></div></header>
    <section className="section"><div className="shell"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/air-fryers">Air Fryers</Link><span>/</span><span>Alternatives</span></div><span className="eyebrow">ALTERNATIVES</span><h1 className="page-title">Alternatives to {data.product.title}</h1><p className="page-lead">Matches are selected using structured similarity signals such as capacity, basket configuration and verified product quality.</p>
    <div className="alternative-grid">{data.alternatives.map((p:any)=><Link className="alt-placeholder" href={"/products/"+p.slug} key={p.slug}><span>{Math.round(p.match_score)}</span><strong>{p.title}</strong><small>{p.brand_name ?? "Brand pending"}{p.capacity_quart ? " · "+p.capacity_quart+" qt" : ""}</small></Link>)}</div>
    </div></section></main>;
}