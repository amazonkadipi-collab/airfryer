const PRODUCT_IMAGES: Record<string, string> = {
  "cosori-turboblaze-6-quart": "https://cosori.com/cdn/shop/files/6391ace427ade714b70fb966024ae804.jpg?v=1763105029&width=1946",
  "instant-vortex-plus-clearcook-6-quart": "https://instantpot.com/cdn/shop/files/IB_Quiet-Mark_Silos_ATF_Square_140-3088-01_Vortex-Plus-ClearCook_6QT.png?v=1748562128&width=3000",
};
export function getCatalogImage(slug: string, imageUrl?: string | null) {
  return imageUrl || PRODUCT_IMAGES[slug] || null;
}
