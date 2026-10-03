import Link from "next/link";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "";

export const metadata = {
  title: "Contact",
  description: "Contact Air Fryer Intelligence about product data, sources, corrections and partnerships.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return (
    <main>
      <header className="site-header">
        <div className="shell nav">
          <Link href="/" className="brand"><span className="brand-mark">AF</span><span>Air Fryer</span></Link>
          <nav aria-label="Primary"><Link href="/air-fryers">Browse</Link><Link href="/brands">Brands</Link><Link href="/search">Search</Link></nav>
          <Link href="/search" className="nav-cta">Find an air fryer</Link>
        </div>
      </header>
      <section className="section">
        <div className="shell narrow-copy">
          <span className="eyebrow">AIR FRYER INTELLIGENCE</span>
          <h1 className="page-title">Contact</h1>
          <p className="page-lead">Questions, corrections, source issues or partnership enquiries.</p>
          <div className="legal-copy">
            <h2>Product-data corrections</h2>
            <p>If you spot an incorrect model, specification, identifier or source, tell us which product page needs review and include the source you trust.</p>
            {CONTACT_EMAIL ? (
              <p><a className="button" href={`mailto:${CONTACT_EMAIL}?subject=Air%20Fryer%20Intelligence%20correction`}>Email {CONTACT_EMAIL}</a></p>
            ) : (
              <p className="muted">A public contact email is not configured yet. Set <code>NEXT_PUBLIC_CONTACT_EMAIL</code> in Vercel before launch.</p>
            )}
          </div>
        </div>
      </section>
      <footer>
        <div className="shell footer">
          <Link href="/" className="brand"><span className="brand-mark">AF</span><span>Air Fryer</span></Link>
          <span>Product intelligence for better decisions.</span>
          <div><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
        </div>
      </footer>
    </main>
  );
}
