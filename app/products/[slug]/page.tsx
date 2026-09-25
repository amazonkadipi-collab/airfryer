import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: `${slug.replaceAll("-", " ")} — Product`, robots: { index: false, follow: true } };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const name = slug.replaceAll("-", " ");
  return <main>
    <header className="site-header"><div className="shell nav">
      <Link href="/" className="brand"><span className="brand-mark">AF</span><span>Air Fryer</span></Link>
      <nav><Link href="/air-fryers">Browse</Link><Link href="/brands">Brands</Link><Link href="/search">Search</Link></nav>
      <Link href="/search" className="nav-cta">Search models</Link>
    </div></header>
    <section className="product-hero"><div className="shell">
      <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/air-fryers">Air Fryers</Link><span>/</span><span>{name}</span></div>
      <div className="product-grid">
        <div className="product-visual"><span className="eyebrow">PRODUCT RECORD</span><div className="product-placeholder"><span>AF</span><small>Product image appears when a licensed source is available.</small></div></div>
        <div className="product-copy"><span className="eyebrow">VERIFICATION PENDING</span><h1>{name}</h1><p>Product details will appear here after identity matching and source validation. We do not invent specifications.</p>
          <div className="identifier-box"><b>IDENTITY</b><span>Model / UPC / EAN / ASIN</span><small>Pending verified product data</small></div>
          <div className="action-row"><Link href="/search" className="button dark">Find another model</Link><Link href="/compare" className="button light">Compare products</Link></div>
        </div>
      </div>
    </div></section>
    <section className="section"><div className="shell">
      <div className="section-head"><div><span className="eyebrow">PRODUCT DETAILS</span><h2>Structured information</h2></div></div>
      <div className="spec-table"><div><b>Capacity</b><span>Not verified</span></div><div><b>Power</b><span>Not verified</span></div><div><b>Basket</b><span>Not verified</span></div><div><b>Controls</b><span>Not verified</span></div><div><b>Dishwasher safe</b><span>Not verified</span></div><div><b>Dimensions</b><span>Not verified</span></div></div>
    </div></section>
  </main>;
}