"use client";
import React from "react";
import { Product } from "@/sanity.types";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import useStore from "@/store";
import toast from "react-hot-toast";

const AddToWishlistButton = ({
  product,
  className,

}: {
  product: Product;
  className?: string;
}) => {
  const {favoriteProduct, addToFavorite, removeFromFavorite} = useStore();
  const existingProduct = favoriteProduct.some((item) => item._id === product._id);

  const handleFavorite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (existingProduct) {
      removeFromFavorite(product._id);
      toast.success("Product removed successfully!");
      return;
    }

    void addToFavorite(product).then(() => {
      toast.success("Product added successfully!");
    });
  };
  return (
  <div className={cn("absolute right-2 top-2 z-10", className)}>
    <button
      type="button"
      onClick={handleFavorite}
      aria-label={existingProduct ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={existingProduct}
      className={`rounded-full p-2.5 shadow-sm transition-colors hover:bg-shop-dark-red hover:text-white
        ${existingProduct ? "bg-shop-dark-red/80 text-white" : "bg-shop-light-bg" }`}
    >
      <Heart size={15} fill={existingProduct ? "currentColor" : "none"}/>
    </button>
  </div>
  );
}

export default AddToWishlistButton;