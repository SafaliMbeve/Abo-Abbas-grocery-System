import "server-only";

import Stripe from "stripe";
import { markOrderPaidAfterVerification } from "@/lib/payments/order";

let stripeClient: Stripe | undefined;

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing environment variable: STRIPE_SECRET_KEY");
  }

  stripeClient ??= new Stripe(secretKey);
  return stripeClient;
}

export async function markStripeOrderPaid(
  session: Stripe.Checkout.Session,
): Promise<{ orderNumber: string; inventoryIssue: boolean }> {
  const paymentReference =
    session.client_reference_id ?? session.metadata?.paymentReference;
  const transactionId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.id;

  if (
    !paymentReference ||
    !session.id ||
    session.mode !== "payment" ||
    session.payment_status !== "paid" ||
    session.amount_total === null ||
    !session.currency ||
    (session.metadata?.paymentReference !== undefined &&
      session.metadata.paymentReference !== paymentReference)
  ) {
    throw new Error("Stripe returned an incomplete or unpaid checkout session.");
  }

  return markOrderPaidAfterVerification({
    paymentReference,
    transactionId,
    amount: session.amount_total / 100,
    currency: session.currency,
    paymentProvider: "stripe",
  });
}
