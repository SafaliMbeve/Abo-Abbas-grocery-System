
import React from "react";
import { Title } from "./ui/text";
import Link from "next/link";
import Image from "next/image";
import ShoppingCart from"../public/Products/Shopping Cart.jpg";

const HomeBanner = () => {
  return <div className="relative isolate flex items-center justify-between overflow-hidden rounded-3xl bg-shop-light-bg px-6 py-12 sm:px-10 md:min-h-[390px] md:px-14 lg:px-20">
    <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 -z-10 size-80 rounded-full bg-shop-dark-red/[0.06] blur-3xl" />
    <div className="max-w-2xl space-y-6">
        <p className="inline-flex items-center rounded-full border border-shop-dark-red/10 bg-white/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-shop-dark-red shadow-sm">
          Your local online grocery
        </p>
        <Title className="max-w-xl text-3xl leading-tight sm:text-4xl lg:text-5xl">
         Welcome to Abo Abbas. Your neighborhood grocery, just a click away.
        </Title>
        <p className="max-w-lg text-base leading-7 text-shop_light_text sm:text-lg">
          Fresh essentials delivered to your door. Enjoy free delivery on orders over K500.
        </p>
        <Link href={"/shop"} className="inline-flex min-h-11 items-center justify-center rounded-full bg-shop-dark-red px-6 py-3 text-sm font-semibold text-white shadow-md shadow-shop-dark-red/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-shop-dark-red/90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shop-dark-red focus-visible:ring-offset-2">Shop now</Link>
    </div>
    <div className="relative hidden shrink-0 md:block">
            <Image src={ShoppingCart} alt="Shopping cart" priority className="h-72 w-72 object-contain drop-shadow-xl lg:h-96 lg:w-96"/>
    </div>
    
    </div>
};
export default HomeBanner;