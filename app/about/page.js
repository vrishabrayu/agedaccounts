import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "About Us | Aged Accounts",
  description: "Learn about Aged Accounts — premium social media assets for your brand.",
};

export default function About() {
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
            Company
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
            ABOUT US
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
            Premium social accounts for your brand
          </p>
        </div>

        {/* Body */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            fontFamily: "var(--font-sans, Inter, sans-serif)",
            fontSize: "1rem",
            lineHeight: 1.75,
            color: "rgba(239,239,233,0.7)",
            borderTop: "1px solid rgba(239,239,233,0.08)",
            paddingTop: "2.5rem",
          }}
        >
          <p>
            Welcome to <strong style={{ color: "#EFEFE9", fontFamily: "var(--font-mono)" }}>Aged Accounts</strong>. We
            specialise in providing high-quality, premium social media accounts tailored to help your brand grow
            instantly.
          </p>
          <p>
            Whether you need a well-established presence on Instagram, TikTok, YouTube or Twitter, our curated
            selection of accounts ensures you step into the market with a strong audience and excellent engagement.
          </p>
          <p>
            Our mission is to eliminate the grinding phase of building a social media following from scratch —
            allowing you to focus on what you do best: creating great content and scaling your business.
          </p>

          {/* Highlights */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1px",
              background: "rgba(239,239,233,0.06)",
              border: "1px solid rgba(239,239,233,0.06)",
              marginTop: "2rem",
            }}
          >
            {[
              { label: "Hand Farmed", desc: "Every account is built by real activity, not bots." },
              { label: "Instant Delivery", desc: "Access handed over minutes after payment." },
              { label: "Secure Checkout", desc: "Stripe + crypto options, fully encrypted." },
              { label: "Verified Quality", desc: "All accounts pass our 14-point audit." },
            ].map(({ label, desc }) => (
              <div
                key={label}
                style={{
                  padding: "1.5rem",
                  background: "#141414",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#FF3B00",
                    marginBottom: "0.5rem",
                  }}
                >
                  {label}
                </div>
                <p style={{ fontSize: "0.875rem", color: "rgba(239,239,233,0.55)", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
