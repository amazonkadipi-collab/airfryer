"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getCatalogImage } from "@/lib/product-images";

export interface ProductCardData {
  id: number | string;
  slug: string;
  title: string;
  brand_name?: string | null;
  image_url?: string | null;
  capacity_quart?: number | null;
  basket_type?: string | null;
  model?: string | null;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = getCatalogImage(product.slug, product.image_url);

  if (!imageUrl || imageFailed) return null;

  const specs = [
    product.capacity_quart ? `${product.capacity_quart} qt` : null,
    product.basket_type,
    product.model ? `Model ${product.model}` : null,
  ].filter(Boolean);

  return (
    <article className="card">
      <Link href={`/products/${product.slug}`} className="card__media" aria-label={`View ${product.title}`}>
        <Image
          src={imageUrl}
          alt={product.title}
          width={500}
          height={500}
          sizes="(max-width: 640px) 46vw, (max-width: 1024px) 29vw, 270px"
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      </Link>
      <div className="card__body">
        {product.brand_name && <Link href={`/search?q=${encodeURIComponent(product.brand_name)}`} className="card__brand">{product.brand_name}</Link>}
        <Link href={`/products/${product.slug}`}><h3 className="card__title">{product.title}</h3></Link>
        {specs.length > 0 && <p className="card__specs">{specs.join(" · ")}</p>}
        <div className="card__bottom">
          <span className="card__link">See details</span>
          <span className="card__arrow" aria-hidden="true">›</span>
        </div>
      </div>
    </article>
  );
}
