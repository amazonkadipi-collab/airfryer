import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: slug.replaceAll("-", " vs "), robots: { index: false, follow: true } };
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params;
  const title = slug.replaceAll("-", " ");
  return <main>
    <header className="site-header"><div className="shell nav"><Link href="/" className="brand"><span className="brand-mark">AF</span><span>Air Fryer</span></Link><nav><Link href="/air-fryers">Browse</Link><Link href="/brands">Brands</Link><Link href="/search">Search</Link></nav><Link href="/search" className="nav-cta">Search models</Link></div></header>
    <section className="section"><div className="shell"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/compare">Compare</Link><span>/</span><span>{title}</span></div><span className="eyebrow">COMPARISON</span><h1 className="page-title">{title}</h1><p className="page-lead">This comparison becomes indexable only after both product identities and the comparison data pass the quality gate.</p>
      <div className="compare-table"><div className="compare-head"><span>SPECIFICATION</span><b>PRODUCT A</b><b>PRODUCT B</b></div>{["Capacity","Power","Basket","Controls","Dishwasher safe","Retailers"].map(x=><div className="compare-row" key={x}><span>{x}</span><b>Not verified</b><b>Not verified</b></div>)}</div>
    </div></section>
  </main>;
}