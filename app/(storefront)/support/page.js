"use client";
import Link from "next/link";
import { ArrowLeft, Mail, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How fast is delivery?",
    a: "Most accounts are handed over instantly or within a few hours after payment confirmation. You will receive access credentials directly to your email.",
  },
  {
    q: "Is the transaction secure?",
    a: "Yes. We use Stripe and trusted crypto gateways with full encryption. Your payment data never touches our servers — all transactions are processed through PCI-DSS compliant providers.",
  },
  {
    q: "What if my account gets banned?",
    a: "All accounts pass our 14-point quality audit before listing. We offer a 24-hour replacement guarantee on verified orders. Contact us within 24 hours of purchase with your order ID.",
  },
  {
    q: "Can I buy in bulk?",
    a: "Yes — use the checkboxes on the marketplace to multi-select accounts and add them all to cart in one tap. Bulk discounts are available — contact us before checkout.",
  },
  {
    q: "What platforms do you support?",
    a: "We stock aged accounts for Instagram, TikTok, YouTube, Twitter/X, Reddit, Discord, Snapchat, and Facebook. New platforms are added regularly.",
  },
  {
    q: "How do I verify an account before using it?",
    a: "Always check the account's posting history, follower authenticity, and engagement metrics before making major changes. Our blog has a detailed verification guide.",
  },
  {
    q: "Do you offer refunds?",
    a: "We do not offer refunds for accounts that have been accessed and used. If you have an issue with a purchase, contact our support team within 24 hours and we will assess a replacement.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept credit/debit cards via Stripe and cryptocurrency payments including Bitcoin, Ethereum, USDT, and other major coins.",
  },
];

export default function Support() {
  return (
    <main
      style={{
        minHeight: "100vh",
        paddingTop: "calc(var(--navbar-height, 72px) + 3rem)",
        paddingBottom: "5rem",
        background: "#0D0D0D",
        paddingLeft: "clamp(1rem, 5vw, 4rem)",
        paddingRight: "clamp(1rem, 5vw, 4rem)",
      }}
    >
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            marginBottom: "2.5rem", fontFamily: "var(--font-mono)",
            fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em",
            textTransform: "uppercase", color: "rgba(239,239,233,0.45)",
            minHeight: "unset", transition: "color 0.2s",
          }}
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: "3.5rem" }}>
          <span style={{
            display: "inline-block", padding: "0.25rem 0.75rem",
            border: "1px solid rgba(239,239,233,0.15)", fontFamily: "var(--font-mono)",
            fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "rgba(239,239,233,0.4)", marginBottom: "1rem",
          }}>
            Support
          </span>
          <h1 style={{
            fontFamily: "var(--font-mono)", fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em",
            color: "#EFEFE9", lineHeight: 1.1,
          }}>
            HELP & SUPPORT
          </h1>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: "10px",
            letterSpacing: "0.15em", textTransform: "uppercase",
            color: "rgba(239,239,233,0.35)", marginTop: "0.5rem",
          }}>
            We are here to assist you
          </p>
        </div>

        {/* Contact card */}
        <div style={{
          padding: "2rem", border: "1px solid rgba(239,239,233,0.10)",
          background: "#141414", marginBottom: "3rem",
          display: "flex", flexDirection: "column", gap: "1rem",
        }}>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700,
            letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(239,239,233,0.35)",
          }}>
            Direct Contact
          </div>
          <div style={{
            fontFamily: "var(--font-mono)", fontWeight: 700,
            fontSize: "clamp(1rem, 2.5vw, 1.5rem)", color: "#EFEFE9", letterSpacing: "-0.01em",
          }}>
            Fastest response within 2 hours.
          </div>
          <a
            href="mailto:support@ageddaccount.store"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.75rem",
              padding: "0.875rem 1.5rem", background: "#FF3B00", color: "#EFEFE9",
              fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 700,
              letterSpacing: "0.15em", textTransform: "uppercase", border: "none",
              cursor: "pointer", width: "fit-content", transition: "opacity 0.2s",
            }}
          >
            <Mail size={15} />
            support@ageddaccount.store
          </a>
        </div>

        {/* FAQs — Accordion */}
        <div>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700,
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "rgba(239,239,233,0.35)", marginBottom: "1.5rem",
          }}>
            Frequently Asked Questions
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map(({ q, a }, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger>{q}</AccordionTrigger>
                <AccordionContent>{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </main>
  );
}
