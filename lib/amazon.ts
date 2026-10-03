const STORE_ID = process.env.AMAZON_ASSOCIATE_TAG?.trim() || "airfryerintel-20";
const MARKETPLACE = process.env.AMAZON_MARKETPLACE?.trim() || "www.amazon.com";

export function isAmazonRetailer(domain: string | null | undefined): boolean {
  const value = (domain ?? "").toLowerCase();
  return value === "amazon.com" || value === "www.amazon.com" || value.endsWith(".amazon.com");
}

export function getAmazonAffiliateUrl(asin: string): string {
  const clean = asin.trim().toUpperCase();
  if (!clean) return "";
  return `https://${MARKETPLACE}/dp/${encodeURIComponent(clean)}?tag=${encodeURIComponent(STORE_ID)}`;
}

export function getAmazonAsin(identifiers: Array<{ identifier_type: string; identifier_value: string }> | null | undefined): string | null {
  const match = (identifiers ?? []).find(
    (item) => item.identifier_type.trim().toUpperCase() === "ASIN" &&
      /^[A-Z0-9]{10}$/.test(item.identifier_value.trim().toUpperCase())
  );
  return match?.identifier_value.trim().toUpperCase() ?? null;
}

export function getAmazonConfig() {
  return {
    storeId: STORE_ID,
    marketplace: MARKETPLACE,
    clientId: process.env.AMAZON_CREATORS_CLIENT_ID?.trim() || "",
    clientSecret: process.env.AMAZON_CREATORS_CLIENT_SECRET?.trim() || "",
  };
}

export function amazonApiConfigured(): boolean {
  const config = getAmazonConfig();
  return Boolean(config.clientId && config.clientSecret);
}
