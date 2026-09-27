import type { Metadata } from "next";
import { InfoLink, StoreInfoPage } from "@/components/StoreInfoPage";

export const metadata: Metadata = {
  title: "FAQs | Abo Abbas",
  description: "Answers to common questions about shopping with Abo Abbas.",
};

const questions = [
  {
    question: "How do I place an order?",
    answer:
      "Browse the shop, add products to your cart, continue to checkout, then choose a delivery address and payment method. Review your order before continuing to the payment provider.",
  },
  {
    question: "Which payment methods are supported online?",
    answer:
      "Checkout supports MTN, Airtel, and Zamtel mobile money through Flutterwave, as well as credit and debit cards through Stripe. Availability depends on the provider and your payment account.",
  },
  {
    question: "Why does checkout require a whole-kwacha total?",
    answer:
      "The current Zambian mobile-money integration accepts whole ZMW amounts. If your cart total includes ngwee, adjust product quantities or items until the displayed total is a whole number of kwacha.",
  },
  {
    question: "When is my order confirmed?",
    answer:
      "The store confirms an order as paid only after Flutterwave or Stripe verifies the payment. If you completed a payment but the order page does not confirm it, wait briefly and contact the store with your order number. Do not immediately pay a second time.",
  },
  {
    question: "Can I change or cancel an order?",
    answer:
      "Contact the store as soon as possible with your order number. Changes or cancellations depend on the order's progress and whether payment or preparation has already started.",
  },
  {
    question: "What if a product is unavailable or there is a problem with delivery?",
    answer:
      "The shop checks stock when you submit checkout. If there is an availability issue, or you have a delivery concern, contact the store so the order can be reviewed.",
  },
  {
    question: "How do I report an incorrect or damaged item?",
    answer:
      "Contact the store promptly after delivery, provide your order number, describe the issue, and include clear photos where helpful. The store will review the issue and respond.",
  },
];

export default function FAQsPage() {
  return (
    <StoreInfoPage
      title="Frequently Asked Questions"
      intro="Quick answers to common questions about browsing, ordering, payment, and getting support."
    >
      <div className="divide-y divide-black/[0.06]">
        {questions.map(({ question, answer }) => (
          <details key={question} className="group py-4 first:pt-0 last:pb-0">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-dark marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shop-dark-red">
              {question}
              <span
                aria-hidden="true"
                className="text-xl font-normal text-shop-dark-red transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 pr-8 text-sm leading-6 text-shop_light_text">
              {answer}
            </p>
          </details>
        ))}
      </div>
      <p className="mt-7 border-t border-black/[0.06] pt-5 text-sm leading-6 text-shop_light_text">
        Still need help?{" "}
        <InfoLink href="/contact">Contact our shop</InfoLink> and include your
        order number if you have one.
      </p>
    </StoreInfoPage>
  );
}
