import Link from "next/link";

export function SiteFooter() {
  return (
    <footer>
      <div className="shell footer">
        <Link href="/" className="brand">
          <span className="brand-mark">AF</span>
          <span>Air Fryer</span>
        </Link>
        <span>Product intelligence for better decisions.</span>
        <div>
          <Link href="/air-fryers">Browse</Link>
          <Link href="/brands">Brands</Link>
          <Link href="/search">Search</Link>
          <Link href="/about">About</Link>
          <Link href="/how-we-rank">How we rank</Link>
          <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
