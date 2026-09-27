"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Title } from "@/components/ui/text";
import useStore from "@/store";

const WishlistPage = () => {
  const favoriteProduct = useStore((state) => state.favoriteProduct);
  const resetFavorite = useStore((state) => state.resetFavorite);

  const handleClearWishlist = () => {
    if (window.confirm("Are you sure you want to clear your wishlist?")) {
      resetFavorite();
      toast.success("Wishlist cleared.");
    }
  };

  return (
    <div className="min-h-[60vh] bg-shop-light-bg py-8 sm:py-10 lg:py-14">
      <Container>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-shop-dark-red/[0.07] text-shop-dark-red">
              <Heart aria-hidden="true" className="size-5" />
            </div>
            <div>
              <Title>My Wishlist</Title>
              <p className="mt-1 text-sm text-shop_light_text">
                {favoriteProduct.length}{" "}
                {favoriteProduct.length === 1 ? "product" : "products"} saved
              </p>
            </div>
          </div>
          {favoriteProduct.length > 0 && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleClearWishlist}
              className="rounded-full"
            >
              <Trash2 aria-hidden="true" />
              Clear wishlist
            </Button>
          )}
        </div>

        {favoriteProduct.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {favoriteProduct.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <section className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-black/[0.06] bg-white px-6 py-12 text-center shadow-sm">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-shop-light-bg text-shop-dark-red">
              <Heart aria-hidden="true" className="size-6" />
            </div>
            <h2 className="text-lg font-semibold text-dark">
              Your wishlist is empty
            </h2>
            <p className="mt-2 max-w-md text-sm text-shop_light_text">
              Tap the heart on a product to save it here for later.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-shop-dark-red px-5 text-sm font-semibold text-white transition-colors hover:bg-shop-dark-red/90"
            >
              Explore products
            </Link>
          </section>
        )}
      </Container>
    </div>
  );
};

export default WishlistPage;
