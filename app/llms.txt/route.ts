import { NextResponse } from "next/server";

export const runtime = "edge";

export function GET() {
  const body = `# Air Fryer Intelligence

> Air Fryer Intelligence is a product intelligence and comparison site for real air fryer models.

## Canonical
- https://airfryer1.vercel.app/

## Main sections
- https://airfryer1.vercel.app/air-fryers
- https://airfryer1.vercel.app/brands
- https://airfryer1.vercel.app/search
- https://airfryer1.vercel.app/compare
- https://airfryer1.vercel.app/affiliate-disclosure

## Product data policy
- Product pages are intended to represent real Amazon products identified by verified ASIN records.
- Missing specifications are not invented.
- Current Amazon price and availability are not claimed unless supported by compliant Amazon data.
- Affiliate links use the site's Amazon Associates tracking configuration.

## Machine-readable discovery
- Sitemap: https://airfryer1.vercel.app/sitemap.xml
- Robots: https://airfryer1.vercel.app/robots.txt
`;
  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
