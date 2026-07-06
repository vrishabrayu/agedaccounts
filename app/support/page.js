import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export const metadata = {
  title: "Help & Support | Aged Accounts",
  description:
    "Get help with your Aged Accounts purchase. Fast support, instant delivery, secure transactions.",
};

const faqs = [
  {
    q: "How fast is delivery?",
    a: "Most accounts are handed over instantly or within a few hours after payment confirmation.",
  },
  {
    q: "Is the transaction secure?",
    a: "Yes. We use Stripe and trusted crypto gateways with full encryption. Your payment data never touches our servers.",
  },
  {
    q: "What if my account gets banned?",
    a: "All accounts pass our 14-point quality audit before listing. We offer a 24-hour replacement guarantee on verified orders.",
  },
  {
    q: "Can I buy in bulk?",
    a: "Yes — use the checkboxes on the marketplace to multi-select and add all to cart in one tap.",
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
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "2.5rem",
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(239,239,233,0.45)",
            minHeight: "unset",
            transition: "color 0.2s",
          }}
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: "3.5rem" }}>
          <span
            style={{
              display: "inline-block",
              padding: "0.25rem 0.75rem",
              border: "1px solid rgba(239,239,233,0.15)",
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(239,239,233,0.4)",
              marginBottom: "1rem",
            }}
          >
            Support
          </span>
          <h1
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              letterSpacing: "-0.02em",
              color: "#EFEFE9",
              lineHeight: 1.1,
            }}
          >
            HELP & SUPPORT
          </h1>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(239,239,233,0.35)",
              marginTop: "0.5rem",
            }}
          >
            We are here to assist you
          </p>
        </div>

        {/* Contact card */}
        <div
          style={{
            padding: "2rem",
            border: "1px solid rgba(239,239,233,0.10)",
            background: "#141414",
            marginBottom: "3rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(239,239,233,0.35)",
            }}
          >
            Direct Contact
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
              color: "#EFEFE9",
              letterSpacing: "-0.01em",
            }}
          >
            Fastest response within 2 hours.
          </div>
          <a
            href="mailto:support@ageddaccount.store"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.875rem 1.5rem",
              background: "#FF3B00",
              color: "#EFEFE9",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
              width: "fit-content",
              transition: "opacity 0.2s",
            }}
          >
            <Mail size={15} />
            support@ageddaccount.store
          </a>
        </div>

        {/* FAQs */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(239,239,233,0.35)",
              marginBottom: "1.5rem",
            }}
          >
            Frequently Asked Questions
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1px",
              background: "rgba(239,239,233,0.06)",
              border: "1px solid rgba(239,239,233,0.06)",
            }}
          >
            {faqs.map(({ q, a }) => (
              <div
                key={q}
                style={{
                  padding: "1.5rem",
                  background: "#0D0D0D",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <strong
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#EFEFE9",
                    letterSpacing: "0.02em",
                  }}
                >
                  {q}
                </strong>
                <p
                  style={{
                    fontFamily: "var(--font-sans, Inter, sans-serif)",
                    fontSize: "0.9rem",
                    color: "rgba(239,239,233,0.55)",
                    lineHeight: 1.65,
                  }}
                >
                  {a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
