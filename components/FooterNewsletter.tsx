"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (!consent) {
      setFeedback({
        type: "error",
        message: "Please agree to receive email updates before subscribing.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          website: formData.get("website"),
        }),
      });
      const result: { message?: string; error?: string } = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Subscription could not be saved.");
      }

      setFeedback({
        type: "success",
        message: result.message ?? "Thanks for subscribing.",
      });
      setEmail("");
      setConsent(false);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Subscription could not be saved. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="footer-newsletter-title" className="space-y-4">
      <div>
        <h2 id="footer-newsletter-title" className="font-sans font-semibold text-dark">
          Newsletter
        </h2>
        <p className="mt-2 text-sm leading-6 text-shop_light_text">
          Join our email list for shop news and offers.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
          <Label htmlFor="newsletter-email" className="sr-only">
            Email address
          </Label>
          <Input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={isSubmitting}
            className="min-w-0 flex-1"
          />
          <Button
            type="submit"
            disabled={isSubmitting || !email.trim() || !consent}
            className="w-full sm:w-auto lg:w-full xl:w-auto"
          >
            {isSubmitting ? (
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <Send aria-hidden="true" className="size-4" />
            )}
            {isSubmitting ? "Subscribing…" : "Subscribe"}
          </Button>
        </div>

        <div className="flex items-start gap-2">
          <input
            id="newsletter-consent"
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            disabled={isSubmitting}
            className="mt-1 size-4 shrink-0 accent-shop-dark-red"
            required
          />
          <Label
            htmlFor="newsletter-consent"
            className="cursor-pointer text-xs leading-5 text-shop_light_text"
          >
            I agree to receive email updates from Abo Abbas. My email will be
            stored for this purpose. See our{" "}
            <Link
              href="/privacy"
              className="font-medium text-shop-dark-red underline underline-offset-2"
            >
              Privacy Policy
            </Link>
            .
          </Label>
        </div>

        <input
          aria-hidden="true"
          autoComplete="off"
          className="absolute -left-[10000px] h-px w-px overflow-hidden"
          name="website"
          tabIndex={-1}
          type="text"
        />

        {feedback && (
          <p
            role={feedback.type === "error" ? "alert" : "status"}
            aria-live="polite"
            className={`flex items-start gap-2 text-sm leading-5 ${
              feedback.type === "error"
                ? "text-destructive"
                : "text-shop-dark-green"
            }`}
          >
            {feedback.type === "success" && (
              <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            )}
            {feedback.message}
          </p>
        )}
      </form>
      <p className="text-xs leading-5 text-shop_light_text">
        Your address is saved to the shop&apos;s subscriber list. Email
        campaigns are not sent automatically yet. You can request removal at
        any time by contacting the shop.
      </p>
    </section>
  );
}
