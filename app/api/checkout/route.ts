import { randomUUID } from "node:crypto";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { Address, Product } from "@/sanity.types";
import { getFlutterwaveSecretKey } from "@/lib/payments/flutterwave";
import { markOrderPaidAfterVerification } from "@/lib/payments/order";
import { getStripeClient } from "@/lib/payments/stripe";
import { getSanityWriteClient } from "@/sanity/lib/writeClient";

export const dynamic = "force-dynamic";

type CartLine = { productId: string; quantity: number };
type DeliveryAddress = {
  name: string;
  address: string;
  city: string;
  state?: string;
  zip?: string;
};
type Network = "MTN" | "Airtel" | "Zamtel";
type PaymentMethod = "flutterwave" | "stripe" | "demo";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function validDeliveryAddress(value: unknown): DeliveryAddress | null {
  if (!isRecord(value)) return null;
  const address = {
    name: cleanText(value.name, 80),
    address: cleanText(value.address, 200),
    city: cleanText(value.city, 100),
    state: cleanText(value.state, 100),
    zip: cleanText(value.zip, 20),
  };
  return address.name && address.address && address.city ? address : null;
}

export async function POST(request: Request) {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!user || !email) {
    return NextResponse.json({ error: "Sign in with an email address to check out." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The checkout request was invalid." }, { status: 400 });
  }

  if (!isRecord(body) || !Array.isArray(body.items)) {
    return NextResponse.json({ error: "Your cart is empty or invalid." }, { status: 400 });
  }

  const requestedLines: CartLine[] = [];
  for (const line of body.items) {
    if (
      !isRecord(line) ||
      typeof line.productId !== "string" ||
      !line.productId.trim() ||
      typeof line.quantity !== "number" ||
      !Number.isInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > 99
    ) {
      return NextResponse.json({ error: "Your cart contains an invalid item." }, { status: 400 });
    }
    requestedLines.push({ productId: line.productId.trim(), quantity: line.quantity });
  }

  if (requestedLines.length === 0 || requestedLines.length > 50) {
    return NextResponse.json({ error: "Your cart is empty or has too many items." }, { status: 400 });
  }

  const requestedPaymentMethod = body.paymentMethod ?? "flutterwave";
  if (
    requestedPaymentMethod !== "flutterwave" &&
    requestedPaymentMethod !== "stripe" &&
    requestedPaymentMethod !== "demo"
  ) {
    return NextResponse.json(
      { error: "Choose a supported payment method." },
      { status: 400 },
    );
  }
  const paymentMethod: PaymentMethod = requestedPaymentMethod;
  if (
    paymentMethod === "demo" &&
    (process.env.NODE_ENV === "production" ||
      process.env.ENABLE_DEMO_PAYMENTS !== "true")
  ) {
    return NextResponse.json(
      { error: "Simulated payments are not enabled in this environment." },
      { status: 403 },
    );
  }

  const phoneDigits =
    typeof body.phone === "string" ? body.phone.replace(/\D/g, "") : "";
  if (
    paymentMethod === "flutterwave" &&
    (typeof body.phone !== "string" ||
      !/^\+?[0-9\s()-]{9,20}$/.test(body.phone.trim()) ||
      !/^\d{9,15}$/.test(phoneDigits) ||
      !["MTN", "Airtel", "Zamtel"].includes(String(body.network)))
  ) {
    return NextResponse.json(
      { error: "Enter a valid phone number and select a supported mobile-money network." },
      { status: 400 },
    );
  }

  let client;
  try {
    client = getSanityWriteClient();
    if (paymentMethod === "flutterwave") {
      getFlutterwaveSecretKey();
    } else if (paymentMethod === "stripe") {
      getStripeClient();
    }
  } catch (error) {
    console.error("Checkout configuration error:", error);
    return NextResponse.json(
      { error: "Online checkout is not configured yet. Please contact the store." },
      { status: 503 },
    );
  }

  let deliveryAddress: DeliveryAddress | null = null;
  if (typeof body.addressId === "string" && body.addressId) {
    const savedAddress = await client.fetch<Address | null>(
      `*[_type == "address" && _id == $addressId && email == $email][0]{
        _id, _type, _createdAt, _updatedAt, _rev, name, email, address, city, state, zip, default, createdAt
      }`,
      { addressId: body.addressId, email },
    );
    if (savedAddress?.address && savedAddress.city) {
      deliveryAddress = {
        name: user.fullName ?? savedAddress.name ?? email,
        address: savedAddress.address,
        city: savedAddress.city,
        state: savedAddress.state ?? "",
        zip: savedAddress.zip ?? "",
      };
    }
  } else {
    deliveryAddress = validDeliveryAddress(body.address);
  }

  if (!deliveryAddress) {
    return NextResponse.json(
      { error: "Choose one of your saved addresses or enter a valid delivery address." },
      { status: 400 },
    );
  }

  const quantities = new Map<string, number>();
  for (const line of requestedLines) {
    quantities.set(line.productId, (quantities.get(line.productId) ?? 0) + line.quantity);
  }
  const productIds = [...quantities.keys()];
  const products = await client.fetch<Product[]>(
    `*[_type == "product" && _id in $productIds]{
      _id, _type, _createdAt, _updatedAt, _rev, name, price, discount, stock
    }`,
    { productIds },
  );
  const productsById = new Map(products.map((product) => [product._id, product]));
  const orderLines: Array<{
    _key: string;
    _type: "object";
    product: { _type: "reference"; _ref: string };
    quantity: number;
    name: string;
    unitPrice: number;
  }> = [];
  let total = 0;
  let discount = 0;

  for (const [productId, quantity] of quantities) {
    const product = productsById.get(productId);
    const rawUnitPrice = Number(product?.price);
    const unitPrice = Math.round(rawUnitPrice * 100) / 100;
    if (
      !product ||
      !Number.isFinite(rawUnitPrice) ||
      rawUnitPrice <= 0 ||
      unitPrice <= 0
    ) {
      return NextResponse.json(
        { error: "A product in your cart is no longer available. Please refresh your cart." },
        { status: 409 },
      );
    }
    if (product.stock !== undefined && product.stock < quantity) {
      return NextResponse.json(
        { error: `${product.name ?? "A product"} does not have enough stock for this order.` },
        { status: 409 },
      );
    }

    const discountPercent = Math.max(0, Number(product.discount ?? 0));
    total += unitPrice * quantity;
    discount += (unitPrice * discountPercent * quantity) / 100;
    orderLines.push({
      _key: randomUUID(),
      _type: "object",
      product: { _type: "reference", _ref: productId },
      quantity,
      name: product.name ?? "Product",
      unitPrice,
    });
  }

  total = Math.round(total * 100) / 100;
  discount = Math.round(discount * 100) / 100;

  if (paymentMethod === "flutterwave" && !Number.isInteger(total)) {
    return NextResponse.json(
      { error: "Zambian mobile-money checkout currently requires a whole-kwacha order total." },
      { status: 400 },
    );
  }

  const paymentReference = `abo_${randomUUID()}`;
  const orderNumber = `AB-${randomUUID().slice(0, 8).toUpperCase()}`;
  const customerName =
    user.fullName?.trim() ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    email.split("@")[0];

  try {
    const order = await client.create({
      _type: "order",
      orderNumber,
      paymentProvider: paymentMethod,
      paymentReference,
      paymentStatus: "pending",
      clerkUserId: user.id,
      customerName,
      email,
      product: orderLines,
      totalPrice: total.toFixed(2),
      currency: "ZMW",
      amountDiscount: discount,
      address: deliveryAddress,
      ...(paymentMethod === "flutterwave"
        ? {
            deliveryPhone: phoneDigits,
            deliveryNetwork: body.network as Network,
          }
        : {}),
      status: "pending",
      orderDate: new Date().toISOString(),
      inventoryIssue: false,
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
    if (paymentMethod === "demo") {
      const result = await markOrderPaidAfterVerification({
        paymentReference,
        transactionId: `demo_${paymentReference}`,
        amount: total,
        currency: "ZMW",
        paymentProvider: "demo",
      });
      const completeUrl = new URL("/checkout/complete", siteUrl);
      completeUrl.searchParams.set("status", "paid");
      completeUrl.searchParams.set("method", "demo");
      completeUrl.searchParams.set("order", result.orderNumber);
      if (result.inventoryIssue) {
        completeUrl.searchParams.set("inventory", "review");
      }
      return NextResponse.json({ checkoutUrl: completeUrl.toString() });
    }

    if (paymentMethod === "stripe") {
      const stripe = getStripeClient();
      try {
        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          payment_method_types: ["card"],
          client_reference_id: paymentReference,
          customer_email: email,
          metadata: { paymentReference, orderNumber },
          line_items: orderLines.map((line) => ({
            quantity: line.quantity,
            price_data: {
              currency: "zmw",
              unit_amount: Math.round(line.unitPrice * 100),
              product_data: { name: line.name },
            },
          })),
          success_url: new URL(
            "/checkout/successful?session_id={CHECKOUT_SESSION_ID}",
            siteUrl,
          ).toString(),
          cancel_url: new URL(
            "/checkout/complete?status=cancelled&method=stripe",
            siteUrl,
          ).toString(),
        });

        if (!session.url) {
          throw new Error("Stripe did not return a hosted checkout URL.");
        }

        await client
          .patch(order._id)
          .set({ stripeCheckoutSessionId: session.id })
          .commit();
        return NextResponse.json({ checkoutUrl: session.url });
      } catch (error) {
        await client
          .patch(order._id)
          .set({ paymentStatus: "failed", status: "cancelled" })
          .commit();
        console.error("Stripe checkout initialization failed:", error);
        return NextResponse.json(
          { error: "Your card payment could not be started. Please try again." },
          { status: 502 },
        );
      }
    }

    const callbackUrl = new URL("/api/payments/flutterwave/callback", siteUrl);
    const response = await fetch(
      "https://api.flutterwave.com/v3/charges?type=mobile_money_zambia",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getFlutterwaveSecretKey()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          currency: "ZMW",
          email,
          tx_ref: paymentReference,
          network: body.network,
          phone_number: phoneDigits,
          fullname: customerName,
          order_id: orderNumber,
          meta: { orderNumber },
          redirect_url: callbackUrl.toString(),
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(15_000),
      },
    );
    const payload: unknown = await response.json();
    const redirect =
      isRecord(payload) &&
      isRecord(payload.meta) &&
      isRecord(payload.meta.authorization) &&
      typeof payload.meta.authorization.redirect === "string"
        ? payload.meta.authorization.redirect
        : null;
    const providerStatus =
      isRecord(payload) && typeof payload.status === "string"
        ? payload.status
        : "unknown";
    const providerMessage =
      isRecord(payload) && typeof payload.message === "string"
        ? payload.message.slice(0, 200)
        : "No provider message returned.";

    let safeRedirect: URL | null = null;
    if (redirect) {
      try {
        const parsedRedirect = new URL(redirect);
        if (
          parsedRedirect.protocol === "https:" &&
          parsedRedirect.hostname.endsWith(".flutterwave.com")
        ) {
          safeRedirect = parsedRedirect;
        }
      } catch {
        safeRedirect = null;
      }
    }

    if (!response.ok || !safeRedirect) {
      if (!response.ok) {
        await client
          .patch(order._id)
          .set({ paymentStatus: "failed", status: "cancelled" })
          .commit();
      }
      console.error("Flutterwave checkout initialization failed.", {
        httpStatus: response.status,
        providerStatus,
        providerMessage,
        authorizationRedirectPresent: Boolean(safeRedirect),
      });
      return NextResponse.json(
        {
          error: response.ok
            ? "The payment service accepted the request but did not return a confirmation link. Check your order before trying again."
            : "Your payment could not be started. Please try again.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ checkoutUrl: safeRedirect.toString() });
  } catch (error) {
    console.error("Could not create checkout order:", error);
    return NextResponse.json(
      { error: "Your order could not be created. Please try again." },
      { status: 500 },
    );
  }
}
