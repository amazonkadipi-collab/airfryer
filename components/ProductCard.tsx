import Image from "next/image";
import Link from "next/link";

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
  const specs = [
    product.model ? `Model: ${product.model}` : null,
    product.capacity_quart ? `${product.capacity_quart} qt` : null,
    product.basket_type,
  ].filter(Boolean);

  return (
    <Link href={`/products/${product.slug}`} className="card">
      <div className="card__media">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title}
            width={400}
            height={400}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 260px"
            loading="lazy"
          />
        ) : (
          <div className="card__placeholder" aria-hidden="true">
            <span>AF</span>
          </div>
        )}
      </div>
      <div className="card__body">
        {product.brand_name && <p className="card__brand">{product.brand_name}</p>}
        <h3 className="card__title">{product.title}</h3>
        {specs.length > 0 && <p className="card__specs">{specs.join(" · ")}</p>}
        <span className="card__link">View full details →</span>
      </div>
    </Link>
  );
}
