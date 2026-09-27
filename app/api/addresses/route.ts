import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { Address } from "@/sanity.types";
import { client } from "@/sanity/lib/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) {
    return NextResponse.json(
      { error: "Authentication is required to view saved addresses." },
      { status: 401, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  try {
    const addresses = await client.fetch<Address[]>(
      '*[_type == "address" && email == $email] | order(default desc, createdAt desc) { _id, _type, _createdAt, _updatedAt, _rev, name, email, address, city, state, zip, default, createdAt }',
      { email },
    );

    return NextResponse.json(addresses ?? [], {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("Address fetching error:", error);
    return NextResponse.json(
      { error: "Saved addresses could not be loaded." },
      { status: 500, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
