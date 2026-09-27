import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeClient, markStripeOrderPaid } from "@/lib/payments/stripe";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook authentication is not configured." },
      { status: 503 },
    );
  }
  if (!signature) {
    return NextResponse.json(
      { error: "Stripe webhook signature is missing." },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = getStripeClient().webhooks.constructEvent(
      await request.text(),
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Stripe webhook signature verification failed." },
      { status: 400 },
    );
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object;
    if (session.payment_status === "paid") {
      try {
        await markStripeOrderPaid(session);
      } catch (error) {
        console.error("Stripe webhook payment verification failed:", error);
        return NextResponse.json(
          { error: "Payment verification failed." },
          { status: 502 },
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
