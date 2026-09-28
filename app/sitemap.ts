import type { MetadataRoute } from "next";
import { getDb } from "@/lib/db";

type SitemapProduct = { slug: string; updated_at: string };

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
  ];

  const db = getDb();
  if (!db) return staticPages;

  try {
    const products = (await db`
      SELECT slug, updated_at
      FROM products
      WHERE status = 'active' AND indexable = true
      ORDER BY updated_at DESC
      LIMIT 5000
    `) as SitemapProduct[];

    return [
      ...staticPages,
      ...products.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    return staticPages;
  }
}
