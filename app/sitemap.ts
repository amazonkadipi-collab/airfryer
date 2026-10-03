import type { MetadataRoute } from "next";
import { getDb } from "@/lib/db";

type SitemapProduct = { slug: string; updated_at: string };
type SitemapComparison = { slug: string; updated_at: string };

function getBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const fallback = "https://airfryer1.vercel.app";
  if (!configured) return fallback;
  try {
    const url = new URL(/^https?:\/\//i.test(configured) ? configured : `https://${configured}`);
    return url.origin;
  } catch {
    return fallback;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/air-fryers`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/brands`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/air-fryers/6-quart`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/best/air-fryers-for-two`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/best/dual-basket-air-fryers`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/how-we-rank`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/affiliate-disclosure`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const db = getDb();
  if (!db) return staticPages;

  try {
    const products = (await db`
      SELECT slug, updated_at
      FROM products
      WHERE status = 'active' AND indexable = true
      ORDER BY updated_at DESC
      LIMIT 45000
    `) as SitemapProduct[];

    const comparisons = (await db`
      SELECT slug, updated_at
      FROM comparisons
      WHERE status = 'published' AND COALESCE(quality_score, 0) >= 80
      ORDER BY updated_at DESC
      LIMIT 5000
    `) as SitemapComparison[];

    return [
      ...staticPages,
      ...products.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...comparisons.map((comparison) => ({
        url: `${baseUrl}/compare/${comparison.slug}`,
        lastModified: new Date(comparison.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.75,
      })),
    ];
  } catch {
    return staticPages;
  }
}
