export function getCatalogImage(_slug: string, imageUrl?: string | null) {
  if (!imageUrl) return null;
  try {
    const host = new URL(imageUrl).hostname.toLowerCase();
    if (host === "m.media-amazon.com" || host === "images-na.ssl-images-amazon.com") return imageUrl;
  } catch {}
  return null;
}

export function getCatalogSource(_slug: string) {
  return null;
}
