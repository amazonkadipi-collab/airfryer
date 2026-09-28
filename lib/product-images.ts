const PRODUCT_IMAGES: Record<string, string> = {
  "ninja-af101-4-quart": "https://i5.walmartimages.com/seo/Ninja-AF101-Air-Fryer-that-Crisps-Roasts-Reheats-Dehydrates-for-Quick-Easy-Meals-4-Quart-Capacity-High-Gloss-Finish-Black-Grey_2ebe4464-4a26-4a47-8b74-fbb166a65c35.dfe9070a858617b0558385c21bd42a9b.jpeg",
  "ninja-foodi-dualzone-8-quart": "https://i5.walmartimages.com/seo/Ninja-Foodi-4-in-1-8-qt-2-Basket-Air-Fryer-with-DualZone-Technology-Air-Fry-Roast-More-Black-DZ100WM_d3e7d99e-cbb7-4bc0-8a2a-39fd4b24447d.683dace841ce4faad719d57d731e961b.jpeg",
  "ninja-doublestack-xl-10-quart": "https://mobileimages.lowes.com/productimages/074ca381-0aed-432f-8e1a-78db0f33350c/84100680.jpeg?size=pdhism",
  "cosori-turboblaze-6-quart": "https://cosori.com/cdn/shop/files/6391ace427ade714b70fb966024ae804.jpg?v=1763105029&width=1946",
  "cosori-pro-le-5-quart-cp158-af": "https://djd1xqjx2kdnv.cloudfront.net/photos/36/81/489642_27284_XXXL.jpg",
  "instant-vortex-plus-clearcook-6-quart": "https://instantpot.com/cdn/shop/files/IB_Quiet-Mark_Silos_ATF_Square_140-3088-01_Vortex-Plus-ClearCook_6QT.png?v=1748562128&width=3000",
  "instant-vortex-plus-dual-8-quart": "https://instantpot.com/cdn/shop/files/IB_140-3118-01_Vortex-ClearCook_Dual-SS-8qt.png?v=1746219631&width=3000",
  "philips-5000-na555-00-9-6-quart": "https://smartmag.biz.ua/storage/products/images/ZA7D0074UA99464/0x820/2025-09-24_18-32-36_ZA7D0074UA99464.jpg",
  "cuisinart-clearview-4-quart": "https://www.cuisinart.ca/on/demandware.static/-/Sites-master-us/default/dwbb01f632/images/large/AFC-4_1.jpg",
  "bella-pro-smartcrisp-8-quart": "https://i.ebayimg.com/00/s/MTUyOFgxNjAw/z/SPsAAOSwvpxn7IRU/$_57.JPG?set_id=880000500F",
  "chefman-turbofry-6-quart": "https://i5.walmartimages.com/seo/Chefman-TurboFry-6-Quart-Digital-Air-Fryer-Touch-Controls-w-5-Cooking-Functions-Stainless-Steel_f502223c-b095-4fb9-b6f5-44b3a0eacfab.4781b400a20b506d0c75373e189a2cd3.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"
} as Record<string,string>;

const PRODUCT_SOURCES: Record<string, string> = {
  "ninja-af101-4-quart": "https://manuals.plus/asin/B07FDJMC9Q",
  "ninja-foodi-dualzone-8-quart": "https://www.ninjakitchen.com/products/ninja-foodi-6-in-1-8-qt.-2-basket-air-fryer-with-dualzone-technology-zidDZ201C",
  "ninja-doublestack-xl-10-quart": "https://www.ninjakitchen.com/products/ninja-doublestack-xl-2-basket-10-qt-air-fryer-zidSL401",
  "cosori-turboblaze-6-quart": "https://cosori.com/products/turboblaze%E2%84%A2-6-0-quart-air-fryer-cream",
  "cosori-pro-le-5-quart-cp158-af": "https://www.cpsc.gov/Recalls/2023/Two-Million-COSORI-Air-Fryers-Recalled-by-Atekcity-Due-to-Fire-and-Burn-Hazards",
  "instant-vortex-plus-clearcook-6-quart": "https://instantpot.com/products/instant-pot-vortex-plus-6qt-clearcook-air-fryer",
  "instant-vortex-plus-dual-8-quart": "https://instantpot.com/products/instant-pot-vortex-plus-dual-8qt-stainless-steel-air-fryer-with-clearcook",
  "philips-5000-na555-00-9-6-quart": "https://acc.usa.philips.com/c-p/NA555_00/5000-series",
  "cuisinart-clearview-4-quart": "https://www.cuisinart.com/clearview-4-quart-glass-basket-air-fryer/AFC-4.html",
  "bella-pro-smartcrisp-8-quart": "https://www.bestbuy.com/product/bella-pro-smartcrisp-8-qt-touchscreen-air-fryer-stainless-steel/J3P5RSSWRR",
  "chefman-turbofry-6-quart": "https://chefman.com/products/turbofry-6-quart-digital-air-fryer-touch-controls-w-5-cooking-functions-stainless-steel"
} as Record<string,string>;

export function getCatalogImage(slug: string, imageUrl?: string | null) { return imageUrl || PRODUCT_IMAGES[slug] || null; }
export function getCatalogSource(slug: string) { return PRODUCT_SOURCES[slug] || null; }
