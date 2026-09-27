"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { ArrowLeft, ArrowRight, Check, LockKeyhole, MapPin, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import NoAccessToCart from "@/components/NoAccessToCart";
import PriceFormatter from "@/components/PriceFormatter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Title } from "@/components/ui/text";
import type { Address } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import useStore from "@/store";

type DeliveryAddress = {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

const CheckoutPage = () => {
  const groupedItems = useStore((state) => state.getGroupedItems());
  const getTotalPrice = useStore((state) => state.getTotalPrice);
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [addressResult, setAddressResult] = useState<{
    email: string;
    addresses: Address[];
    selectedAddressId?: string;
    error?: boolean;
  } | null>(null);
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [deliveryNetwork, setDeliveryNetwork] = useState("MTN");
  const [demoCardNumber, setDemoCardNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "flutterwave" | "stripe" | "demo"
  >(
    "flutterwave",
  );
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const demoPaymentsEnabled =
    process.env.NEXT_PUBLIC_ENABLE_DEMO_PAYMENTS === "true";

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const currentAddressResult =
    addressResult?.email === userEmail ? addressResult : null;
  const addresses = currentAddressResult?.addresses ?? [];
  const loadingAddresses = Boolean(userEmail) && !currentAddressResult;
  const selectedAddressId = currentAddressResult?.selectedAddressId;
  const enteringAddress =
    useCustomAddress || (!loadingAddresses && addresses.length === 0);

  useEffect(() => {
    let cancelled = false;

    if (!userEmail) return;

    const fetchAddresses = async () => {
      try {
        const response = await fetch("/api/addresses", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Address request failed with status ${response.status}.`);
        }

        const data: Address[] = await response.json();
        if (cancelled) return;

        const preferredAddress =
          data.find((address) => address.default) ?? data[0];
        setAddressResult({
          email: userEmail,
          addresses: data,
          selectedAddressId: preferredAddress?._id,
        });
      } catch (error) {
        if (!cancelled) {
          console.error("Address fetching error:", error);
          setAddressResult({ email: userEmail, addresses: [], error: true });
          toast.error("Could not load your saved addresses.");
        }
      }
    };

    void fetchAddresses();

    return () => {
      cancelled = true;
    };
  }, [userEmail]);

  const total = getTotalPrice();
  const discount = groupedItems.reduce((amount, { product, quantity }) => {
    const price = Number(product.price ?? 0);
    const discountPercent = Math.max(0, Number(product.discount ?? 0));
    return amount + (price * discountPercent * quantity) / 100;
  }, 0);
  const subtotal = total + discount;
  const canPayWholeKwacha = Number.isInteger(Math.round(total * 100) / 100);

  const handleCheckout = async () => {
    if (groupedItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (paymentMethod === "flutterwave" && !deliveryPhone.trim()) {
      toast.error("Enter the mobile-money phone number for this order.");
      return;
    }

    if (paymentMethod === "demo" && !demoCardNumber.trim()) {
      toast.error("Enter any dummy card number to continue.");
      return;
    }

    if (!enteringAddress && !selectedAddressId) {
      toast.error("Choose or enter a delivery address.");
      return;
    }

    if (
      enteringAddress &&
      (!deliveryAddress.name.trim() ||
        !deliveryAddress.address.trim() ||
        !deliveryAddress.city.trim())
    ) {
      toast.error("Complete the recipient, street address, and city.");
      return;
    }

    if (paymentMethod === "flutterwave" && !canPayWholeKwacha) {
      toast.error("Zambian mobile-money checkout requires a whole-kwacha total.");
      return;
    }

    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: groupedItems.map(({ product, quantity }) => ({
            productId: product._id,
            quantity,
          })),
          paymentMethod,
          ...(paymentMethod === "flutterwave"
            ? { phone: deliveryPhone, network: deliveryNetwork }
            : {}),
          ...(enteringAddress
            ? { address: deliveryAddress }
            : { addressId: selectedAddressId }),
        }),
      });
      const result: { checkoutUrl?: string; error?: string } = await response.json();

      if (!response.ok || !result.checkoutUrl) {
        throw new Error(result.error ?? "Checkout could not be started.");
      }

      window.location.assign(result.checkoutUrl);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Checkout could not be started.",
      );
      setIsCheckingOut(false);
    }
  };

  if (isSignedIn !== true) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-shop-light-bg py-10 sm:py-14">
        <NoAccessToCart />
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-shop-light-bg py-8 sm:py-10 lg:py-14">
      <Container>
        {groupedItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Link
                  href="/cart"
                  className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-shop_light_text transition-colors hover:text-shop-dark-red"
                >
                  <ArrowLeft aria-hidden="true" className="size-4" />
                  Back to cart
                </Link>
                <Title>Checkout</Title>
                <p className="mt-1 text-sm text-shop_light_text">
                  Confirm your delivery details and choose how you&apos;d like to pay.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 self-start rounded-full bg-shop-dark-green/10 px-4 py-2 text-sm font-medium text-shop-dark-green sm:self-auto">
                <LockKeyhole aria-hidden="true" className="size-4" />
                Secure checkout
              </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
              <div className="space-y-6 lg:col-span-2">
                <section className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-shop-dark-red/[0.07] text-shop-dark-red">
                      <MapPin aria-hidden="true" className="size-5" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-dark">Delivery address</h2>
                      <p className="text-sm text-shop_light_text">
                        Where should we deliver your order?
                      </p>
                    </div>
                  </div>

                  {loadingAddresses ? (
                    <p className="text-sm text-shop_light_text">
                      Loading saved addresses…
                    </p>
                  ) : addresses.length > 0 && !enteringAddress ? (
                    <RadioGroup
                      value={selectedAddressId}
                      onValueChange={(value) =>
                        setAddressResult((previous) =>
                          previous && previous.email === userEmail
                            ? {
                                ...previous,
                                selectedAddressId: value ?? undefined,
                              }
                            : previous,
                        )
                      }
                      className="gap-3"
                    >
                      {addresses.map((address) => (
                        <Label
                          key={address._id}
                          htmlFor={`checkout-address-${address._id}`}
                          className="flex cursor-pointer items-start gap-3 rounded-xl border border-black/[0.06] p-4 transition-colors hover:border-shop-dark-red/30"
                        >
                          <RadioGroupItem
                            id={`checkout-address-${address._id}`}
                            value={address._id}
                            className="mt-0.5"
                          />
                          <span className="grid min-w-0 gap-1">
                            <span className="font-medium text-dark">
                              {address.name ?? "Saved address"}
                              {address.default && (
                                <span className="ml-2 text-xs font-normal text-shop-dark-red">
                                  Default
                                </span>
                              )}
                            </span>
                            <span className="text-sm leading-5 text-shop_light_text">
                              {[
                                address.address,
                                address.city,
                                address.state,
                                address.zip,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </span>
                        </Label>
                      ))}
                    </RadioGroup>
                  ) : null}

                  {addresses.length > 0 && !enteringAddress && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setUseCustomAddress(true)}
                      className="mt-4 rounded-full"
                    >
                      Use a different address
                    </Button>
                  )}

                  {enteringAddress && (
                    <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="checkout-name">Recipient name</Label>
                        <Input
                          id="checkout-name"
                          autoComplete="name"
                          value={deliveryAddress.name}
                          onChange={(event) =>
                            setDeliveryAddress((address) => ({
                              ...address,
                              name: event.target.value,
                            }))
                          }
                          placeholder={user?.fullName ?? "Full name"}
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="checkout-street">Street address</Label>
                        <Input
                          id="checkout-street"
                          autoComplete="street-address"
                          value={deliveryAddress.address}
                          onChange={(event) =>
                            setDeliveryAddress((address) => ({
                              ...address,
                              address: event.target.value,
                            }))
                          }
                          placeholder="House, road, or area"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkout-city">City or town</Label>
                        <Input
                          id="checkout-city"
                          autoComplete="address-level2"
                          value={deliveryAddress.city}
                          onChange={(event) =>
                            setDeliveryAddress((address) => ({
                              ...address,
                              city: event.target.value,
                            }))
                          }
                          placeholder="Lusaka"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkout-province">Province (optional)</Label>
                        <Input
                          id="checkout-province"
                          autoComplete="address-level1"
                          value={deliveryAddress.state}
                          onChange={(event) =>
                            setDeliveryAddress((address) => ({
                              ...address,
                              state: event.target.value,
                            }))
                          }
                          placeholder="Province"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkout-postal">Postal code (optional)</Label>
                        <Input
                          id="checkout-postal"
                          autoComplete="postal-code"
                          value={deliveryAddress.zip}
                          onChange={(event) =>
                            setDeliveryAddress((address) => ({
                              ...address,
                              zip: event.target.value,
                            }))
                          }
                          placeholder="Postal code"
                        />
                      </div>
                      {addresses.length > 0 && (
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setUseCustomAddress(false)}
                            className="w-full rounded-full"
                          >
                            Choose a saved address
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {currentAddressResult?.error && (
                    <p role="alert" className="mt-4 text-sm text-destructive">
                      Saved addresses could not be loaded. Enter a delivery address to continue.
                    </p>
                  )}
                  {addresses.length === 0 &&
                    !loadingAddresses &&
                    !currentAddressResult?.error && (
                      <p className="mt-4 text-sm text-shop_light_text">
                        No saved addresses found. Enter a delivery address above.
                      </p>
                    )}
                </section>

                <section className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-shop-dark-red/[0.07] text-shop-dark-red">
                      <LockKeyhole aria-hidden="true" className="size-5" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-dark">Payment method</h2>
                      <p className="text-sm text-shop_light_text">
                        Choose mobile money or pay securely by card with Stripe.
                      </p>
                    </div>
                  </div>

                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => {
                      if (
                        value === "flutterwave" ||
                        value === "stripe" ||
                        (value === "demo" && demoPaymentsEnabled)
                      ) {
                        setPaymentMethod(value);
                      }
                    }}
                    aria-label="Payment method"
                    className="grid gap-3 sm:grid-cols-2"
                  >
                    <Label
                      htmlFor="payment-method-flutterwave"
                      className="flex cursor-pointer items-start gap-3 rounded-xl border border-black/[0.06] p-4 transition-colors hover:border-shop-dark-red/30"
                    >
                      <RadioGroupItem
                        id="payment-method-flutterwave"
                        value="flutterwave"
                        className="mt-0.5"
                      />
                      <span className="grid gap-1">
                        <span className="font-medium text-dark">Mobile money</span>
                        <span className="text-sm text-shop_light_text">
                          MTN, Airtel, or Zamtel via Flutterwave
                        </span>
                      </span>
                    </Label>
                    <Label
                      htmlFor="payment-method-stripe"
                      className="flex cursor-pointer items-start gap-3 rounded-xl border border-black/[0.06] p-4 transition-colors hover:border-shop-dark-red/30"
                    >
                      <RadioGroupItem
                        id="payment-method-stripe"
                        value="stripe"
                        className="mt-0.5"
                      />
                      <span className="grid gap-1">
                        <span className="font-medium text-dark">Credit or debit card</span>
                        <span className="text-sm text-shop_light_text">
                          Secure card checkout with Stripe
                        </span>
                      </span>
                    </Label>
                    {demoPaymentsEnabled && (
                      <Label
                        htmlFor="payment-method-demo"
                        className="flex cursor-pointer items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 transition-colors hover:border-amber-400"
                      >
                        <RadioGroupItem
                          id="payment-method-demo"
                          value="demo"
                          className="mt-0.5"
                        />
                        <span className="grid gap-1">
                          <span className="font-medium text-dark">
                            School demo (simulated)
                          </span>
                          <span className="text-sm text-shop_light_text">
                            Accepts any input; does not charge a card.
                          </span>
                        </span>
                      </Label>
                    )}
                  </RadioGroup>

                  {paymentMethod === "demo" ? (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="demo-card-number">Dummy card number</Label>
                      <Input
                        id="demo-card-number"
                        type="text"
                        inputMode="text"
                        autoComplete="off"
                        value={demoCardNumber}
                        onChange={(event) => setDemoCardNumber(event.target.value)}
                        placeholder="Enter any dummy value"
                      />
                      <p className="text-sm leading-5 text-amber-800">
                        Simulated school-project payment only. No payment is made,
                        and this value is never sent or saved. Do not enter a real
                        card number.
                      </p>
                    </div>
                  ) : paymentMethod === "flutterwave" ? (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="checkout-phone">Mobile-money phone number</Label>
                        <Input
                          id="checkout-phone"
                          type="tel"
                          autoComplete="tel"
                          value={deliveryPhone}
                          onChange={(event) => setDeliveryPhone(event.target.value)}
                          placeholder="+260 97 123 4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkout-network">Network</Label>
                        <select
                          id="checkout-network"
                          value={deliveryNetwork}
                          onChange={(event) => setDeliveryNetwork(event.target.value)}
                          className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm text-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="MTN">MTN</option>
                          <option value="Airtel">Airtel</option>
                          <option value="Zamtel">Zamtel</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm leading-5 text-shop_light_text">
                      You&apos;ll be redirected to Stripe to enter your card details. Your total is charged in ZMW.
                    </p>
                  )}
                  {!userEmail && (
                    <p className="mt-4 text-sm text-shop_light_text">
                      Add an email address to your account before checking out.
                    </p>
                  )}
                </section>
              </div>

              <aside className="space-y-5 lg:sticky lg:top-24">
                <section className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-lg font-semibold text-dark">Your order</h2>
                  <div className="mt-4 max-h-72 space-y-4 overflow-y-auto pr-1">
                    {groupedItems.map(({ product, quantity }) => {
                      const image = product.images?.[0];
                      return (
                        <div key={product._id} className="flex items-center gap-3">
                          <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-shop-light-bg p-1">
                            {image?.asset ? (
                              <Image
                                src={urlFor(image).url()}
                                alt={product.name ?? "Product image"}
                                fill
                                sizes="56px"
                                className="object-contain p-1"
                              />
                            ) : (
                              <ShoppingBag
                                aria-hidden="true"
                                className="size-5 text-shop_light_text"
                              />
                            )}
                            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-dark text-[10px] font-semibold text-white">
                              {quantity}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-medium text-dark">
                              {product.name ?? "Product"}
                            </p>
                            <PriceFormatter
                              amount={Number(product.price ?? 0) * quantity}
                              className="mt-1 text-sm font-semibold"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 space-y-3 border-t border-black/[0.06] pt-4">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-shop_light_text">Subtotal</span>
                      <PriceFormatter amount={subtotal} />
                    </div>
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-shop_light_text">Discount</span>
                      <PriceFormatter
                        amount={discount}
                        className="text-shop-dark-green"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4 border-t border-black/[0.06] pt-3">
                      <span className="font-semibold text-dark">Total</span>
                      <PriceFormatter
                        amount={total}
                        className="text-lg font-bold text-shop-dark-red"
                      />
                    </div>
                    {paymentMethod === "flutterwave" && !canPayWholeKwacha && (
                      <p className="text-sm leading-5 text-destructive">
                        Mobile-money checkout requires a whole-kwacha total. Adjust quantities or items in your cart.
                      </p>
                    )}
                    <Button
                      type="button"
                      size="lg"
                      onClick={handleCheckout}
                      disabled={
                        isCheckingOut ||
                        loadingAddresses ||
                        !userEmail ||
                        (paymentMethod === "flutterwave" && !canPayWholeKwacha) ||
                        (!enteringAddress && !selectedAddressId)
                      }
                      className="w-full rounded-full"
                    >
                      {isCheckingOut ? "Starting secure checkout…" : "Continue to payment"}
                      <ArrowRight aria-hidden="true" />
                    </Button>
                    <p className="text-center text-xs leading-5 text-shop_light_text">
                      {paymentMethod === "stripe"
                        ? "Card payments are securely processed by Stripe."
                        : "Mobile-money payments are securely processed by Flutterwave."}
                    </p>
                    <div className="flex justify-center">
                      <Link
                        href="/cart"
                        className="inline-flex items-center gap-1 text-sm font-medium text-shop_light_text transition-colors hover:text-shop-dark-red"
                      >
                        <Check aria-hidden="true" className="size-4" />
                        Edit items in cart
                      </Link>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default CheckoutPage;
