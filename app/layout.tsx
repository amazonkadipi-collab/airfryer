import type { Metadata } from "next";
import "./globals.css";

const FALLBACK_SITE_URL = "https://airfryer1.vercel.app";

function getBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configured) return FALLBACK_SITE_URL;

  try {
    const url = new URL(
      /^https?:\/\//i.test(configured) ? configured : `https://${configured}`,
    );

    return url.origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Air Fryer Intelligence — Search, Compare & Buy Air Fryers",
    template: "%s | Air Fryer Intelligence",
  },
  description:
    "Search air fryers by model, UPC, EAN or ASIN. Compare specifications, identifiers, features, and trusted retailer offers.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Air Fryer Intelligence",
    url: baseUrl,
    title: "Air Fryer Intelligence — Search, Compare & Buy Air Fryers",
    description:
      "Search air fryers by model, UPC, EAN or ASIN. Compare specifications, identifiers, features, and trusted retailer offers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Air Fryer Intelligence",
    description:
      "Search air fryers by model, UPC, EAN or ASIN.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Air Fryer Intelligence",
  url: baseUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${baseUrl}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
