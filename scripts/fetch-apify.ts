import fs from "node:fs";
import path from "node:path";

const APIFY_TOKEN = process.env.APIFY_TOKEN;
const ACTOR = process.env.APIFY_ACTOR ?? "epctex~amazon-scraper";
const TIMEOUT_MS = 15 * 60 * 1000;
const OUTPUT = process.env.OUTPUT ?? "./data/airfryers-raw.json";
const MAX_ITEMS = Number(process.env.MAX_ITEMS ?? 20);

if (!APIFY_TOKEN) {
  console.error("❌ APIFY_TOKEN is missing. Set it in .env.local");
  process.exit(1);
}

const input = {
  categoryUrls: ["https://www.amazon.com/s?k=air+fryer"],
  maxItems: MAX_ITEMS,
  proxyConfiguration: { useApifyProxy: true },
};

async function run() {
  const url = `https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;
  console.log(`🚀 Actor: ${ACTOR}`);
  console.log(`📦 Max items: ${MAX_ITEMS}`);
  console.log(`⏱️ Timeout: ${TIMEOUT_MS / 1000}s`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: controller.signal,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw new Error(`Timeout after ${TIMEOUT_MS / 1000}s`);
    throw new Error(`Network error: ${(err as Error).message}`);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "<no body>");
    const hints: Record<number, string> = {
      401: "Check APIFY_TOKEN",
      402: "Insufficient Apify credits",
      429: "Rate limited; wait and retry",
    };
    throw new Error(`Apify returned ${res.status}: ${hints[res.status] ?? body.slice(0, 500)}`);
  }

  const data: unknown = await res.json().catch(() => {
    throw new Error("Failed to parse Apify response as JSON");
  });

  if (!Array.isArray(data)) throw new Error(`Expected array, got ${typeof data}`);
  if (data.length === 0) {
    console.warn("⚠️ Apify returned 0 items. Nothing written.");
    return;
  }

  const outPath = path.resolve(OUTPUT);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const tmpPath = `${outPath}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2));
  fs.renameSync(tmpPath, outPath);

  console.log(`✅ Wrote ${data.length} items → ${outPath}`);
  const first = data[0];
  if (first && typeof first === "object") {
    console.log("📋 Sample keys:", Object.keys(first).slice(0, 30).join(", "));
  }
}

run().catch((err) => {
  console.error("💥", (err as Error).message);
  process.exit(1);
});
