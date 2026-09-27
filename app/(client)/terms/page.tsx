import type { Metadata } from "next";
import { InfoSection, StoreInfoPage } from "@/components/StoreInfoPage";
import { InfoLink } from "@/components/StoreInfoPage";

export const metadata: Metadata = {
  title: "Terms and Conditions | Abo Abbas",
  description: "Terms for shopping with Abo Abbas online.",
};

export default function TermsPage() {
  return (
    <StoreInfoPage
      title="Terms and Conditions"
      intro="These terms explain the basics of using the Abo Abbas online shop and placing an order. Please review them before checkout."
    >
      <div className="mb-6 rounded-xl border border-shop-orange/20 bg-shop-orange/5 p-4 text-sm leading-6 text-shop_light_text">
        This is a general store policy draft, not legal advice. The store owner
        should review it for compliance with applicable Zambian consumer and
        e-commerce requirements before relying on it as a final legal document.
      </div>
      <InfoSection title="Using the shop">
        <p>
          Use the website lawfully and provide accurate account, delivery, and
          contact details when placing an order. You are responsible for keeping
          access to your account secure and for activity carried out through it.
        </p>
      </InfoSection>
      <InfoSection title="Products, prices, and availability">
        <p>
          Product descriptions, displayed prices, and stock availability may
          change. The shop checks current product information and stock when an
          order is submitted. If an item is unavailable or there is an issue
          with an order, we will contact you using the details provided.
        </p>
        <p>
          Prices are displayed in Zambian kwacha (ZMW). This mobile-money
          checkout currently accepts whole-kwacha order totals; the checkout
          page will indicate if your total needs adjustment.
        </p>
      </InfoSection>
      <InfoSection title="Orders and payment">
        <p>
          Submitting an order starts the payment process but does not by itself
          confirm successful payment. An order is marked paid only after
          Flutterwave confirms the transaction. Do not submit payment again if
          you are unsure whether a previous attempt completed; contact us with
          your order details first.
        </p>
        <p>
          Online mobile-money payments are routed through Flutterwave and the
          selected MTN, Airtel, or Zamtel network. Follow the provider&apos;s
          instructions to authorize payment on your phone.
        </p>
      </InfoSection>
      <InfoSection title="Delivery, changes, and order issues">
        <p>
          Provide a complete delivery address and a reachable phone number.
          Delivery availability, any applicable charges, and timing should be
          confirmed with the store before ordering; they are not guaranteed by
          this page.
        </p>
        <p>
          For a change, cancellation, missing item, or concern about the
          condition of an order, contact us as soon as possible. Any remedy will
          depend on the circumstances and applicable consumer requirements.
        </p>
      </InfoSection>
      <InfoSection title="Contact and updates">
        <p>
          These terms may be updated as the shop changes. Questions about an
          order or these terms can be sent through the{" "}
          <InfoLink href="/contact">Contact Us</InfoLink> page.
        </p>
      </InfoSection>
    </StoreInfoPage>
  );
}
