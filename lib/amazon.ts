const STORE_ID = process.env.AMAZON_ASSOCIATE_TAG?.trim() || "airfryerintel-20";
const MARKETPLACE = process.env.AMAZON_MARKETPLACE?.trim() || "www.amazon.com";

export function isAmazonRetailer(domain: string | null | undefined): boolean {
  const value = (domain ?? "").toLowerCase();
  return value === "amazon.com" || value === "www.amazon.com" || value.endsWith(".amazon.com");
}

export function getAmazonAffiliateUrl(asin: string): string {
  const clean = asin.trim();
  return `https://${MARKETPLACE}/dp/${encodeURIComponent(clean)}?tag=${encodeURIComponent(STORE_ID)}`;
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
