import type { Metadata } from "next";
import { InfoSection, StoreInfoPage } from "@/components/StoreInfoPage";
import { InfoLink } from "@/components/StoreInfoPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Abo Abbas",
  description: "How Abo Abbas uses information when you browse and place orders.",
};

export default function PrivacyPage() {
  return (
    <StoreInfoPage
      title="Privacy Policy"
      intro="This page describes the information used to operate the Abo Abbas online shop, manage accounts, and process orders."
    >
      <div className="mb-6 rounded-xl border border-shop-orange/20 bg-shop-orange/5 p-4 text-sm leading-6 text-shop_light_text">
        This is a plain-language privacy policy draft, not legal advice. The
        store owner should confirm the final policy, retention periods, and
        applicable legal requirements before publishing it as final.
      </div>
      <InfoSection title="Information used">
        <p>
          When you browse, sign in, or place an order, the shop may use account
          details such as your name and email address; saved or submitted
          delivery addresses; phone number and selected mobile-money network;
          cart and order contents; and payment references and order status.
        </p>
        <p>
          The site also uses essential browser storage to remember your cart and
          may process technical request information needed to deliver and
          protect the service.
        </p>
      </InfoSection>
      <InfoSection title="Why the information is used">
        <p>
          Information is used to authenticate your account, display products and
          cart contents, prepare and deliver orders, communicate about order
          status, verify payments, maintain order records, and protect the
          website from misuse.
        </p>
        <p>
          If you subscribe to the newsletter, your email address and
          subscription status are stored in Sanity so the shop can manage its
          subscriber list. Signup is optional. The site currently collects
          subscriptions but does not automatically send newsletter campaigns.
          You can request removal by contacting the shop; removal requests are
          handled by the store.
        </p>
      </InfoSection>
      <InfoSection title="Service providers">
        <p>
          Account sign-in is provided by Clerk, product and order data are
          managed through Sanity, and online mobile-money payments are handled
          by Flutterwave and the selected payment network. These providers
          process information as needed to provide their services and under
          their own privacy terms.
        </p>
        <p>
          The checkout sends payment details to Flutterwave. Do not enter your
          mobile-money PIN on this website; only authorize a payment through the
          official provider or network flow presented to you.
        </p>
      </InfoSection>
      <InfoSection title="Sharing, security, and retention">
        <p>
          Order and delivery information is available to the store and relevant
          service providers for order handling, payment verification, and
          support. Information is not intentionally published as public content.
        </p>
        <p>
          Reasonable technical and organizational measures should be used to
          protect account and order information. No internet service can
          guarantee absolute security. Information is kept for as long as needed
          to operate the service, support orders, and meet applicable
          obligations; the store should define and document specific retention
          periods.
        </p>
      </InfoSection>
      <InfoSection title="Your questions and requests">
        <p>
          For questions about personal information associated with your
          account or an order, contact the store using the{" "}
          <InfoLink href="/contact">Contact Us</InfoLink> page and include
          enough detail for us to locate your request. We may need to verify
          your identity before acting on an account-related request.
        </p>
      </InfoSection>
    </StoreInfoPage>
  );
}
