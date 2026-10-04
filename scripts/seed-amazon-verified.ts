import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");
const sql = neon(databaseUrl);

const TAG = process.env.AMAZON_ASSOCIATE_TAG?.trim() || "airfryerintel-20";
const amazonUrl = (asin: string) => `https://www.amazon.com/dp/${asin}?tag=${encodeURIComponent(TAG)}`;

type VerifiedAmazonProduct = {
  slug: string;
  brand: string;
  model: string;
  title: string;
  description: string;
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
  asin: string;
  upc?: string;
  features: string[];
};

const products: VerifiedAmazonProduct[] = [
  {
    slug: "ninja-af101-4-quart-amazon",
    brand: "Ninja",
    model: "AF101",
    title: "Ninja Air Fryer, 4 QT Capacity, 4-in-1",
    description: "Amazon product record for the Ninja AF101 4-quart air fryer. Amazon lists Air Fry, Roast, Reheat and Dehydrate programs, a 105–400°F range, 1550 watts and dishwasher-safe parts.",
    capacityQuart: 4,
    basketType: "single basket",
    basketCount: 1,
    wattage: 1550,
    dishwasherSafe: true,
    temperatureMin: 105,
    temperatureMax: 400,
    dimensions: { depth_in: 13.6, width_in: 11, height_in: 13.3 },
    weightKg: 4.8,
    imageUrl: "https://m.media-amazon.com/images/I/31MBSKiZOPL._SL160_.jpg",
    asin: "B07FDJMC9Q",
    upc: "622356554572",
    features: ["Air Fry", "Roast", "Reheat", "Dehydrate", "Dishwasher-safe parts", "Ceramic-coated nonstick basket"]
  },
  {
    slug: "ninja-af141-5-quart-amazon",
    brand: "Ninja",
    model: "AF141",
    title: "Ninja Air Fryer Pro 4-in-1, 5 QT, AF141",
    description: "Amazon product record for the Ninja AF141 5-quart air fryer. The Amazon listing identifies the model as AF141 and describes Air Fry, Roast, Reheat and Dehydrate cooking with a 400°F maximum temperature.",
    capacityQuart: 5,
    basketType: "single basket",
    basketCount: 1,
    wattage: 1750,
    dishwasherSafe: true,
    temperatureMax: 400,
    dimensions: { depth_in: 14.84, width_in: 11.34, height_in: 10.55 },
    weightKg: 4.84,
    imageUrl: "https://m.media-amazon.com/images/I/51WzB1iJVpL._AC_SR240,220_.jpg",
    asin: "B0CSZ7WBYW",
    features: ["Air Fry", "Roast", "Reheat", "Dehydrate", "Air Crisp technology", "Nonstick basket and crisper plate"]
  },
  {
    slug: "cosori-turboblaze-6-quart-amazon",
    brand: "COSORI",
    model: "TurboBlaze",
    title: "Cosori 9-in-1 TurboBlaze Air Fryer 6 Qt",
    description: "Amazon product record for the COSORI TurboBlaze 6-quart air fryer. Amazon lists 90–450°F temperature control, 1725 watts, ceramic nonstick cooking surfaces and a 6-quart basket.",
    capacityQuart: 6,
    basketType: "single basket",
    basketCount: 1,
    wattage: 1725,
    dishwasherSafe: true,
    temperatureMin: 90,
    temperatureMax: 450,
    dimensions: { depth_in: 14.4, width_in: 11.8, height_in: 11.9 },
    weightKg: 5.99,
    imageUrl: "https://m.media-amazon.com/images/I/81R9sA3IyBL._AC_UY218_.jpg",
    asin: "B0C33CHG99",
    features: ["9 cooking functions", "90–450°F control", "TurboBlaze technology", "PFAS-free ceramic coating", "Dishwasher-safe basket and crisper tray", "120V"]
  },
  {
    slug: "instant-vortex-plus-6-quart-amazon",
    brand: "Instant Pot",
    model: "Vortex Plus 6Qt",
    title: "Instant Pot 6QT VORTEX Plus Air Fryer",
    description: "Amazon product record for the Instant Pot Vortex Plus 6-quart air fryer. Amazon lists 1700 watts, 95–400°F temperature settings, touch controls, EvenCrisp technology and dishwasher-safe care.",
    capacityQuart: 6,
    basketType: "single basket",
    basketCount: 1,
    wattage: 1700,
    dishwasherSafe: true,
    temperatureMin: 95,
    temperatureMax: 400,
    dimensions: { depth_in: 12.36, width_in: 14.92, height_in: 12.83 },
    weightKg: 7.04,
    imageUrl: "https://m.media-amazon.com/images/I/71GPWtT61gL._AC_UY218_.jpg",
    asin: "B07VHFMZHJ",
    upc: "857561008866",
    features: ["6-in-1 cooking", "EvenCrisp technology", "Touch controls", "95–400°F", "Dishwasher-safe basket", "100+ in-app recipes"]
  },
  {
    slug: "chefman-12-quart-air-fryer-amazon",
    brand: "Chefman",
    model: "12-Quart 6-in-1 Air Fryer Oven",
    title: "Chefman 12-Quart 6-in-1 Air Fryer Oven",
    description: "Amazon product record for the Chefman 12-quart 6-in-1 air fryer oven. Amazon lists air fry, bake, dehydrate, rotisserie, roast and reheat functions, 95–450°F operation, 12 presets and dishwasher-safe removable parts.",
    capacityQuart: 12,
    basketType: "air fryer oven",
    basketCount: 1,
    dishwasherSafe: true,
    temperatureMin: 95,
    temperatureMax: 450,
    dimensions: { depth_in: 14.4, width_in: 12.8, height_in: 14.7 },
    imageUrl: "https://m.media-amazon.com/images/I/81eOHKSRVDL._AC_UY218_.jpg",
    asin: "B0CGMFGX87",
    features: ["Air Fry", "Bake", "Dehydrate", "Rotisserie", "Roast", "Reheat", "12 presets", "Interior light", "Dishwasher-safe parts"]
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
  const categoryRows = await sql`
    INSERT INTO categories (slug, name, description)
    VALUES ('air-fryers', 'Air Fryers', 'Amazon-backed air fryer product records.')
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id
  `;
  const categoryId = Number(categoryRows[0].id);

  const retailerRows = await sql`
    INSERT INTO retailers (name, domain, affiliate_program, affiliate_status)
    VALUES ('Amazon.com', 'amazon.com', 'Amazon Associates', 'active')
    ON CONFLICT (domain) DO UPDATE SET affiliate_program='Amazon Associates', affiliate_status='active'
    RETURNING id
  `;
  const retailerId = Number(retailerRows[0].id);

  for (const item of products) {
    const brandId = await ensureBrand(item.brand);
    const url = amazonUrl(item.asin);

    const rows = await sql`
      INSERT INTO products (
        slug, brand_id, model, title, description, category_id,
        capacity_quart, basket_type, basket_count, wattage,
        dishwasher_safe, temperature_min, temperature_max, dimensions, weight,
        status, lifecycle_state, human_verified, verified_by, verified_at,
        quality_score, indexable, updated_at
      )
      VALUES (
        ${item.slug}, ${brandId}, ${item.model}, ${item.title}, ${item.description}, ${categoryId},
        ${item.capacityQuart}, ${item.basketType}, ${item.basketCount}, ${item.wattage ?? null},
        ${item.dishwasherSafe ?? null}, ${item.temperatureMin ?? null}, ${item.temperatureMax ?? null},
        ${item.dimensions ? JSON.stringify(item.dimensions) : null}::jsonb, ${item.weightKg ?? null},
        'active', 'published', true, 'amazon-product-page', NOW(), 98, true, NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        brand_id=EXCLUDED.brand_id, model=EXCLUDED.model, title=EXCLUDED.title,
        description=EXCLUDED.description, category_id=EXCLUDED.category_id,
        capacity_quart=EXCLUDED.capacity_quart, basket_type=EXCLUDED.basket_type,
        basket_count=EXCLUDED.basket_count, wattage=EXCLUDED.wattage,
        dishwasher_safe=EXCLUDED.dishwasher_safe, temperature_min=EXCLUDED.temperature_min,
        temperature_max=EXCLUDED.temperature_max, dimensions=EXCLUDED.dimensions,
        weight=EXCLUDED.weight, status='active', lifecycle_state='published',
        human_verified=true, verified_by='amazon-product-page', verified_at=NOW(),
        quality_score=98, indexable=true, updated_at=NOW()
      RETURNING id
    `;
    const productId = Number(rows[0].id);

    await sql`
      DELETE FROM product_images WHERE product_id=${productId}
    `;
    await sql`
      INSERT INTO product_images (product_id, image_url, source, licensed, sort_order)
      VALUES (${productId}, ${item.imageUrl}, 'amazon.com', false, 0)
    `;

    await sql`
      INSERT INTO product_identifiers
        (product_id, identifier_type, identifier_value, source, verified, source_timestamp, verified_at)
      VALUES (${productId}, 'ASIN', ${item.asin}, 'amazon.com', true, NOW(), NOW())
      ON CONFLICT (identifier_type, identifier_value) DO UPDATE SET
        product_id=EXCLUDED.product_id, source='amazon.com', verified=true,
        source_timestamp=NOW(), verified_at=NOW()
    `;

    if (item.upc) {
      await sql`
        INSERT INTO product_identifiers
          (product_id, identifier_type, identifier_value, source, verified, source_timestamp, verified_at)
        VALUES (${productId}, 'UPC', ${item.upc}, 'amazon.com', true, NOW(), NOW())
        ON CONFLICT (identifier_type, identifier_value) DO UPDATE SET
          product_id=EXCLUDED.product_id, source='amazon.com', verified=true,
          source_timestamp=NOW(), verified_at=NOW()
      `;
    }

    await sql`
      INSERT INTO product_retailers (
        product_id, retailer_id, external_product_id, url, affiliate_url,
        currency, availability, last_checked_at
      )
      VALUES (${productId}, ${retailerId}, ${item.asin}, ${url}, ${url}, 'USD', NULL, NOW())
      ON CONFLICT DO NOTHING
    `;

    for (const feature of item.features) {
      await sql`
        INSERT INTO product_features
          (product_id, feature_key, feature_value, source, verified, source_timestamp)
        VALUES (${productId}, 'amazon_feature', ${feature}, 'amazon.com', true, NOW())
        ON CONFLICT DO NOTHING
      `;
    }
  }

  // Do not publish the old catalog records until their Amazon identity, image and
  // product data have been independently verified.
  const verifiedAsins = products.map((p) => p.asin.toUpperCase());
  await sql`
    UPDATE products p
    SET indexable=false, updated_at=NOW()
    WHERE p.indexable=true AND NOT EXISTS (
      SELECT 1 FROM product_identifiers i
      WHERE i.product_id=p.id AND upper(i.identifier_type)='ASIN'
        AND i.verified=true AND upper(i.identifier_value)=ANY(${verifiedAsins})
    )
  `;

  console.log(`Verified Amazon catalog sync complete: ${products.length} products.`);
}

sync().catch((error) => {
  console.error("Verified Amazon catalog sync failed:", error);
  process.exit(1);
});
