import type { Metadata } from "next";
import { ArrowRight, CircleHelp, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { InfoLink, StoreInfoPage } from "@/components/StoreInfoPage";

export const metadata: Metadata = {
  title: "Help | Abo Abbas",
  description: "Get help with your Abo Abbas account, cart, order, or payment.",
};

const helpTopics = [
  {
    title: "I cannot sign in",
    description:
      "Use the sign-in option in the site header. If account verification or sign-in is not working, contact us with the email address on your account.",
  },
  {
    title: "My cart or checkout is not working",
    description:
      "Confirm that you are signed in, your cart contains available items, and the delivery and mobile-money details are complete. Mobile-money checkout currently requires a whole-kwacha total.",
  },
  {
    title: "My payment is pending or failed",
    description:
      "Check the payment status before retrying. If you already approved a payment, do not submit another one until the first attempt has been checked. Contact us with your order number and approximate payment time.",
  },
  {
    title: "I need help after placing an order",
    description:
      "Contact the shop with your order number and a short description of what happened. For an item issue, include photos if available.",
  },
];

export default function HelpPage() {
  return (
    <StoreInfoPage
      title="How can we help?"
      intro="Find quick troubleshooting steps or get in touch with the Abo Abbas team."
    >
      <div className="space-y-4">
        {helpTopics.map(({ title, description }) => (
          <section
            key={title}
            className="rounded-xl border border-black/[0.06] p-4 sm:p-5"
          >
            <h2 className="flex items-center gap-2 font-semibold text-dark">
              <CircleHelp
                aria-hidden="true"
                className="size-5 shrink-0 text-shop-dark-red"
              />
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-shop_light_text">
              {description}
            </p>
          </section>
        ))}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          href="tel:+260779233082"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-black/10 px-5 text-sm font-semibold text-dark transition-colors hover:bg-shop-light-bg"
        >
          <Phone aria-hidden="true" className="size-4 text-shop-dark-red" />
          Call +260 779 233 082
        </a>
        <a
          href="mailto:aboabbasshop@gmail.com"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-shop-dark-red px-5 text-sm font-semibold text-white transition-colors hover:bg-shop-dark-red/90"
        >
          <Mail aria-hidden="true" className="size-4" />
          Email the shop
        </a>
      </div>
      <p className="mt-5 text-center text-sm text-shop_light_text">
        Read our <InfoLink href="/faqs">FAQs</InfoLink> or visit the{" "}
        <Link
          href="/contact"
          className="inline-flex items-center gap-1 font-medium text-shop-dark-red underline decoration-shop-dark-red/30 underline-offset-4 hover:decoration-shop-dark-red"
        >
          Contact Us page <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
        .
      </p>
    </StoreInfoPage>
  );
}
