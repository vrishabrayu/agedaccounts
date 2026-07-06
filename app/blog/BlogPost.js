import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BlogPost({ title, category, date, children }) {
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
      <article style={{ maxWidth: "760px", margin: "0 auto" }}>
        {/* Back */}
        <Link
          href="/blog"
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
            transition: "color 0.2s",
          }}
        >
          <ArrowLeft size={14} /> Back to Blog
        </Link>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1rem",
            }}
          >
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
                color: "#FF3B00",
              }}
            >
              {category}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "0.12em",
                color: "rgba(239,239,233,0.3)",
              }}
            >
              {date}
            </span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              letterSpacing: "-0.02em",
              color: "#EFEFE9",
              lineHeight: 1.15,
            }}
          >
            {title}
          </h1>
        </div>

        {/* Body */}
        <div
          style={{
            fontFamily: "var(--font-sans, Inter, sans-serif)",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "rgba(239,239,233,0.7)",
            borderTop: "1px solid rgba(239,239,233,0.08)",
            paddingTop: "2.5rem",
          }}
        >
          {children}
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: "3rem",
            padding: "2rem",
            background: "#141414",
            border: "1px solid rgba(239,239,233,0.06)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#FF3B00",
              marginBottom: "0.75rem",
            }}
          >
            Ready to Get Started?
          </p>
          <p
            style={{
              fontSize: "0.9rem",
              color: "rgba(239,239,233,0.55)",
              lineHeight: 1.6,
              marginBottom: "1.25rem",
            }}
          >
            Browse our curated selection of premium, hand-farmed aged accounts
            across Instagram, TikTok, YouTube, Twitter, Reddit, and more.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "0.6rem 1.5rem",
              background: "#EFEFE9",
              color: "#0D0D0D",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
          >
            Browse Marketplace →
          </Link>
        </div>
      </article>
    </main>
  );
}
