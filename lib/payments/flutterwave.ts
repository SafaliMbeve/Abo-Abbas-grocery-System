import "server-only";

import { markOrderPaidAfterVerification } from "@/lib/payments/order";
import { getSanityWriteClient } from "@/sanity/lib/writeClient";

const FLUTTERWAVE_API = "https://api.flutterwave.com/v3";

type FlutterwaveTransaction = {
  id: number | string;
  tx_ref: string;
  status: string;
  amount: number;
  currency: string;
};

type OrderForPayment = {
  _id: string;
  _rev: string;
  orderNumber: string;
  paymentProvider?: string;
  paymentStatus?: string;
  paymentReference: string;
  totalPrice: string;
  currency: string;
  inventoryIssue?: boolean;
  product?: Array<{ productId?: string; quantity?: number }>;
};

export function getFlutterwaveSecretKey() {
  const key = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!key) {
    throw new Error("Missing environment variable: FLUTTERWAVE_SECRET_KEY");
  }
  return key;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function verifyFlutterwaveTransaction(
  transactionId: string,
): Promise<FlutterwaveTransaction> {
  const response = await fetch(
    `${FLUTTERWAVE_API}/transactions/${encodeURIComponent(transactionId)}/verify`,
    {
      headers: { Authorization: `Bearer ${getFlutterwaveSecretKey()}` },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    },
  );
  const payload: unknown = await response.json();

  if (!response.ok || !isRecord(payload) || !isRecord(payload.data)) {
    throw new Error(`Flutterwave transaction verification failed (${response.status}).`);
  }

  const transaction = payload.data;
  if (
    (typeof transaction.id !== "number" && typeof transaction.id !== "string") ||
    typeof transaction.tx_ref !== "string" ||
    typeof transaction.status !== "string" ||
    typeof transaction.amount !== "number" ||
    typeof transaction.currency !== "string"
  ) {
    throw new Error("Flutterwave returned an invalid transaction verification response.");
  }

  return transaction as FlutterwaveTransaction;
}

export async function markOrderPaid(
  paymentReference: string,
  transactionId: string,
): Promise<{ orderNumber: string; inventoryIssue: boolean }> {
  const transaction = await verifyFlutterwaveTransaction(transactionId);
  if (
    String(transaction.id) !== transactionId ||
    transaction.tx_ref !== paymentReference ||
    transaction.status !== "successful"
  ) {
    throw new Error("Flutterwave returned a transaction that does not match this payment.");
  }

  return markOrderPaidAfterVerification({
    paymentReference,
    transactionId,
    amount: transaction.amount,
    currency: transaction.currency,
    paymentProvider: "flutterwave",
  });
}

export async function markOrderPaymentFailed(
  paymentReference: string,
  transactionId: string,
) {
  const client = getSanityWriteClient();
  const order = await client.fetch<OrderForPayment | null>(
    `*[_type == "order" && paymentReference == $paymentReference][0]{
      _id, _rev, orderNumber, paymentStatus, paymentReference, totalPrice, currency
    }`,
    { paymentReference },
  );
  if (!order) throw new Error("No order was found for this payment reference.");

  const transaction = await verifyFlutterwaveTransaction(transactionId);
  if (
    String(transaction.id) !== transactionId ||
    transaction.tx_ref !== paymentReference ||
    transaction.status !== "failed" ||
    transaction.currency.toUpperCase() !== order.currency.toUpperCase() ||
    Math.round(transaction.amount * 100) !==
      Math.round(Number(order.totalPrice) * 100)
  ) {
    throw new Error("The failed payment does not match this order.");
  }

  if (order.paymentStatus !== "pending") return;
  await client
    .transaction()
    .patch(order._id, (patch) =>
      patch.ifRevisionId(order._rev).set({
        status: "cancelled",
        paymentStatus: "failed",
      }),
    )
    .commit();
}
