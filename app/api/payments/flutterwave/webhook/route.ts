import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import {
  getFlutterwaveSecretKey,
  markOrderPaid,
  markOrderPaymentFailed,
} from "@/lib/payments/flutterwave";

export const dynamic = "force-dynamic";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function POST(request: Request) {
  const webhookHash = process.env.FLUTTERWAVE_WEBHOOK_HASH;
  const suppliedHash = request.headers.get("verif-hash");
  if (!webhookHash || !suppliedHash) {
    return NextResponse.json({ error: "Webhook authentication failed." }, { status: 401 });
  }

  const expected = Buffer.from(webhookHash);
  const supplied = Buffer.from(suppliedHash);
  if (
    expected.length !== supplied.length ||
    !timingSafeEqual(expected, supplied)
  ) {
    return NextResponse.json({ error: "Webhook authentication failed." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
  }

  if (!isRecord(payload) || !isRecord(payload.data)) {
    return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
  }

  const paymentReference = payload.data.tx_ref;
  const transactionId = payload.data.id;
  const paymentStatus = payload.data.status;
  if (
    typeof paymentReference !== "string" ||
    (typeof transactionId !== "number" && typeof transactionId !== "string")
  ) {
    return NextResponse.json({ error: "Invalid payment reference." }, { status: 400 });
  }

  try {
    getFlutterwaveSecretKey();
    if (paymentStatus === "successful") {
      await markOrderPaid(paymentReference, String(transactionId));
    } else if (paymentStatus === "failed") {
      await markOrderPaymentFailed(paymentReference, String(transactionId));
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Flutterwave webhook payment verification failed:", error);
    return NextResponse.json(
      { error: "Payment verification failed." },
      { status: 502 },
    );
  }
}
