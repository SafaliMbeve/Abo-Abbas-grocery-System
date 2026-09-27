import { NextResponse } from "next/server";
import { getSanityWriteClient } from "@/sanity/lib/writeClient";

export const dynamic = "force-dynamic";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json(
      { error: "The subscription request was not allowed." },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Enter a valid email address to subscribe." },
      { status: 400 },
    );
  }

  if (!isRecord(body)) {
    return NextResponse.json(
      { error: "Enter a valid email address to subscribe." },
      { status: 400 },
    );
  }

  // Ignore automated submissions caught by the visually hidden form field.
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ message: "Thanks for subscribing." });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return NextResponse.json(
      { error: "Enter a valid email address to subscribe." },
      { status: 400 },
    );
  }

  try {
    const client = getSanityWriteClient();
    const existing = await client.fetch<
      { _id: string; isActive?: boolean } | null
    >(
      `*[_type == "newsletterSubscriber" && email == $email][0]{_id, isActive}`,
      { email },
    );

    if (existing?.isActive) {
      return NextResponse.json({
        message: "This email is already subscribed.",
      });
    }

    if (existing) {
      await client
        .patch(existing._id)
        .set({ isActive: true, subscribedAt: new Date().toISOString() })
        .commit();
      return NextResponse.json({ message: "Thanks for subscribing." });
    }

    await client.create({
      _type: "newsletterSubscriber",
      email,
      isActive: true,
      subscribedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "Thanks for subscribing." },
      { status: 201 },
    );
  } catch (error) {
    console.error("Newsletter subscription could not be saved:", error);
    return NextResponse.json(
      { error: "We could not save your subscription. Please try again later." },
      { status: 500 },
    );
  }
}
