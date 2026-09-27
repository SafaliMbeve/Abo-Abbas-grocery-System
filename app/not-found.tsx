import Link from "next/link";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";

const NotFoundPage = () => {
  return (
    <section className="relative isolate flex min-h-[60vh] items-center justify-center overflow-hidden bg-shop-light-bg px-4 py-16 sm:px-6 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 -z-10 size-80 rounded-full bg-shop-dark-red/4 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-36 -left-24 -z-10 size-96 rounded-full bg-shop-orange/[0.07] blur-3xl"
      />

      <div className="w-full max-w-3xl rounded-3xl border border-black/6 bg-white p-7 text-center shadow-[0_24px_80px_-40px_rgba(21,21,21,0.24)] sm:p-12 lg:p-16">
        <div className="mx-auto mb-7 flex size-16 items-center justify-center rounded-2xl bg-shop-dark-red/[0.07] text-shop-dark-red ring-1 ring-shop-dark-red/10">
          <ShoppingBag aria-hidden="true" className="size-7" strokeWidth={1.7} />
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-shop-dark-red">
          Page not found
        </p>
        <h1 className="mt-3 text-7xl font-bold tracking-tight text-dark sm:text-8xl">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-dark sm:text-3xl">
          Looks like this page wandered off.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-shop_light_text sm:text-base">
          The page you&apos;re looking for may have moved or no longer exists.
          Let&apos;s get you back to something good.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-shop-dark-red px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-shop-dark-red/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-shop-dark-red/90 hover:shadow-xl hover:shadow-shop-dark-red/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shop-dark-red focus-visible:ring-offset-2 sm:w-auto"
          >
            Explore the shop
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-dark transition-colors hover:border-shop-dark-red/30 hover:bg-shop-light-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shop-dark-red focus-visible:ring-offset-2 sm:w-auto"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
