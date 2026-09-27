import { NextResponse } from "next/server";
import { getStripeClient, markStripeOrderPaid } from "@/lib/payments/stripe";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  const resultUrl = new URL("/checkout/complete?method=stripe", url.origin);

  if (!sessionId) {
    resultUrl.searchParams.set("status", "unverified");
    return NextResponse.redirect(resultUrl);
  }

  try {
    const session = await getStripeClient().checkout.sessions.retrieve(sessionId);
    if (session.id !== sessionId || session.payment_status !== "paid") {
      resultUrl.searchParams.set("status", "unverified");
      return NextResponse.redirect(resultUrl);
    }

    const result = await markStripeOrderPaid(session);
    const successfulUrl = new URL("/checkout/successful", url.origin);
    successfulUrl.searchParams.set("order", result.orderNumber);
    return NextResponse.redirect(successfulUrl);
  } catch (error) {
    console.error("Stripe return could not verify the payment:", error);
    resultUrl.searchParams.set("status", "unverified");
  }

  return NextResponse.redirect(resultUrl);
}
