"use client"

import { Heart } from 'lucide-react';
import React from "react"
import Link from 'next/link';
import { Product } from '@/sanity.types';
import useStore from "@/store";
import toast from "react-hot-toast";

const FavoriteButton = ({showProduct = false, product}: {
  showProduct?: boolean
  product?: Product | null | undefined;
}) => {
  const favoriteProduct = useStore((state) => state.favoriteProduct);
  const addToFavorite = useStore((state) => state.addToFavorite);
  const removeFromFavorite = useStore((state) => state.removeFromFavorite);
  const isFavorite = product ? favoriteProduct.some((item) => item._id === product._id) : false;

  const toggleFavorite = () => {
    if (!product) return;
    if (isFavorite) {
      removeFromFavorite(product._id);
      toast.success(`${product.name ?? "Product"} removed from your wishlist.`);
    } else {
      void addToFavorite(product).then(() => {
        toast.success(`${product.name ?? "Product"} added to your wishlist.`);
      });
    }
  };

  return ( 
       <>
        {!showProduct ? (<Link href={"/wishlist"} className="group relative">
          <Heart className="w-5 h-5 hover:text-shop-light-red hoverEffect"/>
          <span className="absolute top-1 right-1 bg-shop-orange
           text-white h-3.5 w-3.5 rounded-full 
           text-xs font-semibold flex items-center
            justify-center"> {favoriteProduct?.length ? favoriteProduct?.length : 0}
          </span>
        </Link>) : (
          <button onClick={toggleFavorite} aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={isFavorite} className="group relative hover:text-shop-orange hoverEffect border
          border-shop-orange/80 hover:border-shop-orange p-1.5 rounded-sm">
            <Heart fill={isFavorite ? "currentColor" : "none"} className="mt-0.5 size-5 text-shop-orange/80 group-hover:text-shop-orange hoverEffect"/>
          </button>)}
       </>
  );
  
};

export default FavoriteButton