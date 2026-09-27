import type { Metadata } from "next";
import { InfoSection, StoreInfoPage } from "@/components/StoreInfoPage";
import { InfoLink } from "@/components/StoreInfoPage";

export const metadata: Metadata = {
  title: "About Us | Abo Abbas",
  description:
    "Learn about Abo Abbas, a Lusaka-based shop for everyday groceries and essentials.",
};

export default function AboutPage() {
  return (
    <StoreInfoPage
      title="About Us"
      intro="Abo Abbas is a local shop based in Makeni, Lusaka, Zambia, bringing everyday shopping together in one place."
    >
      <InfoSection title="What we offer">
        <p>
          Browse a range of everyday products, including fresh produce, meat,
          bakery items, skincare, toiletries, snacks, and other household
          essentials. Product availability and current prices are shown in the
          shop.
        </p>
        <p>
          We want it to be straightforward to find what you need, review your
          basket, and place an order online.
        </p>
      </InfoSection>
      <InfoSection title="Shopping with us">
        <p>
          Add products to your cart, check your order, and provide delivery and
          payment details at checkout. Online mobile-money payments are handled
          securely through Flutterwave, and card payments are processed by Stripe.
        </p>
        <p>
          Need help with a product or order? Visit our{" "}
          <InfoLink href="/contact">Contact Us</InfoLink> or{" "}
          <InfoLink href="/help">Help</InfoLink> page.
        </p>
      </InfoSection>
    </StoreInfoPage>
  );
}
