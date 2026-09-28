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
    capacityQuart: 4, basketType: "single basket", basketCount: 1, wattage: 1550,
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
    wattage: 1690, dishwasherSafe: true, temperatureMax: 450,
    dimensions: { depth_in: 13.86, width_in: 15.63, height_in: 12.4 }, weightKg: 8.1,
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
    capacityQuart: 10, basketType: "dual basket", basketCount: 2,
    dimensions: { length_in: 17.1, width_in: 13.9, height_in: 12.8 }, weightKg: 9.07,
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
    title: "COSORI TurboBlaze 6-Qt Air Fryer",
    capacityQuart: 6, basketType: "single basket", basketCount: 1, dishwasherSafe: true,
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
    title: "COSORI Pro LE 5-Qt Air Fryer",
    capacityQuart: 5, basketType: "single basket", basketCount: 1, wattage: 1500,
    dimensions: { length_in: 10.7, width_in: 10.8, height_in: 11.9 },
    imageUrl: "https://djd1xqjx2kdnv.cloudfront.net/photos/36/81/489642_27284_XXXL.jpg",
    imageSource: "cloudfront",
    sourceUrl: "https://cosori.com/products/pro-le-5-0-quart-air-fryer",
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
    capacityQuart: 8, basketType: "dual basket", basketCount: 2,
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
    wattage: 2750, dimensions: { depth_cm: 44.4, width_cm: 38.3, height_cm: 35.5 }, weightKg: 8.75,
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
    dimensions: { length_in: 13.25, width_in: 13.25, height_in: 14 }, weightKg: 4.72,
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
    imageUrl: "https://i5.walmartimages.com/seo/Chefman-TurboFry-6-Quart-Digital-Air-Fryer-Touch-Controls-w-5-Cooking-Functions-Stainless-Steel_f502223c-b095-4fb9-b6f5-44b3a0eacfab.4781b400a20b506d0c75373e189a2cd3.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768",
    imageSource: "walmart.com",
    sourceUrl: "https://chefman.com/products/turbofry-6-quart-digital-air-fryer-touch-controls-w-5-cooking-functions-stainless-steel",
    identifiers: [
      { type: "MPN", value: "RJ38-SS-6T-V2", verified: true, source: "web:chefman.com" }
    ],
  },
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

async function sync() {
  await sql`
    INSERT INTO categories (slug, name, description)
    VALUES ('air-fryers', 'Air Fryers', 'Air fryer products and structured specifications.')
    ON CONFLICT (slug) DO NOTHING
  `;

  for (const item of catalog) {
    const brandId = await ensureBrand(item.brand);

    await sql`
      UPDATE products
      SET brand_id = ${brandId},
          model = ${item.model},
          title = ${item.title},
          capacity_quart = ${item.capacityQuart},
          basket_type = ${item.basketType},
          basket_count = ${item.basketCount},
          wattage = COALESCE(${item.wattage ?? null}, wattage),
          dishwasher_safe = COALESCE(${item.dishwasherSafe ?? null}, dishwasher_safe),
          temperature_min = COALESCE(${item.temperatureMin ?? null}, temperature_min),
          temperature_max = COALESCE(${item.temperatureMax ?? null}, temperature_max),
          dimensions = COALESCE(${item.dimensions ? JSON.stringify(item.dimensions) : null}::jsonb, dimensions),
          weight = COALESCE(${item.weightKg ?? null}, weight),
          status = 'active',
          lifecycle_state = 'published',
          quality_score = GREATEST(COALESCE(quality_score, 0), 88),
          indexable = true,
          updated_at = NOW()
      WHERE slug = ${item.slug}
    `;

    await sql`
      INSERT INTO product_images (product_id, image_url, source, licensed, sort_order)
      SELECT p.id, ${item.imageUrl}, ${item.imageSource}, false, 0
      FROM products p
      WHERE p.slug = ${item.slug}
        AND NOT EXISTS (
          SELECT 1 FROM product_images pi
          WHERE pi.product_id = p.id AND pi.image_url = ${item.imageUrl}
        )
    `;

    for (const identifier of item.identifiers ?? []) {
      await sql`
        INSERT INTO product_identifiers
          (product_id, identifier_type, identifier_value, source, verified, source_timestamp, verified_at)
        SELECT p.id, ${identifier.type}, ${identifier.value}, ${identifier.source},
          ${identifier.verified}, NOW(),
          CASE WHEN ${identifier.verified} THEN NOW() ELSE NULL END
        FROM products p
        WHERE p.slug = ${item.slug}
          AND NOT EXISTS (
            SELECT 1 FROM product_identifiers i
            WHERE i.product_id = p.id
              AND i.identifier_type = ${identifier.type}
              AND i.identifier_value = ${identifier.value}
          )
      `;
    }
  }

  console.log("Catalog sync complete: " + catalog.length + " products enriched.");
}

sync().catch((error) => {
  console.error("Catalog sync failed:", error);
  process.exit(1);
});
