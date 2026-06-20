import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { blogPosts } from "./blogData";

const cardStyle = `
  .blog-card { background: #141414; text-decoration: none; display: block; padding: 1.75rem; transition: background 0.25s; }
  .blog-card:hover { background: #1a1a1a; }
`;

export const metadata = {
  title: "Blog | Aged Accounts",
  description:
    "Guides, insights, and expert advice on aged social media accounts — Instagram, TikTok, YouTube, Twitter, Reddit, and more.",
};

export default function BlogIndex() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cardStyle }} />
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
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        {/* Back */}
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
            Blog
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
            INSIGHTS &amp; GUIDES
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
            Everything you need to know about aged social media accounts
          </p>
        </div>

        {/* Posts grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1px",
            background: "rgba(239,239,233,0.06)",
            border: "1px solid rgba(239,239,233,0.06)",
          }}
        >
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="blog-card"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.75rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#FF3B00",
                  }}
                >
                  {post.category}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    letterSpacing: "0.12em",
                    color: "rgba(239,239,233,0.3)",
                  }}
                >
                  {post.date}
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#EFEFE9",
                  lineHeight: 1.35,
                  marginBottom: "0.6rem",
                  letterSpacing: "-0.01em",
                }}
              >
                {post.title}
              </h2>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "rgba(239,239,233,0.45)",
                  lineHeight: 1.55,
                }}
              >
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
    </>
  );
}
