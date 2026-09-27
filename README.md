# Abo-Abbas Grocery System

A grocery storefront built with Next.js, Sanity, and Zambian payment providers. Customers can browse products, manage a cart, subscribe to the newsletter, and complete orders using Zambian mobile money or card payments.

## Features

- Product browsing and shopping cart
- Dedicated checkout page at `/checkout`
- Flutterwave mobile-money checkout for MTN, Airtel, and Zamtel
- Stripe Checkout for card payments
- Server-side payment verification and order confirmation
- Sanity CMS for products, orders, blog content, reviews, and newsletter subscribers
- Stock updates after verified payments
- Responsive Next.js interface

## Tech stack

- Next.js 16 and React 19
- TypeScript
- Sanity CMS
- Flutterwave
- Stripe
- Clerk
- Tailwind CSS
- Zustand

## Prerequisites

- Node.js 20 or later
- A Sanity project and dataset
- Flutterwave credentials for mobile-money payments
- Stripe credentials for card payments
- Clerk credentials if authentication is enabled in your environment

## Getting started

Clone the repository and install its dependencies:

```bash
git clone https://github.com/SafaliMbeve/Abo-Abbas-grocery-System.git
cd Abo-Abbas-grocery-System
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

If `.env.example` is not available in your checkout, create `.env.local` using the variable names expected by the application and your deployment environment. Never commit `.env.local` or any secret credentials.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

```bash
npm run dev      # Start the development server
npm run build    # Create a production build
npm run start    # Start the production server
npm run lint     # Run ESLint
npm run typegen  # Extract the Sanity schema and generate types
```

## Environment configuration

Configure the following categories of values in your environment. Use the exact variable names provided by the source code and deployment configuration:

| Category | Purpose |
|---|---|
| Sanity project and dataset | Connect the storefront and server to Sanity |
| Sanity API token | Read and update products and orders server-side |
| Flutterwave credentials | Create and verify mobile-money payments |
| Stripe secret and webhook credentials | Create Checkout Sessions and verify Stripe webhooks |
| Clerk credentials | Configure authentication, when enabled |
| `NEXT_PUBLIC_SITE_URL` | Set the public application origin used for payment redirects |
| Demo-payment flags | Enable simulated payments only for local presentations |

Keep all secret values out of `NEXT_PUBLIC_*` variables. Do not commit API keys, tokens, webhook secrets, or payment credentials.

## Payments

### Flutterwave mobile money

The mobile-money integration supports MTN, Airtel, and Zamtel through Flutterwave. Use Flutterwave test keys first and configure the webhook URL as:

```text
https://your-domain.example/api/payments/flutterwave/webhook
```

### Stripe card payments

Stripe Checkout is used for card payments. After a successful payment, Stripe redirects the customer to `/checkout/successful` with the Checkout Session ID. The application verifies the paid session server-side before confirming the order in Sanity.

Configure the Stripe webhook URL as:

```text
https://your-domain.example/api/payments/stripe/webhook
```

Enable at least these events:

- `checkout.session.completed`
- `checkout.session.expired`

### Payment checklist

Before enabling live credentials:

1. Confirm that your provider accounts support ZMW payments.
2. Set `NEXT_PUBLIC_SITE_URL` to the deployed HTTPS origin.
3. Configure and test both webhook endpoints.
4. Test successful, failed, cancelled, and expired payments.
5. Confirm that verified payments create or update the expected Sanity order.
6. Confirm that stock is updated correctly and is not reduced for failed payments.
7. Check webhook delivery and application logs.

The Zambia mobile-money endpoint accepts whole ZMW amounts. Checkout rejects fractional-ZMW totals rather than silently rounding the amount displayed to the customer.

## Demo payments

Demo payments are intended only for a local school-project presentation. Enable both demo-payment variables only in a local environment. Demo mode accepts non-empty dummy input, does not contact or store payment details, and must never be enabled in production or presented as a real payment.

## Sanity content

Preview the content-seeding operation without changing the configured dataset:

```bash
node scripts/seed-sanity-content.mjs
```

Apply the seed operation:

```bash
node scripts/seed-sanity-content.mjs --apply
```

The script can be rerun safely after a partial failure. It can:

- Upload product photos
- Attach matching photos to existing products
- Create product drafts for image-only products
- Add unpublished blog and demo-review drafts

The script skips the two cart illustrations. Product drafts intentionally do not include price or stock; complete those values in Sanity Studio before publishing. Demo reviews are fictional, remain unpublished, and are excluded from storefront review queries.

## Newsletter subscriptions

The footer signup stores a consented email address in a Sanity `newsletterSubscriber` document. It is an opt-in list collector and does not send campaigns. Manage or remove subscribers in Sanity Studio, and connect an email campaign provider before promising or sending newsletter updates.

## Important routes

| Route | Purpose |
|---|---|
| `/` | Storefront |
| `/checkout` | Checkout page |
| `/checkout/successful` | Stripe payment return and verification page |
| `/api/payments/flutterwave/webhook` | Flutterwave webhook |
| `/api/payments/stripe/webhook` | Stripe webhook |

## Deployment

The application can be deployed to Vercel or another platform that supports Next.js.

Before deploying:

1. Configure all production environment variables.
2. Use production Sanity, payment, and authentication credentials.
3. Set `NEXT_PUBLIC_SITE_URL` to the production HTTPS origin.
4. Register the production webhook URLs with Flutterwave and Stripe.
5. Test successful and failed payments in test mode.
6. Confirm order verification and stock updates.
7. Keep demo-payment flags disabled.

## Troubleshooting

### Payment redirects use the wrong URL

Check that `NEXT_PUBLIC_SITE_URL` matches the deployed HTTPS origin and that the same origin is configured in the Flutterwave and Stripe dashboards.

### Orders are not confirmed

Check webhook delivery, webhook signing secrets, Sanity permissions, and server logs. Do not manually mark an order as paid without verifying the payment with the provider.

### Product content is missing

Confirm the Sanity project, dataset, and API token. Run the seed script in preview mode first, then use `--apply` and complete missing price and stock fields in Sanity Studio.

## Security notes

- Never commit `.env.local` or production credentials.
- Keep payment and Sanity tokens server-side.
- Do not trust client-side payment success messages without server-side verification.
- Use HTTPS for production payment redirects and webhooks.
- Disable demo payments before deployment.
