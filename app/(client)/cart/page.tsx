"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Trash } from "lucide-react";
import toast from "react-hot-toast";
import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import FavoriteButton from "@/components/FavoriteButton";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButtons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Title } from "@/components/ui/text";
import { urlFor } from "@/sanity/lib/image";
import useStore from "@/store";

const CartPage = () => {
  const {
    deleteCartProduct,
    getTotalPrice,
    resetCart,
  } = useStore();
  const groupedItems = useStore((state) => state.getGroupedItems());

  const handleResetCart = () => {
    if (window.confirm("Are you sure you want to reset your cart?")) {
      resetCart();
      toast.success("Cart reset successfully.");
    }
  };

  const itemCount = groupedItems.reduce((count, item) => count + item.quantity, 0);
  const total = getTotalPrice();
  const discount = groupedItems.reduce((amount, { product, quantity }) => {
    const price = Number(product.price ?? 0);
    const discountPercent = Math.max(0, Number(product.discount ?? 0));
    return amount + (price * discountPercent * quantity) / 100;
  }, 0);
  const subtotal = total + discount;

  return (
    <div className="min-h-[60vh] bg-shop-light-bg py-8 sm:py-10 lg:py-14">
      <Container>
        {groupedItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-shop-dark-red/7 text-shop-dark-red">
                  <ShoppingBag aria-hidden="true" className="size-5" />
                </div>
                <div>
                  <Title>Shopping Cart</Title>
                  <p className="mt-1 text-sm text-shop_light_text">
                    {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="destructive"
                onClick={handleResetCart}
                className="rounded-full"
              >
                Reset cart
              </Button>
            </div>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
              <section
                aria-label="Cart items"
                className="overflow-hidden rounded-2xl border border-black/6 bg-white shadow-sm lg:col-span-2"
              >
                {groupedItems.map(({ product, quantity }) => {
                  const image = product.images?.[0];
                  const productHref = product.slug?.current
                    ? `/product/${product.slug.current}`
                    : "/shop";

                  return (
                    <article
                      key={product._id}
                      className="flex flex-col gap-4 border-b border-black/6 p-4 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5"
                    >
                      <div className="flex min-w-0 flex-1 items-start gap-4">
                        <Link
                          href={productHref}
                          aria-label={`View ${product.name ?? "product"}`}
                          className="group flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/6 bg-shop-light-bg p-2 sm:size-32"
                        >
                          {image?.asset ? (
                            <Image
                              src={urlFor(image).url()}
                              alt={product.name ?? "Product image"}
                              width={160}
                              height={160}
                              className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <ShoppingBag
                              aria-hidden="true"
                              className="size-8 text-shop_light_text"
                            />
                          )}
                        </Link>

                        <div className="flex min-h-24 min-w-0 flex-1 flex-col justify-between gap-3 sm:min-h-32">
                          <div className="min-w-0">
                            <Link href={productHref} className="group">
                              <h2 className="line-clamp-2 font-semibold text-dark transition-colors group-hover:text-shop-dark-red">
                                {product.name ?? "Product"}
                              </h2>
                            </Link>
                            {product.variant && (
                              <p className="mt-1 text-sm text-shop_light_text">
                                Variant:{" "}
                                <span className="font-medium text-dark">
                                  {product.variant}
                                </span>
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <FavoriteButton showProduct product={product} />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Remove ${product.name ?? "product"} from cart`}
                              onClick={() => {
                                deleteCartProduct(product._id);
                                toast.success("Product removed from cart.");
                              }}
                              className="size-9 text-shop_light_text hover:bg-shop-dark-red/5 hover:text-shop-dark-red"
                            >
                              <Trash aria-hidden="true" className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 border-t border-black/6 pt-3 sm:min-w-36 sm:flex-col sm:items-end sm:justify-center sm:border-0 sm:pt-0">
                        <PriceFormatter
                          amount={Number(product.price ?? 0) * quantity}
                          className="text-base font-bold sm:text-lg"
                        />
                        <QuantityButtons product={product} />
                      </div>
                    </article>
                  );
                })}
              </section>

              <aside className="space-y-5 lg:sticky lg:top-24">
                <section className="rounded-2xl border border-black/6 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-lg font-semibold text-dark">Order Summary</h2>
                  <div className="mt-5 space-y-4">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-shop_light_text">Subtotal</span>
                      <PriceFormatter amount={subtotal} />
                    </div>
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-shop_light_text">Discount</span>
                      <PriceFormatter
                        amount={discount}
                        className="text-shop-dark-green"
                      />
                    </div>
                    <p className="text-xs leading-5 text-shop_light_text">
                      Product prices already include any listed discount.
                    </p>
                    <div className="flex items-center justify-between gap-4 border-t border-black/6 pt-4">
                      <span className="font-semibold text-dark">Total</span>
                      <PriceFormatter
                        amount={total}
                        className="text-lg font-bold text-shop-dark-red"
                      />
                    </div>
                    <Link
                      href="/checkout"
                      className={buttonVariants({
                        size: "lg",
                        className: "w-full rounded-full",
                      })}
                    >
                      Continue to checkout
                      <ArrowRight aria-hidden="true" />
                    </Link>
                    <p className="text-center text-xs leading-5 text-shop_light_text">
                      Review delivery and payment details on the next step.
                    </p>
                  </div>
                </section>
              </aside>
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default CartPage;
