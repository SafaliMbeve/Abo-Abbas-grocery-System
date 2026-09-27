import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import type Stripe from "stripe";
import Link from "next/link";
import { CheckCircle2, MapPin, ShoppingBag } from "lucide-react";
import ClearCartOnPaid from "@/components/ClearCartOnPaid";
import Container from "@/components/Container";
import { getStripeClient, markStripeOrderPaid } from "@/lib/payments/stripe";
import { Title } from "@/components/ui/text";
import { getSanityWriteClient } from "@/sanity/lib/writeClient";

type OrderReceipt = {
  orderNumber: string;
  invoice?: { number?: string };
  customerName: string;
  paymentProvider: string;
  paymentTransactionId?: string;
  paymentStatus: string;
  orderDate: string;
  paidAt?: string;
  totalPrice: string;
  currency: string;
  amountDiscount: number;
  inventoryIssue?: boolean;
  address?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  product?: Array<{
    name?: string;
    quantity?: number;
    unitPrice?: number;
  }>;
};

type Props = {
  searchParams: Promise<{ session_id?: string; order?: string }>;
};

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-ZM", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unavailable"
    : new Intl.DateTimeFormat("en-ZM", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(date);
}

export default async function SuccessfulPaymentPage({ searchParams }: Props) {
  const [{ session_id: sessionId, order: returnedOrderNumber }, user] = await Promise.all([
    searchParams,
    currentUser(),
  ]);

  if ((!sessionId && !returnedOrderNumber) || !user) notFound();

  let orderNumber = returnedOrderNumber;
  if (sessionId) {
    let session: Stripe.Checkout.Session;
    try {
      session = await getStripeClient().checkout.sessions.retrieve(sessionId);
    } catch (error) {
      console.error("Stripe success page could not retrieve the checkout session:", error);
      redirect("/checkout/complete?status=unverified&method=stripe");
    }

    if (session.id !== sessionId || session.payment_status !== "paid") {
      redirect("/checkout/complete?status=unverified&method=stripe");
    }

    let payment: Awaited<ReturnType<typeof markStripeOrderPaid>>;
    try {
      payment = await markStripeOrderPaid(session);
    } catch (error) {
      console.error("Stripe success page could not confirm the paid order:", error);
      redirect("/checkout/complete?status=unverified&method=stripe");
    }
    orderNumber = payment.orderNumber;
  }

  if (!orderNumber) notFound();

  const client = getSanityWriteClient();
  const order = await client.fetch<OrderReceipt | null>(
    `*[
      _type == "order" &&
      orderNumber == $orderNumber &&
      clerkUserId == $clerkUserId &&
      paymentProvider == "stripe" &&
      paymentStatus == "paid"
    ][0]{
      orderNumber, invoice{number}, customerName, paymentProvider,
      paymentTransactionId, paymentStatus, orderDate, paidAt, totalPrice,
      currency, amountDiscount, inventoryIssue,
      address{name, address, city, state, zip},
      product[]{name, quantity, unitPrice}
    }`,
    { orderNumber, clerkUserId: user.id },
  );

  if (!order) notFound();

  const invoiceNumber = order.invoice?.number ?? order.orderNumber;
  const total = Number(order.totalPrice);
  const discount = Number(order.amountDiscount);
  const receiptDate = order.paidAt ?? order.orderDate;

  return (
    <div className="min-h-[60vh] bg-shop-light-bg py-8 sm:py-12">
      <ClearCartOnPaid />
      <Container>
        <section className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-black/6 bg-white shadow-sm">
          <div className="bg-shop-dark-green px-6 py-8 text-center text-white sm:px-10 sm:py-10">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-white/15">
              <CheckCircle2 aria-hidden="true" className="size-8" />
            </div>
            <Title className="mt-4 text-white">Payment successful</Title>
            <p className="mt-2 text-sm text-white/85">
              Thank you, {order.customerName}. Your card payment was confirmed.
            </p>
          </div>

          <div className="p-5 sm:p-8">
            <div className="grid gap-4 rounded-xl bg-shop-light-bg p-4 sm:grid-cols-2 sm:p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-shop_light_text">
                  Invoice / order number
                </p>
                <p className="mt-1 font-semibold text-dark">{invoiceNumber}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-shop_light_text">
                  Payment date
                </p>
                <p className="mt-1 font-semibold text-dark">
                  {formatDate(receiptDate)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-shop_light_text">
                  Payment method
                </p>
                <p className="mt-1 font-semibold text-dark">Card · Stripe</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-shop_light_text">
                  Payment status
                </p>
                <p className="mt-1 font-semibold capitalize text-shop-dark-green">
                  {order.paymentStatus}
                </p>
              </div>
            </div>

            <div className="mt-7">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-dark">
                <ShoppingBag aria-hidden="true" className="size-5 text-shop-dark-red" />
                Order details
              </h2>
              <div className="mt-3 divide-y divide-black/6 border-y border-black/6">
                {(order.product ?? []).map((item, index) => {
                  const quantity = item.quantity ?? 0;
                  const unitPrice = item.unitPrice ?? 0;
                  return (
                    <div
                      key={`${item.name ?? "item"}-${index}`}
                      className="flex items-start justify-between gap-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-dark">
                          {item.name ?? "Product"}
                        </p>
                        <p className="mt-1 text-sm text-shop_light_text">
                          Qty {quantity} × {formatMoney(unitPrice, order.currency)}
                        </p>
                      </div>
                      <p className="shrink-0 font-medium text-dark">
                        {formatMoney(quantity * unitPrice, order.currency)}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="ml-auto mt-4 max-w-sm space-y-2 text-sm">
                {discount > 0 && (
                  <div className="flex justify-between gap-4 text-shop_light_text">
                    <span>Discount</span>
                    <span>-{formatMoney(discount, order.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between gap-4 border-t border-black/6 pt-3 text-base font-bold text-dark">
                  <span>Total paid</span>
                  <span>{formatMoney(total, order.currency)}</span>
                </div>
              </div>
            </div>

            {order.address && (
              <div className="mt-7 rounded-xl border border-black/6 p-4">
                <h2 className="flex items-center gap-2 font-semibold text-dark">
                  <MapPin aria-hidden="true" className="size-4 text-shop-dark-red" />
                  Delivery details
                </h2>
                <p className="mt-2 text-sm leading-6 text-shop_light_text">
                  {[
                    order.address.name,
                    order.address.address,
                    order.address.city,
                    order.address.state,
                    order.address.zip,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            )}

            {order.inventoryIssue && (
              <p className="mt-5 rounded-lg bg-shop-orange/10 p-3 text-sm leading-5 text-dark">
                Your payment was received. The store will confirm item
                availability before preparing your order.
              </p>
            )}

            {order.paymentTransactionId && (
              <p className="mt-5 break-all text-xs text-shop_light_text">
                Payment reference: {order.paymentTransactionId}
              </p>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex h-11 items-center justify-center rounded-full bg-shop-dark-red px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-shop-dark-red/90"
              >
                Continue shopping
              </Link>
              <Link
                href="/cart"
                className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-dark transition-colors hover:bg-shop-light-bg"
              >
                Return to cart
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
