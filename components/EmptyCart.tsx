"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default function EmptyCart() {
  return (
    <section className="relative isolate flex min-h-[60vh] w-full items-center justify-center overflow-hidden rounded-3xl bg-shop-light-bg px-4 py-12 sm:px-8 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 -z-10 size-80 rounded-full bg-shop-dark-red/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 -z-10 size-80 rounded-full bg-shop-orange/[0.07] blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-2xl rounded-3xl border border-black/6 bg-white px-6 py-8 text-center shadow-[0_24px_80px_-40px_rgba(21,21,21,0.2)] sm:px-10 sm:py-10"
      >
        <div className="relative mx-auto aspect-374/285 w-full max-w-93.5">
          <Image
            src="/empty-cart.jpg"
            alt="A shopper sitting in an empty shopping cart"
            fill
            sizes="(max-width: 640px) 90vw, 374px"
            className="object-contain"
            priority
          />
        </div>

        <div className="mx-auto mt-6 flex size-12 items-center justify-center rounded-2xl bg-shop-dark-red/[0.07] text-shop-dark-red ring-1 ring-shop-dark-red/10">
          <ShoppingBag aria-hidden="true" className="size-5" strokeWidth={1.8} />
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-shop-dark-red">
          Your basket is ready
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-dark sm:text-3xl">
          Your cart is waiting for something good.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-shop_light_text sm:text-base">
          You haven&apos;t added anything yet. Explore the shop and find your
          everyday essentials.
        </p>

        <Link
          href="/shop"
          className="group mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-shop-dark-red px-6 py-3 text-sm font-semibold text-white shadow-md shadow-shop-dark-red/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-shop-dark-red/90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shop-dark-red focus-visible:ring-offset-2 sm:w-auto"
        >
          Discover products
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </motion.div>
    </section>
  );
}
