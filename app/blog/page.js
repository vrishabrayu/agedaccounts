"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { blogPosts } from "./blogData";

const CATEGORIES = ["All", "Guides", "Marketing", "Platforms", "Insights", "Advertising", "Legal", "Security", "Industry"];

export default function BlogIndex() {
  const [active, setActive] = useState("All");

  const filtered = active === "All"
    ? blogPosts
    : blogPosts.filter((p) => p.category === active);

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
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        {/* Back */}
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
        <div style={{ marginBottom: "2.5rem" }}>
          <span style={{
            display: "inline-block", padding: "0.25rem 0.75rem",
            border: "1px solid rgba(239,239,233,0.15)", fontFamily: "var(--font-mono)",
            fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "rgba(239,239,233,0.4)", marginBottom: "1rem",
          }}>
            Blog
          </span>
          <h1 style={{
            fontFamily: "var(--font-mono)", fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em",
            color: "#EFEFE9", lineHeight: 1.1,
          }}>
            INSIGHTS & GUIDES
          </h1>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: "10px",
            letterSpacing: "0.15em", textTransform: "uppercase",
            color: "rgba(239,239,233,0.35)", marginTop: "0.5rem",
          }}>
            Everything you need to know about aged social media accounts
          </p>
        </div>

        {/* Category filter pills */}
        <div
          style={{
            display: "flex", flexWrap: "wrap", gap: "0.5rem",
            marginBottom: "2.5rem",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                padding: "0.35rem 0.875rem",
                fontFamily: "var(--font-mono)", fontSize: "9px",
                fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
                border: `1px solid ${active === cat ? "#FF3B00" : "rgba(239,239,233,0.15)"}`,
                background: active === cat ? "rgba(255,59,0,0.1)" : "transparent",
                color: active === cat ? "#FF3B00" : "rgba(239,239,233,0.45)",
                cursor: "pointer", transition: "all 0.2s", minHeight: "unset",
              }}
            >
              {cat}
            </button>
          ))}
          <span style={{
            marginLeft: "auto", display: "flex", alignItems: "center",
            fontFamily: "var(--font-mono)", fontSize: "9px",
            letterSpacing: "0.15em", textTransform: "uppercase",
            color: "rgba(239,239,233,0.25)",
          }}>
            {filtered.length} article{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Posts grid */}
        {filtered.length === 0 ? (
          <div style={{
            padding: "4rem 2rem", textAlign: "center",
            border: "1px solid rgba(239,239,233,0.08)",
            color: "rgba(239,239,233,0.3)", fontFamily: "var(--font-mono)",
            fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase",
          }}>
            No articles in this category yet.
          </div>
        ) : (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1px", background: "rgba(239,239,233,0.06)",
            border: "1px solid rgba(239,239,233,0.06)",
          }}>
            {filtered.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{
                  background: "#141414", textDecoration: "none",
                  display: "flex", flexDirection: "column",
                  padding: "1.75rem", transition: "background 0.25s",
                  gap: "0.6rem",
                }}
                className="hover:bg-[#1a1a1a] group"
              >
                {/* Meta row */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700,
                    letterSpacing: "0.18em", textTransform: "uppercase", color: "#FF3B00",
                  }}>
                    {post.category}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: "9px",
                    letterSpacing: "0.12em", color: "rgba(239,239,233,0.3)",
                  }}>
                    {post.date}
                  </span>
                </div>

                {/* Title */}
                <h2 style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.95rem", fontWeight: 700,
                  color: "#EFEFE9", lineHeight: 1.35, letterSpacing: "-0.01em", flex: 1,
                }}>
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p style={{ fontSize: "0.82rem", color: "rgba(239,239,233,0.45)", lineHeight: 1.55 }}>
                  {post.excerpt}
                </p>

                {/* Read more */}
                <div style={{
                  display: "flex", alignItems: "center", gap: "0.35rem",
                  fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700,
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  color: "rgba(239,239,233,0.3)", marginTop: "0.5rem",
                  transition: "color 0.2s",
                }}
                  className="group-hover:text-[#FF3B00]"
                >
                  Read article <ArrowRight size={11} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
