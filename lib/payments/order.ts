import "server-only";

import { getSanityWriteClient } from "@/sanity/lib/writeClient";

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

type ProductStock = {
  _id: string;
  _rev: string;
  stock?: number;
};

export async function markOrderPaidAfterVerification({
  paymentReference,
  transactionId,
  amount,
  currency,
  paymentProvider,
}: {
  paymentReference: string;
  transactionId: string;
  amount: number;
  currency: string;
  paymentProvider: "flutterwave" | "stripe" | "demo";
}): Promise<{ orderNumber: string; inventoryIssue: boolean }> {
  const client = getSanityWriteClient();
  const order = await client.fetch<OrderForPayment | null>(
    `*[_type == "order" && paymentReference == $paymentReference][0]{
      _id, _rev, orderNumber, paymentProvider, paymentStatus, paymentReference, totalPrice, currency,
      inventoryIssue,
      product[]{quantity, "productId": product._ref}
    }`,
    { paymentReference },
  );

  if (!order) throw new Error("No order was found for this payment reference.");

  const expectedAmount = Number(order.totalPrice);
  if (
    (order.paymentProvider && order.paymentProvider !== paymentProvider) ||
    !Number.isFinite(expectedAmount) ||
    !Number.isFinite(amount) ||
    Math.round(amount * 100) !== Math.round(expectedAmount * 100) ||
    currency.toUpperCase() !== order.currency.toUpperCase()
  ) {
    throw new Error("The verified payment does not match this order.");
  }

  if (order.paymentStatus === "paid") {
    return {
      orderNumber: order.orderNumber,
      inventoryIssue: order.inventoryIssue === true,
    };
  }

  const trackedProducts = (order.product ?? []).filter(
    (item): item is { productId: string; quantity: number } =>
      typeof item.productId === "string" &&
      typeof item.quantity === "number" &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0,
  );
  const stockIds = trackedProducts.map((item) => item.productId);
  const products =
    stockIds.length > 0
      ? await client.fetch<ProductStock[]>(
          `*[_id in $ids]{_id, _rev, stock}`,
          { ids: stockIds },
        )
      : [];
  const stockById = new Map(products.map((product) => [product._id, product]));
  const inventoryIssue = trackedProducts.some((item) => {
    const product = stockById.get(item.productId);
    return (
      !product ||
      (product.stock !== undefined &&
        (!Number.isFinite(product.stock) || product.stock < item.quantity))
    );
  });

  const transactionUpdate = client
    .transaction()
    .patch(order._id, (patch) =>
      patch.ifRevisionId(order._rev).set({
        status: inventoryIssue ? "processing" : "paid",
        paymentStatus: "paid",
        paymentTransactionId: transactionId,
        paidAt: new Date().toISOString(),
        inventoryIssue,
      }),
    );

  if (!inventoryIssue) {
    for (const item of trackedProducts) {
      const product = stockById.get(item.productId);
      if (product?.stock !== undefined) {
        transactionUpdate.patch(item.productId, (patch) =>
          patch.ifRevisionId(product._rev).inc({ stock: -item.quantity }),
        );
      }
    }
  }

  try {
    await transactionUpdate.commit();
  } catch (error) {
    const latestOrder = await client.fetch<OrderForPayment | null>(
      `*[_type == "order" && _id == $id][0]{_id, _rev, orderNumber, paymentStatus, paymentReference, totalPrice, currency, inventoryIssue}`,
      { id: order._id },
    );
    if (latestOrder?.paymentStatus === "paid") {
      return {
        orderNumber: latestOrder.orderNumber,
        inventoryIssue: latestOrder.inventoryIssue === true,
      };
    }
    throw error;
  }

  if (inventoryIssue) {
    console.error(
      `Paid order ${order.orderNumber} needs inventory review before fulfillment.`,
    );
  }

  return { orderNumber: order.orderNumber, inventoryIssue };
}
