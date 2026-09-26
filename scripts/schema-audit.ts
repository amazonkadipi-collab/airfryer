import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");
const sql = neon(databaseUrl);

const required: Record<string, string[]> = {
  products: ["id","slug","brand_id","model","title","status","lifecycle_state","quality_score","indexable"],
  brands: ["id","slug","name"],
  product_identifiers: ["product_id","identifier_type","identifier_value","source","verified"],
  product_images: ["product_id","image_url","source","licensed","sort_order"],
  product_features: ["product_id","feature_key","feature_value","source","verified"],
};

async function main() {
  const rows = await sql`
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
  `;
  const actual = new Set(rows.map((r) => `${r.table_name}.${r.column_name}`));
  const missing: string[] = [];
  for (const [table, columns] of Object.entries(required)) {
    for (const column of columns) if (!actual.has(`${table}.${column}`)) missing.push(`${table}.${column}`);
  }
  if (missing.length) {
    console.error("Schema audit FAILED:", missing.join(", "));
    process.exitCode = 1;
    return;
  }
  console.log("Schema audit OK");
}
main();
