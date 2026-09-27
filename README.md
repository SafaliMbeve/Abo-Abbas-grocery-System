# Abo-Abbas-grocery-System

## Checkout and Zambian Mobile Money

Checkout is a dedicated `/checkout` page linked from the cart. Customers can pay through Flutterwave's hosted Zambian mobile-money authorization flow or Stripe Checkout for card payments. The server creates a pending Sanity order, verifies successful payments with the selected provider, and only marks an order paid after confirmation. Product stock is checked when checkout starts and any tracked stock is decremented once on confirmed payment.
After a Stripe Checkout payment, Stripe returns directly to `/checkout/successful` with its Checkout Session ID. The page verifies the paid session server-side, confirms the order in Sanity, and shows a receipt with the invoice/order number, purchased items, total, payment date, and delivery address. Receipt details are only shown to the signed-in owner of the paid order.


- Create a Flutterwave merchant account, enable Zambia mobile-money payments, and use test keys first. Configure the Flutterwave webhook URL as `https://your-domain.example/api/payments/flutterwave/webhook`; set the same webhook secret hash in `FLUTTERWAVE_WEBHOOK_HASH`.
- Create a Stripe account that can process ZMW payments, use test keys first, and configure `https://your-domain.example/api/payments/stripe/webhook` to send `checkout.session.completed` and `checkout.session.async_payment_succeeded` events. Set its signing secret in `STRIPE_WEBHOOK_SECRET`. Stripe Checkout currently accepts card payments in ZMW.
- For a local school-project presentation only, set both demo-payment variables to `true` to show the simulated checkout option. It accepts any non-empty dummy input, never sends or stores it, and makes no real charge. The server refuses simulated payments in production even if the flag is set; never enter real card details in this demo field.
- Create a Sanity API token with permissions to read and update product and order documents. Keep all secret values out of `NEXT_PUBLIC_*` variables and never commit them.
- Set `NEXT_PUBLIC_SITE_URL` to the deployed HTTPS origin in production so payment returns reach the correct app.
- The Zambia mobile-money charge endpoint accepts whole ZMW amounts. Checkout rejects fractional-ZMW totals instead of silently rounding the amount shown to the customer.
- Confirm Flutterwave, Stripe, and Sanity credentials, webhook delivery, successful payments, failed payments, and stock updates in test mode before enabling live keys.

The mobile-money integration supports MTN, Airtel, and Zamtel through Flutterwave. Stripe card checkout requires a Stripe account and configuration that support ZMW; Stripe's business availability depends on the merchant's country.

## Seeding Sanity product and blog content

`node scripts/seed-sanity-content.mjs` performs a read-only preview using the
configured Sanity dataset. To upload the product photos, attach matching photos
to existing products, create product drafts for image-only products, and add
unpublished blog/demo-review drafts, run `node scripts/seed-sanity-content.mjs
--apply`. The script skips the two cart illustrations. Product drafts are
intentionally missing price and stock; complete those values in Studio before
publishing. Demo reviews are fictional, remain unpublished, and are excluded
from storefront review queries. The script can be rerun safely after partial
failure.

## Newsletter subscriptions

The footer signup saves a consented email address to the Sanity
`newsletterSubscriber` document type. The endpoint is an opt-in list collector;
it does not send newsletter campaigns. Manage and remove subscribers in Sanity
Studio. Connect an email campaign provider before promising or sending email
updates.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
