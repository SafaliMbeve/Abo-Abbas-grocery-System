import type { ReactNode } from "react";
import Container from "@/components/Container";
import { Title } from "@/components/ui/text";

type StoreInfoPageProps = {
  title: string;
  intro: string;
  children: ReactNode;
};

export function StoreInfoPage({ title, intro, children }: StoreInfoPageProps) {
  return (
    <div className="min-h-[60vh] bg-shop-light-bg py-10 sm:py-14">
      <Container>
        <header className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-shop-dark-red">
            Abo Abbas
          </p>
          <Title>{title}</Title>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-shop_light_text sm:text-base">
            {intro}
          </p>
        </header>
        <div className="mx-auto max-w-3xl rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm sm:p-8">
          {children}
        </div>
      </Container>
    </div>
  );
}

export function InfoSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="not-first:mt-8 not-first:border-t not-first:border-black/[0.06] not-first:pt-7">
      <h2 className="text-lg font-semibold text-dark">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-6 text-shop_light_text">
        {children}
      </div>
    </section>
  );
}

export function InfoLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="font-medium text-shop-dark-red underline decoration-shop-dark-red/30 underline-offset-4 hover:decoration-shop-dark-red"
    >
      {children}
    </a>
  );
}
