import fs from "node:fs";
import path from "node:path";

const INPUT = process.argv[2] ?? "./data/airfryers-raw.json";
const OUTPUT = process.argv[3] ?? "./data/airfryers.json";

function pick<T = unknown>(obj: Record<string, unknown>, ...keys: string[]): T | undefined {
  for (const key of keys) {
    const value = obj[key];
    if (value !== undefined && value !== null && value !== "") return value as T;
  }
  return undefined;
}

function pickNumber(obj: Record<string, unknown>, ...keys: string[]): number | undefined {
  const value = pick(obj, ...keys);
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace(/[^0-9.-]/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function pickArray(obj: Record<string, unknown>, ...keys: string[]): string[] {
  for (const key of keys) {
    const value = obj[key];
    if (Array.isArray(value)) {
      return value.map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          const record = item as Record<string, unknown>;
          return String(record.url ?? record.imageUrl ?? record.text ?? "");
        }
        return "";
      }).filter(Boolean);
    }
    if (typeof value === "string" && value.trim()) return [value.trim()];
  }
  return [];
}

function pickPrice(obj: Record<string, unknown>): { value?: number; currency: string } {
  const price = obj.price ?? obj.currentPrice ?? obj.buyboxPrice;
  if (price && typeof price === "object") {
    const record = price as Record<string, unknown>;
    return {
      value: pickNumber(record, "value", "amount", "price", "raw"),
      currency: (pick<string>(record, "currency", "currencyCode") ?? "USD").toUpperCase(),
    };
  }
  if (typeof price === "number") return { value: price, currency: "USD" };
  return {
    value: pickNumber(obj, "priceValue", "priceAmount", "currentPriceValue"),
    currency: (pick<string>(obj, "currency", "currencyCode") ?? "USD").toUpperCase(),
  };
}

function normalizeUrl(value?: string): string | undefined {
  if (!value?.trim()) return undefined;
  const url = value.trim();
  return /^https?:\/\//i.test(url) ? url : undefined;
}

function inferRetailer(url?: string): { name?: string; domain?: string } {
  if (!url) return {};
  try {
    const domain = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    const names: Record<string, string> = {
      "amazon.com": "Amazon",
      "walmart.com": "Walmart",
      "target.com": "Target",
      "lowes.com": "Lowe's",
      "bestbuy.com": "Best Buy",
    };
    return { domain, name: names[domain] ?? domain };
  } catch {
    return {};
  }
}

interface NormalizedProduct {
  asin?: string;
  upc?: string;
  ean?: string;
  title: string;
  brand?: string;
  model?: string;
  price?: number;
  currency: string;
  rating?: number;
  review_count?: number;
  categories: string[];
  images: string[];
  features: string[];
  dimensions?: string;
  weight?: string;
  source: string;
  product_url?: string;
  affiliate_url?: string;
  retailer_name?: string;
  retailer_domain?: string;
  retailer_product_id?: string;
  availability?: string;
}

function adapt(raw: Record<string, unknown>): NormalizedProduct | null {
  const title = pick<string>(raw, "title", "productTitle", "name", "itemName");
  if (!title?.trim()) return null;

  const { value: price, currency } = pickPrice(raw);
  const productUrl = normalizeUrl(pick<string>(raw, "productUrl", "productURL", "product_url", "detailPageURL", "detailUrl", "canonicalUrl"));
  const inferred = inferRetailer(productUrl);
  return {
    asin: pick<string>(raw, "asin", "ASIN", "productAsin"),
    upc: pick<string>(raw, "upc", "UPC", "gtin12"),
    ean: pick<string>(raw, "ean", "EAN", "gtin13"),
    title: title.trim(),
    brand: pick<string>(raw, "brand", "brandName", "manufacturer", "byLine"),
    model: pick<string>(raw, "model", "modelNumber", "partNumber", "mpn"),
    price,
    currency,
    rating: pickNumber(raw, "rating", "averageRating", "stars"),
    review_count: pickNumber(raw, "reviewsCount", "reviewCount", "ratingsCount", "reviews"),
    categories: pickArray(raw, "categories", "category", "categoryPath", "breadcrumbs"),
    images: pickArray(raw, "images", "imageUrls", "image", "photos", "gallery"),
    features: pickArray(raw, "featureBullets", "features", "feature_bullets", "bullets", "aboutThisItem"),
    dimensions: pick<string>(raw, "productDimensions", "dimensions", "itemDimensions", "size"),
    weight: pick<string>(raw, "itemWeight", "weight", "shippingWeight"),
    source: "apify",
    product_url: productUrl,
    affiliate_url: normalizeUrl(pick<string>(raw, "affiliateUrl", "affiliateURL", "affiliate_url")),
    retailer_name: pick<string>(raw, "retailerName", "retailer", "storeName") ?? inferred.name,
    retailer_domain: pick<string>(raw, "retailerDomain", "retailer_domain") ?? inferred.domain,
    retailer_product_id: pick<string>(raw, "retailerProductId", "externalProductId", "external_product_id"),
    availability: pick<string>(raw, "availability", "availabilityStatus", "stock"),
  };
}

function main() {
  const inPath = path.resolve(INPUT);
  const outPath = path.resolve(OUTPUT);
  if (!fs.existsSync(inPath)) throw new Error(`Input not found: ${inPath}`);

  const raw: unknown = JSON.parse(fs.readFileSync(inPath, "utf8"));
  if (!Array.isArray(raw)) throw new Error(`Expected array in ${inPath}`);

  const adapted: NormalizedProduct[] = [];
  let skipped = 0;
  for (const item of raw) {
    if (!item || typeof item !== "object") {
      skipped++;
      continue;
    }
    const normalized = adapt(item as Record<string, unknown>);
    if (!normalized) skipped++;
    else adapted.push(normalized);
  }

  if (adapted.length === 0) throw new Error("No valid products after adaptation");

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const tmp = `${outPath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(adapted, null, 2));
  fs.renameSync(tmp, outPath);

  console.log(`✅ Adapted ${adapted.length}/${raw.length} → ${outPath}`);
  if (skipped) console.log(`⏭️ Skipped ${skipped}`);

  const coverage = {
    asin: adapted.filter((p) => p.asin).length,
    upc: adapted.filter((p) => p.upc).length,
    ean: adapted.filter((p) => p.ean).length,
    brand: adapted.filter((p) => p.brand).length,
    model: adapted.filter((p) => p.model).length,
    price: adapted.filter((p) => p.price !== undefined).length,
    images: adapted.filter((p) => p.images.length > 0).length,
    features: adapted.filter((p) => p.features.length > 0).length,
    product_url: adapted.filter((p) => p.product_url).length,
    retailer: adapted.filter((p) => p.retailer_domain).length,
  };

  console.log("📊 Field coverage:");
  for (const [key, count] of Object.entries(coverage)) {
    console.log(`  ${key.padEnd(12)} ${count}/${adapted.length} (${((count / adapted.length) * 100).toFixed(0)}%)`);
  }
  console.log("📋 Sample:", JSON.stringify(adapted[0], null, 2));
}

main();
