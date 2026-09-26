import { neon } from "@neondatabase/serverless";
import type { RawProduct } from "./validate";
import { normalizeIdentifier } from "./validate";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");
const sql = neon(databaseUrl);

export interface DedupeResult {
  isDuplicate: boolean;
  existingProductId?: number;
  matchedBy?: "asin" | "upc" | "ean" | "model";
}

export async function findDuplicate(p: RawProduct): Promise<DedupeResult> {
  const identifiers = [
    ["ASIN", normalizeIdentifier(p.asin)],
    ["UPC", p.upc?.replace(/\D/g, "")],
    ["EAN", p.ean?.replace(/\D/g, "")],
  ].filter((x): x is [string, string] => Boolean(x[1]));

  for (const [type, value] of identifiers) {
    const rows = await sql`
      SELECT product_id FROM product_identifiers
      WHERE identifier_type = ${type} AND identifier_value = ${value}
      LIMIT 1
    `;
    if (rows.length) return { isDuplicate: true, existingProductId: Number(rows[0].product_id), matchedBy: type.toLowerCase() as DedupeResult["matchedBy"] };
  }

  if (p.model?.trim()) {
    const rows = await sql`
      SELECT p.id FROM products p
      JOIN brands b ON b.id = p.brand_id
      WHERE lower(b.name) = lower(${p.brand || "Unknown"})
        AND lower(p.model) = lower(${p.model.trim()})
      LIMIT 1
    `;
    if (rows.length) return { isDuplicate: true, existingProductId: Number(rows[0].id), matchedBy: "model" };
  }

  return { isDuplicate: false };
}
