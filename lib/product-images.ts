const PRODUCT_IMAGES: Record<string, string> = {
  "ninja-af101-4-quart": "https://i5.walmartimages.com/seo/Ninja-AF101-Air-Fryer-that-Crisps-Roasts-Reheats-Dehydrates-for-Quick-Easy-Meals-4-Quart-Capacity-High-Gloss-Finish-Black-Grey_2ebe4464-4a26-4a47-8b74-fbb166a65c35.dfe9070a858617b0558385c21bd42a9b.jpeg",
  "ninja-foodi-dualzone-8-quart": "https://i5.walmartimages.com/seo/Ninja-Foodi-4-in-1-8-qt-2-Basket-Air-Fryer-with-DualZone-Technology-Air-Fry-Roast-More-Black-DZ100WM_d3e7d99e-cbb7-4bc0-8a2a-39fd4b24447d.683dace841ce4faad719d57d731e961b.jpeg",
  "ninja-doublestack-xl-10-quart": "https://mobileimages.lowes.com/productimages/074ca381-0aed-432f-8e1a-78db0f33350c/84100680.jpeg?size=pdhism",
  "cosori-turboblaze-6-quart": "https://cosori.com/cdn/shop/files/6391ace427ade714b70fb966024ae804.jpg?v=1763105029&width=1946",
  "instant-vortex-plus-clearcook-6-quart": "https://instantpot.com/cdn/shop/files/IB_Quiet-Mark_Silos_ATF_Square_140-3088-01_Vortex-Plus-ClearCook_6QT.png?v=1748562128&width=3000",
};
export function getCatalogImage(slug: string, imageUrl?: string | null) {
  return imageUrl || PRODUCT_IMAGES[slug] || null;
}
