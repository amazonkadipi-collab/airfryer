import type { MetadataRoute } from "next";

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

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/go/", "/admin/"] }],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
