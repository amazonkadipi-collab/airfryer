export interface RawProduct {
  asin?: string;
  upc?: string;
  ean?: string;
  title: string;
  brand?: string;
  model?: string;
  price?: number;
  currency?: string;
  rating?: number;
  review_count?: number;
  categories?: string[];
  images?: string[];
  features?: string[];
  dimensions?: Record<string, unknown> | string;
  weight?: string | number;
  wattage?: number;
  capacity_quart?: number;
  capacity_liters?: number;
  source: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function normalizeIdentifier(value?: string): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toUpperCase();
  return normalized || undefined;
}

export function validateProduct(p: RawProduct): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!p.title?.trim() || p.title.trim().length < 5) errors.push("title missing or too short");
  if (!p.source?.trim()) errors.push("source missing");
  if (!p.brand?.trim() || p.brand.trim().length < 2) warnings.push('brand missing — will use "Unknown"');

  const identifiers = [p.asin, p.upc, p.ean].map(normalizeIdentifier).filter(Boolean);
  if (!identifiers.length && !p.model?.trim()) errors.push("no identifier (ASIN/UPC/EAN/MPN) — cannot safely dedupe");

  if (p.upc && !/^\d{12}$/.test(p.upc.replace(/\D/g, ""))) warnings.push(`UPC format suspicious: ${p.upc}`);
  if (p.ean && !/^\d{13}$/.test(p.ean.replace(/\D/g, ""))) warnings.push(`EAN format suspicious: ${p.ean}`);
  if (p.asin && !/^B[0-9A-Z]{9}$/.test(p.asin.toUpperCase())) warnings.push(`ASIN format suspicious: ${p.asin}`);

  if (p.price !== undefined && (!Number.isFinite(p.price) || p.price <= 0 || p.price > 5000)) {
    warnings.push(`price out of range: ${p.price}`);
  }
  if (!p.images?.length) warnings.push("no images");
  if (p.rating !== undefined && (p.rating < 0 || p.rating > 5)) warnings.push(`rating out of range: ${p.rating}`);
  if (p.review_count !== undefined && p.review_count < 0) warnings.push("review_count is negative");
  if (p.dimensions && typeof p.dimensions === "string") warnings.push("dimensions is string, will attempt parse");

  return { valid: errors.length === 0, errors, warnings };
}

export function parseDimensions(d: RawProduct["dimensions"]): Record<string, unknown> | null {
  if (!d) return null;
  if (typeof d === "object") return d;
  const m = d.match(/([\d.]+)\s*x\s*([\d.]+)\s*x\s*([\d.]+)\s*(in|cm|inches|centimeters)?/i);
  if (m) return {
    length: Number(m[1]), width: Number(m[2]), height: Number(m[3]),
    unit: m[4]?.toLowerCase() === "centimeters" ? "cm" : (m[4] || "in"),
    raw: d,
  };
  return { raw: d };
}

export function parseWeight(value: RawProduct["weight"]): number | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const m = value.match(/[\d.]+/);
  return m ? Number(m[0]) : null;
}
