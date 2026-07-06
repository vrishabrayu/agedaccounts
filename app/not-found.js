import Link from "next/link";

export const metadata = {
  title: "404 — Page Not Found | Aged Accounts",
};

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0D0D0D",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      {/* Large 404 */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: "clamp(6rem, 20vw, 14rem)",
          letterSpacing: "-0.06em",
          lineHeight: 1,
          color: "rgba(239,239,233,0.04)",
          userSelect: "none",
          pointerEvents: "none",
          position: "absolute",
        }}
        aria-hidden="true"
      >
        404
      </div>

      {/* Eyebrow */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.25rem 0.75rem",
          border: "1px solid rgba(239,239,233,0.15)",
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(239,239,233,0.4)",
          marginBottom: "1.5rem",
          position: "relative",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            background: "#FF3B00",
            borderRadius: "50%",
          }}
        />
        Error 404
      </span>

      {/* Heading */}
      <h1
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: "clamp(1.75rem, 5vw, 3rem)",
          letterSpacing: "-0.02em",
          color: "#EFEFE9",
          lineHeight: 1.1,
          marginBottom: "1rem",
          position: "relative",
        }}
      >
        PAGE NOT FOUND
      </h1>

      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.95rem",
          color: "rgba(239,239,233,0.45)",
          maxWidth: "360px",
          lineHeight: 1.65,
          marginBottom: "2.5rem",
          position: "relative",
        }}
      >
        The page you're looking for doesn't exist or has been moved.
      </p>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            padding: "0.875rem 2rem",
            background: "#FF3B00",
            color: "#EFEFE9",
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            border: "none",
            cursor: "pointer",
            transition: "opacity 0.2s",
            minHeight: "unset",
          }}
        >
          Back to Home
        </Link>
        <Link
          href="/#marketplace"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(239,239,233,0.4)",
            transition: "color 0.2s",
            minHeight: "unset",
          }}
        >
          Browse Marketplace →
        </Link>
      </div>
    </main>
  );
}
