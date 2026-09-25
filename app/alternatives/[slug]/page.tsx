import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: `Alternatives to ${slug.replaceAll("-", " ")}`, robots: { index: false, follow: true } };
}

export default async function AlternativesPage({ params }: Props) {
  const { slug } = await params;
  const name = slug.replaceAll("-", " ");
  return <main>
    <header className="site-header"><div className="shell nav"><Link href="/" className="brand"><span className="brand-mark">AF</span><span>Air Fryer</span></Link><nav><Link href="/air-fryers">Browse</Link><Link href="/brands">Brands</Link><Link href="/search">Search</Link></nav><Link href="/search" className="nav-cta">Search models</Link></div></header>
    <section className="section"><div className="shell"><span className="eyebrow">ALTERNATIVES</span><h1 className="page-title">Alternatives to {name}</h1><p className="page-lead">Alternative products will be selected from the same category using verified capacity, features, price context and use-case signals.</p>
      <div className="alternative-grid"><div className="alt-placeholder"><span>01</span><strong>Similar capacity</strong><small>Waiting for product data</small></div><div className="alt-placeholder"><span>02</span><strong>Similar use case</strong><small>Waiting for product data</small></div><div className="alt-placeholder"><span>03</span><strong>Meaningful differences</strong><small>Waiting for product data</small></div></div>
    </div></section>
  </main>;
}