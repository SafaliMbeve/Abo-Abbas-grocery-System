import type { Metadata } from "next";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { InfoSection, StoreInfoPage } from "@/components/StoreInfoPage";

export const metadata: Metadata = {
  title: "Contact Us | Abo Abbas",
  description: "Contact the Abo Abbas team in Makeni, Lusaka, Zambia.",
};

const contactMethods = [
  {
    label: "Call",
    value: "+260 779 233 082",
    href: "tel:+260779233082",
    icon: Phone,
  },
  {
    label: "Email",
    value: "aboabbasshop@gmail.com",
    href: "mailto:aboabbasshop@gmail.com",
    icon: Mail,
  },
] as const;

export default function ContactPage() {
  return (
    <StoreInfoPage
      title="Contact Us"
      intro="Questions about a product, delivery, or an order? Get in touch and include your order number if you already placed an order."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {contactMethods.map(({ label, value, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            className="flex items-start gap-3 rounded-xl border border-black/6 p-4 transition-colors hover:border-shop-dark-red/30 hover:bg-shop-light-bg"
          >
            <Icon aria-hidden="true" className="mt-0.5 size-5 text-shop-dark-red" />
            <span>
              <span className="block text-sm text-shop_light_text">{label}</span>
              <span className="mt-1 block break-all font-semibold text-dark">
                {value}
              </span>
            </span>
          </a>
        ))}
      </div>
      <InfoSection title="Visit the shop">
        <div className="flex items-start gap-3">
          <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-shop-dark-red" />
          <p>Makeni, Lusaka, Zambia</p>
        </div>
      </InfoSection>
      <InfoSection title="Business hours">
        <div className="flex items-start gap-3">
          <Clock3 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-shop-dark-red" />
          <p>Monday to Saturday, 8:00 am to 10:00 pm.</p>
        </div>
        <p>Hours are local to Lusaka, Zambia. The shop is closed on Sundays.</p>
      </InfoSection>
    </StoreInfoPage>
  );
}
