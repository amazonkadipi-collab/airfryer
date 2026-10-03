import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");

const sql = neon(databaseUrl);

type CatalogItem = {
  slug: string;
  brand: string;
  model: string;
  title: string;
  capacityQuart: number;
  basketType: string;
  basketCount: number;
  wattage?: number;
  dishwasherSafe?: boolean;
  temperatureMin?: number;
  temperatureMax?: number;
  dimensions?: Record<string, number | string>;
  weightKg?: number;
  imageUrl: string;
  imageSource: string;
  sourceUrl?: string;
  identifiers?: Array<{ type: string; value: string; verified: boolean; source: string }>;
};

const catalog: CatalogItem[] = [
  {
    slug: "ninja-af101-4-quart",
    brand: "Ninja",
    model: "AF101",
    title: "Ninja AF101 4-Quart Air Fryer",
    capacityQuart: 4, basketType: "single basket", basketCount: 1, wattage: 1550, dishwasherSafe: true, temperatureMin: 105, temperatureMax: 400,
    dimensions: { width_in: 11, length_in: 13.6, height_in: 13.3 }, weightKg: 4.81,
    imageUrl: "https://i5.walmartimages.com/seo/Ninja-AF101-Air-Fryer-that-Crisps-Roasts-Reheats-Dehydrates-for-Quick-Easy-Meals-4-Quart-Capacity-High-Gloss-Finish-Black-Grey_2ebe4464-4a26-4a47-8b74-fbb166a65c35.dfe9070a858617b0558385c21bd42a9b.jpeg",
    imageSource: "walmart.com",
    identifiers: [
      { type: "MPN", value: "AF101", verified: true, source: "web:discompare.ca" },
      { type: "ASIN", value: "B07FDJMC9Q", verified: true, source: "web:discompare.ca" },
      { type: "UPC", value: "622356554572", verified: true, source: "web:discompare.ca" }
    ],
  },
  {
    slug: "ninja-foodi-dualzone-8-quart",
    brand: "Ninja",
    model: "DZ201",
    title: "Ninja Foodi DualZone 8-Quart Air Fryer",
    capacityQuart: 8, basketType: "dual basket", basketCount: 2,
    wattage: 1690, dishwasherSafe: true, temperatureMin: 105, temperatureMax: 450,
    dimensions: { width_in: 13.86, length_in: 15.63, height_in: 12.4 }, weightKg: 8.1,
    imageUrl: "https://i5.walmartimages.com/seo/Ninja-Foodi-4-in-1-8-qt-2-Basket-Air-Fryer-with-DualZone-Technology-Air-Fry-Roast-More-Black-DZ100WM_d3e7d99e-cbb7-4bc0-8a2a-39fd4b24447d.683dace841ce4faad719d57d731e961b.jpeg",
    imageSource: "walmart.com",
    identifiers: [
      { type: "MPN", value: "DZ201", verified: true, source: "web:target.com" },
      { type: "UPC", value: "622356564380", verified: true, source: "web:target.com" }
    ],
  },
  {
    slug: "ninja-doublestack-xl-10-quart",
    brand: "Ninja",
    model: "SL401",
    title: "Ninja DoubleStack XL 10-Quart Air Fryer",
    capacityQuart: 10, basketType: "dual basket", basketCount: 2, wattage: 1690, dishwasherSafe: true, temperatureMin: 105, temperatureMax: 450,
    dimensions: { width_in: 13.07, length_in: 20.83, height_in: 17.72 }, weightKg: 11.4,
    imageUrl: "https://mobileimages.lowes.com/productimages/074ca381-0aed-432f-8e1a-78db0f33350c/84100680.jpeg?size=pdhism",
    imageSource: "lowes.com",
    identifiers: [
      { type: "MPN", value: "SL401", verified: true, source: "web:manuals.plus" },
      { type: "ASIN", value: "B0DVDNJKCZ", verified: true, source: "web:manuals.plus" },
      { type: "UPC", value: "703670881749", verified: true, source: "web:manuals.plus" }
    ],
  },
  {
    slug: "cosori-turboblaze-6-quart",
    brand: "COSORI",
    model: "CAF-DC601S-WUSR",
    title: "COSORI TurboBlaze Smart Air Fryer",
    capacityQuart: 6.5, basketType: "single basket", basketCount: 1, wattage: 1725, dishwasherSafe: true, temperatureMin: 90, temperatureMax: 450,
    dimensions: { width_in: 11.8, length_in: 14.8, height_in: 11.6 }, weightKg: 6.4,
    imageUrl: "https://cosori.com/cdn/shop/files/6391ace427ade714b70fb966024ae804.jpg?v=1763105029&width=1946",
    imageSource: "cosori.com",
    sourceUrl: "https://cosori.com/products/turboblaze%E2%84%A2-6-0-quart-air-fryer-cream",
    identifiers: [
      { type: "MPN", value: "CAF-DC601S-WUSR", verified: true, source: "web:cosori.com" }
    ],
  },
  {
    slug: "cosori-pro-le-5-quart-cp158-af",
    brand: "COSORI",
    model: "CP158-AF",
    title: "COSORI Air Fryer Max XL 5.8-Quart (CP158-AF)",
    capacityQuart: 5.8, basketType: "single basket", basketCount: 1, wattage: 1700, dishwasherSafe: true, temperatureMin: 170, temperatureMax: 400,
    dimensions: { width_in: 11.8, length_in: 14.3, height_in: 12.6 }, weightKg: 5.4,
    imageUrl: "https://djd1xqjx2kdnv.cloudfront.net/photos/36/81/489642_27284_XXXL.jpg",
    imageSource: "cloudfront",
    sourceUrl: "https://www.cpsc.gov/Recalls/2023/Two-Million-COSORI-Air-Fryers-Recalled-by-Atekcity-Due-to-Fire-and-Burn-Hazards",
    identifiers: [
      { type: "MPN", value: "CP158-AF", verified: true, source: "web:cosori.com" },
      { type: "ASIN", value: "B07N8N6C85", verified: true, source: "web:device.report" },
      { type: "UPC", value: "810043371117", verified: true, source: "web:infooggi.it" }
    ],
  },
  {
    slug: "instant-vortex-plus-clearcook-6-quart",
    brand: "Instant",
    model: "140-3088-01",
    title: "Instant Vortex Plus ClearCook 6-Quart Air Fryer",
    capacityQuart: 6, basketType: "single basket", basketCount: 1, wattage: 1700,
    dishwasherSafe: true, temperatureMin: 95, temperatureMax: 400,
    dimensions: { depth_in: 12.8, width_in: 11.8, height_in: 14.9 }, weightKg: 5.15,
    imageUrl: "https://instantpot.com/cdn/shop/files/IB_Quiet-Mark_Silos_ATF_Square_140-3088-01_Vortex-Plus-ClearCook_6QT.png?v=1748562128&width=3000",
    imageSource: "instantpot.com",
    sourceUrl: "https://instantpot.com/products/instant-pot-vortex-plus-6qt-clearcook-air-fryer",
    identifiers: [
      { type: "MPN", value: "140-3088-01", verified: true, source: "web:teklib.com" },
      { type: "ASIN", value: "B096N3FTZP", verified: true, source: "web:discompare.com" },
      { type: "UPC", value: "810028585027", verified: true, source: "web:teklib.com" }
    ],
  },
  {
    slug: "instant-vortex-plus-dual-8-quart",
    brand: "Instant",
    model: "140-3118-01",
    title: "Instant Vortex Plus Dual 8-Quart Air Fryer",
    capacityQuart: 8, basketType: "dual basket", basketCount: 2, wattage: 1700, dishwasherSafe: true, temperatureMin: 95, temperatureMax: 400,
    dimensions: { width_in: 15.87, length_in: 15.12, height_in: 12.48 }, weightKg: 7.9,
    imageUrl: "https://instantpot.com/cdn/shop/files/IB_140-3118-01_Vortex-ClearCook_Dual-SS-8qt.png?v=1746219631&width=3000",
    imageSource: "instantpot.com",
    sourceUrl: "https://instantpot.com/products/instant-pot-vortex-plus-dual-8qt-stainless-steel-air-fryer-with-clearcook",
    identifiers: [
      { type: "MPN", value: "140-3118-01", verified: true, source: "web:instantpot.com" },
      { type: "UPC", value: "810028582262", verified: true, source: "web:teklib.com" }
    ],
  },
  {
    slug: "philips-5000-na555-00-9-6-quart",
    brand: "Philips",
    model: "NA555/00",
    title: "Philips 5000 Series Dual-Basket Airfryer with Steam 9.6-Qt",
    capacityQuart: 9.6, basketType: "dual basket", basketCount: 2,
    wattage: 2750, dishwasherSafe: true, temperatureMax: 400,
    dimensions: { length_in: 13.8, width_in: 15, height_in: 17.4 }, weightKg: 8.75,
    imageUrl: "https://smartmag.biz.ua/storage/products/images/ZA7D0074UA99464/0x820/2025-09-24_18-32-36_ZA7D0074UA99464.jpg",
    imageSource: "smartmag.biz.ua",
    sourceUrl: "https://www.usa.philips.com/c-p/NA555_00/5000-series",
    identifiers: [
      { type: "MPN", value: "NA555/00", verified: true, source: "web:philips.com" }
    ],
  },
  {
    slug: "cuisinart-clearview-4-quart",
    brand: "Cuisinart",
    model: "AFC-4",
    title: "Cuisinart ClearView 4-Qt Glass Air Fryer",
    capacityQuart: 4, basketType: "glass basket", basketCount: 1, wattage: 1600, temperatureMax: 450,
    dimensions: { width_in: 12.6, length_in: 12.2, height_in: 11.5 }, weightKg: 5.79,
    imageUrl: "https://www.cuisinart.ca/on/demandware.static/-/Sites-master-us/default/dwbb01f632/images/large/AFC-4_1.jpg",
    imageSource: "cuisinart.ca",
    identifiers: [
      { type: "MPN", value: "AFC-4", verified: true, source: "web:airfryer.reviews" },
      { type: "UPC", value: "068459331823", verified: true, source: "web:airfryer.reviews" }
    ],
  },
  {
    slug: "bella-pro-smartcrisp-8-quart",
    brand: "bella",
    model: "90223",
    title: "bella PRO SmartCrisp 8-Qt Touchscreen Air Fryer",
    capacityQuart: 8, basketType: "single basket", basketCount: 1,
    wattage: 1700, temperatureMin: 90, temperatureMax: 450, dishwasherSafe: true,
    dimensions: { width_in: 13, length_in: 16, height_in: 14 }, weightKg: 4.43,
    imageUrl: "https://i.ebayimg.com/00/s/MTUyOFgxNjAw/z/SPsAAOSwvpxn7IRU/$_57.JPG?set_id=880000500F",
    imageSource: "ebay.com",
    identifiers: [
      { type: "MPN", value: "90223", verified: true, source: "web:bestbuy.com" }
    ],
  },
  {
    slug: "chefman-turbofry-6-quart",
    brand: "Chefman",
    model: "RJ38-SS-6T-V2",
    title: "Chefman TurboFry 6-Qt Air Fryer",
    capacityQuart: 6, basketType: "single basket", basketCount: 1,
    wattage: 1500, temperatureMin: 90, temperatureMax: 400, dishwasherSafe: true,
    dimensions: { width_in: 11.22, length_in: 13.97, height_in: 12.28 }, weightKg: 5.55,
    imageUrl: "https://i5.walmartimages.com/seo/Chefman-TurboFry-6-Quart-Digital-Air-Fryer-Touch-Controls-w-5-Cooking-Functions-Stainless-Steel_f502223c-b095-4fb9-b6f5-44b3a0eacfab.4781b400a20b506d0c75373e189a2cd3.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768",
    imageSource: "walmart.com",
    sourceUrl: "https://chefman.com/products/turbofry-6-quart-digital-air-fryer-touch-controls-w-5-cooking-functions-stainless-steel",
    identifiers: [
      { type: "MPN", value: "RJ38-SS-6T-V2", verified: true, source: "web:chefman.com" }
    ],
  },
  {
    slug: "ninja-af141-5-quart", brand: "Ninja", model: "AF141", title: "Ninja Air Fryer Pro 5-Quart",
    capacityQuart: 5, basketType: "single basket", basketCount: 1, wattage: 1750, dishwasherSafe: true, temperatureMin: 105, temperatureMax: 400,
    dimensions: { length_in: 14.84, width_in: 11.34, height_in: 10.55 }, weightKg: 4.84,
    imageUrl: "https://etsound.com.sg/cdn/shop/files/1_1327bfea-6475-4dd0-b354-ab7969bde52b.png?v=1744084540&width=1214", imageSource: "etsound.com.sg", sourceUrl: "https://www.sharkninja.com/ninja-air-fryer-pro-4-in-1/AF141.html",
  },
  { slug: "ninja-af160-5-2-quart", brand: "Ninja", model: "AF160", title: "Ninja Air Fryer Max 5.2L", capacityQuart: 5.5, basketType: "single basket", basketCount: 1, wattage: 1750, dishwasherSafe: true, temperatureMin: 104, temperatureMax: 464, dimensions: { width_cm: 27.5, depth_cm: 33.5, height_cm: 37.5 }, weightKg: 5.2, imageUrl: "https://www.kitchentime.de/assets/blobs/ninja-ninja-af160-air-fryer-52-l-grau/606955-01_1_ProductImageMain-e085e642a2.png", imageSource: "kitchentime.de", sourceUrl: "https://ninjakitchen.com.au/products/ninja-air-fryer-max-af160", identifiers: [{ type: "MPN", value: "AF160", verified: true, source: "web:ninjakitchen.com.au" }] },
  { slug: "ninja-af180-6-2-quart", brand: "Ninja", model: "AF180", title: "Ninja Air Fryer Max Pro 6.2L", capacityQuart: 6.5, basketType: "single basket", basketCount: 1, dishwasherSafe: true, imageUrl: "https://dam.elcorteingles.es/producto/www-0622356278782-00.jpg", imageSource: "elcorteingles.es", sourceUrl: "https://www.sharkninja.fr/air-fryer-ninja-max-pro-6.2l-3-en-1/AF170EU.html", identifiers: [{ type: "MPN", value: "AF180", verified: true, source: "web:elcorteingles.es" }] },
  { slug: "ninja-dz401-10-quart", brand: "Ninja", model: "DZ401", title: "Ninja Foodi DualZone 10-Quart Air Fryer", capacityQuart: 10, basketType: "dual basket", basketCount: 2, dishwasherSafe: true, imageUrl: "https://m.media-amazon.com/images/I/617-lSmiC0L._AC_SL1500_.jpg", imageSource: "amazon.com", sourceUrl: "https://manuals.plus/asin/B09SNWLLZM", identifiers: [{ type: "MPN", value: "DZ401", verified: true, source: "web:manuals.plus" }, { type: "ASIN", value: "B09SNWLLZM", verified: true, source: "web:manuals.plus" }] },
  { slug: "ninja-dz550-10-quart", brand: "Ninja", model: "DZ550", title: "Ninja Foodi Smart XL 10-Quart DualZone Air Fryer", capacityQuart: 10, basketType: "dual basket", basketCount: 2, wattage: 1690, dishwasherSafe: true, imageUrl: "https://static.wixstatic.com/media/c24f5b_d2a9f9f5576e4bcc984cfdb31ca67745~mv2.png/v1/fill/w_980%2Ch_683%2Cal_c%2Cq_90%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/c24f5b_d2a9f9f5576e4bcc984cfdb31ca67745~mv2.png", imageSource: "theinspectaspect.com", sourceUrl: "https://www.sharkninja.com/", identifiers: [{ type: "MPN", value: "DZ550", verified: true, source: "web:theinspectaspect.com" }] },
];

async function ensureBrand(name: string) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const rows = await sql`
    INSERT INTO brands (slug, name)
    VALUES (${slug}, ${name})
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW()
    RETURNING id
  `;
  return Number(rows[0].id);
}

async function ensureRetailer(name: string, domain: string, affiliateProgram?: string, affiliateStatus?: string) {
  const rows = await sql`
    INSERT INTO retailers (name, domain, affiliate_program, affiliate_status)
    VALUES (${name}, ${domain}, ${affiliateProgram ?? null}, ${affiliateStatus ?? "inactive"})
    ON CONFLICT (domain) DO UPDATE SET
      name = EXCLUDED.name,
      affiliate_program = COALESCE(EXCLUDED.affiliate_program, retailers.affiliate_program),
      affiliate_status = CASE
        WHEN EXCLUDED.affiliate_status <> 'inactive' THEN EXCLUDED.affiliate_status
        ELSE retailers.affiliate_status
      END
    RETURNING id
  `;
  return Number(rows[0].id);
}

function amazonUrl(asin: string): string {
  const tag = process.env.AMAZON_ASSOCIATE_TAG?.trim() || "airfryerintel-20";
  return `https://www.amazon.com/dp/${encodeURIComponent(asin.trim().toUpperCase())}?tag=${encodeURIComponent(tag)}`;
}

async function sync() {
  const categoryRows = await sql`
    INSERT INTO categories (slug, name, description)
    VALUES ('air-fryers', 'Air Fryers', 'Air fryer products and structured specifications.')
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
    RETURNING id
  `;
  const categoryId = Number(categoryRows[0].id);
  const amazonRetailerId = await ensureRetailer("Amazon.com", "amazon.com", "Amazon Associates", "active");

  for (const item of catalog) {
    const brandId = await ensureBrand(item.brand);

    const productRows = await sql`
      INSERT INTO products (
        slug, brand_id, model, title, category_id, capacity_quart, basket_type, basket_count,
        wattage, dishwasher_safe, temperature_min, temperature_max, dimensions, weight,
        status, lifecycle_state, quality_score, indexable, updated_at
      )
      VALUES (
        ${item.slug}, ${brandId}, ${item.model}, ${item.title}, ${categoryId},
        ${item.capacityQuart}, ${item.basketType}, ${item.basketCount},
        ${item.wattage ?? null}, ${item.dishwasherSafe ?? null},
        ${item.temperatureMin ?? null}, ${item.temperatureMax ?? null},
        ${item.dimensions ? JSON.stringify(item.dimensions) : null}::jsonb,
        ${item.weightKg ?? null}, 'active', 'published', 88, true, NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        brand_id = EXCLUDED.brand_id,
        model = EXCLUDED.model,
        title = EXCLUDED.title,
        category_id = EXCLUDED.category_id,
        capacity_quart = EXCLUDED.capacity_quart,
        basket_type = EXCLUDED.basket_type,
        basket_count = EXCLUDED.basket_count,
        wattage = COALESCE(EXCLUDED.wattage, products.wattage),
        dishwasher_safe = COALESCE(EXCLUDED.dishwasher_safe, products.dishwasher_safe),
        temperature_min = COALESCE(EXCLUDED.temperature_min, products.temperature_min),
        temperature_max = COALESCE(EXCLUDED.temperature_max, products.temperature_max),
        dimensions = COALESCE(EXCLUDED.dimensions, products.dimensions),
        weight = COALESCE(EXCLUDED.weight, products.weight),
        status = 'active',
        lifecycle_state = 'published',
        quality_score = GREATEST(COALESCE(products.quality_score, 0), EXCLUDED.quality_score),
        indexable = true,
        updated_at = NOW()
      RETURNING id
    `;
    const productId = Number(productRows[0].id);

    await sql`
      INSERT INTO product_images (product_id, image_url, source, licensed, sort_order)
      VALUES (${productId}, ${item.imageUrl}, ${item.imageSource}, false, 0)
      ON CONFLICT DO NOTHING
    `;

    for (const identifier of item.identifiers ?? []) {
      await sql`
        INSERT INTO product_identifiers
          (product_id, identifier_type, identifier_value, source, verified, source_timestamp, verified_at)
        VALUES (
          ${productId}, ${identifier.type}, ${identifier.value}, ${identifier.source},
          ${identifier.verified}, NOW(), CASE WHEN ${identifier.verified} THEN NOW() ELSE NULL END
        )
        ON CONFLICT (identifier_type, identifier_value) DO NOTHING
      `;
    }

    const asin = item.identifiers?.find((identifier) => identifier.type.toUpperCase() === "ASIN")?.value;
    if (asin) {
      const url = amazonUrl(asin);
      await sql`
        INSERT INTO product_retailers (
          product_id, retailer_id, external_product_id, url, affiliate_url, currency, availability
        )
        VALUES (${productId}, ${amazonRetailerId}, ${asin.trim().toUpperCase()}, ${url}, ${url}, 'USD', NULL)
        ON CONFLICT DO NOTHING
      `;
    }
  }

  console.log("Catalog sync complete: " + catalog.length + " products synced.");
}
sync().catch((error) => {
  console.error("Catalog sync failed:", error);
  process.exit(1);
});
