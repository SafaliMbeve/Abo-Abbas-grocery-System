import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import AddToWishlistButton from "./AddToWishlistButton";
import { Title } from "./ui/text";
import PriceView from "./PriceView";
import AddToCartButton from "./AddToCartButton";

type ProductCardData = Omit<Product, "categories"> & {
  categories?: Array<string | NonNullable<Product["categories"]>[number]>;
};

const ProductCard = ({ product }: { product: ProductCardData}) => {
  const productForStore: Product = {
    ...product,
    categories: product.categories?.filter(
      (category): category is NonNullable<Product["categories"]>[number] => typeof category !== "string"
    ),
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white text-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-shop-dark-red/20 hover:shadow-xl hover:shadow-black/6">
        <div className="relative overflow-hidden bg-shop-light-bg">
            <Link href={`/product/${product?.slug?.current ?? ""}`} aria-label={product?.name}>
              {product?.images?.[0]?.asset && (
                <Image
                  src={urlFor(product?.images[0]).url()}
                  alt={product?.name ?? "Product image"}
                  loading="lazy"
                  width={700}
                  height={700}
                  className={`h-56 w-full bg-white p-4 object-contain
                   transition-transform duration-500
                    ${product?.stock !== 0 ? "group-hover:scale-105" : "opacity-50"}`}
                />
              )}
            </Link>

            <AddToWishlistButton product={productForStore}/>

            {product?.status === "sale" && 
            (<p className="absolute left-3 top-3 z-10 rounded-full bg-shop-dark-red px-3 py-1 text-[11px] font-semibold text-white shadow-sm">Sale
            </p>)}

            {product?.status === "new" && 
            (<p className="absolute left-3 top-3 z-10 rounded-full border border-black/6 bg-white/95 px-3 py-1 text-[11px] font-semibold text-dark shadow-sm">New arrival
            </p>)}
            
            {product?.status === "hot" && <Link href={"/discounts"} 
            className="absolute left-3 top-3 z-10 rounded-full border border-shop-orange/30 bg-white p-2 text-shop-orange shadow-sm transition-colors hover:border-shop-orange hover:bg-shop-orange hover:text-white">
            
            <Flame size={18}
            fill="#fb6c08"
            className="text-shop-orange/50 group-hover:text-shop-orange hoverEffect"/>
            </Link>}

        </div>
        <div className="flex flex-col gap-2.5 p-4">
          {product?.categories && (<p className="line-clamp-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-shop_light_text">
            {product.categories?.map((category) => typeof category === "string" ? category : category._ref).join(",")}
            </p>
          )}

          <Link href={`/product/${product?.slug?.current ?? ""}`}>
            <Title className="line-clamp-2 text-sm font-semibold leading-snug text-dark transition-colors group-hover:text-shop-dark-red">{product?.name}</Title>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href={`/product/${product?.slug?.current ?? ""}#product-reviews-title`}
              className="text-shop_light_text text-[11px] tracking-wide underline-offset-2 hover:underline"
            >
              View customer reviews
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-4 text-xs">
          <p className="font-medium text-shop_light_text">In stock</p>
          <p className={`${product?.stock === 0 ? "text-shop-orange" : "font-semibold text-shop-light-red"}`}>{(product?.stock as number) > 0 ? product?.stock : "unavailable"}</p>
        </div>

        <PriceView
        price={product?.price}
        discount={product?.discount}
        className="text-sm"
        />
        <div className="mt-auto w-full px-4 pb-4 pt-3">
          <AddToCartButton product={productForStore} size="sm" className="h-9 w-full rounded-full"/>
        </div>
    </div>
  )
}

export default ProductCard;