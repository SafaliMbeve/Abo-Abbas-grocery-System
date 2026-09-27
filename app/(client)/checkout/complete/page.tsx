import Link from "next/link";
import { CheckCircle2, Clock3, ShoppingBag } from "lucide-react";
import Container from "@/components/Container";
import ClearCartOnPaid from "@/components/ClearCartOnPaid";
import { Title } from "@/components/ui/text";

type Props = {
  searchParams: Promise<{
    status?: string;
    order?: string;
    inventory?: string;
    method?: string;
  }>;
};

export default async function CheckoutCompletePage({ searchParams }: Props) {
  const { status, order, inventory, method } = await searchParams;
  const isPaid = status === "paid";

  return (
    <div className="min-h-[60vh] bg-shop-light-bg py-10 sm:py-14">
      <Container className="flex justify-center">
        {isPaid && <ClearCartOnPaid />}
        <section className="w-full max-w-xl rounded-2xl border border-black/6 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
          <div
            className={`mx-auto flex size-14 items-center justify-center rounded-2xl ${
              isPaid
                ? "bg-shop-dark-green/10 text-shop-dark-green"
                : "bg-shop-orange/10 text-shop-orange"
            }`}
          >
            {isPaid ? (
              <CheckCircle2 aria-hidden="true" className="size-7" />
            ) : (
              <Clock3 aria-hidden="true" className="size-7" />
            )}
          </div>
          <Title className="mt-5">
            {isPaid
              ? method === "demo"
                ? "Demo payment completed"
                : "Payment received"
              : "Payment not confirmed yet"}
          </Title>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-shop_light_text">
            {isPaid
              ? method === "demo"
                ? inventory === "review"
                  ? "This was a simulated school-project payment, not a real charge. The store will confirm item availability before preparing your order."
                  : "This was a simulated school-project payment; no card was charged. Your demo order is confirmed."
                : inventory === "review"
                  ? "Your payment was received. The store will confirm item availability before preparing your order."
                  : "Your order is confirmed and the store will begin preparing it."
              : status === "failed"
                ? "The payment was not approved. You can return to your cart and try again."
                : status === "cancelled"
                  ? "You cancelled the payment. Your order has not been confirmed; you can return to checkout and try again."
                  : `Your order remains pending until ${method === "stripe" ? "Stripe" : method === "demo" ? "the demo payment" : "Flutterwave"} confirms your payment. If you completed payment, please wait a moment and check your order status.`}
          </p>
          {isPaid && order && (
            <p className="mt-4 text-sm font-semibold text-dark">
              Order number: {order}
            </p>
          )}
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-shop-dark-red px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-shop-dark-red/90"
            >
              <ShoppingBag aria-hidden="true" className="size-4" />
              Continue shopping
            </Link>
            <Link
              href="/cart"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-dark transition-colors hover:bg-shop-light-bg"
            >
              Return to cart
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}
