import { NextResponse } from "next/server";
import {
  markOrderPaid,
  markOrderPaymentFailed,
} from "@/lib/payments/flutterwave";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const paymentReference = url.searchParams.get("tx_ref");
  const transactionId = url.searchParams.get("transaction_id");
  const providerStatus = url.searchParams.get("status");
  const resultUrl = new URL("/checkout/complete", url.origin);

  if (!paymentReference || !transactionId || !providerStatus) {
    resultUrl.searchParams.set("status", "unverified");
    return NextResponse.redirect(resultUrl);
  }

  try {
    if (providerStatus === "successful") {
      const result = await markOrderPaid(paymentReference, transactionId);
      resultUrl.searchParams.set("status", "paid");
      resultUrl.searchParams.set("order", result.orderNumber);
      if (result.inventoryIssue) {
        resultUrl.searchParams.set("inventory", "review");
      }
    } else if (providerStatus === "failed") {
      await markOrderPaymentFailed(paymentReference, transactionId);
      resultUrl.searchParams.set("status", "failed");
    } else {
      resultUrl.searchParams.set("status", "unverified");
    }
  } catch (error) {
    console.error("Flutterwave return could not verify the payment:", error);
    resultUrl.searchParams.set("status", "unverified");
  }

  return NextResponse.redirect(resultUrl);
}
