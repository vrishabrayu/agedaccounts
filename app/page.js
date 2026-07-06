"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import Hero from "../components/Hero";
import FilterMenu from "../components/FilterMenu";
import AccountCard from "../components/AccountCard";
import { Testimonials } from "../components/ui/testimonials-columns";
import { mockAccounts } from "../data/mockAccounts";
import { useCart } from "../context/CartContext";
import { ShoppingBag, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const { addMultipleToCart, cart } = useCart();
  const headerRef = useRef(null);

  const filteredAccounts =
    selectedPlatform === "All"
      ? mockAccounts
      : mockAccounts.filter((acc) => acc.platform === selectedPlatform);

  const handleToggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleBulkAdd = () => {
    const accountsToAdd = mockAccounts.filter((acc) => selectedIds.has(acc.id));
    addMultipleToCart(accountsToAdd);
    setSelectedIds(new Set());
  };

  const handlePlatformClick = useCallback((platform) => {
    setSelectedPlatform(platform);
    setTimeout(() => {
      const el = document.getElementById("marketplace");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, []);

  const addableCount = selectedIds.size;

  return (
    <main style={{ minHeight: "100vh", background: "#0D0D0D" }}>
      <Hero />

      {/* ── Marketplace ── */}
      <section
        id="marketplace"
        style={{
          padding: "4rem clamp(1rem, 4vw, 3rem) 5rem",
          background: "#0D0D0D",
          minHeight: "100vh",
          scrollMarginTop: "var(--navbar-height, 72px)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Section header */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            style={{ marginBottom: "2.5rem" }}
          >
            <div style={{
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
            }}>
              Marketplace
            </div>
            <h2 style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              letterSpacing: "-0.02em",
              color: "#EFEFE9",
              lineHeight: 1.1,
            }}>
              SOCIAL ACCOUNTS
            </h2>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(239,239,233,0.35)",
              marginTop: "0.5rem",
            }}>
              Filter by platform and find the perfect audience for your brand.
            </p>
          </motion.div>

          <FilterMenu selected={selectedPlatform} onSelect={setSelectedPlatform} />

          {/* Product grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1px",
            marginTop: "2rem",
            background: "rgba(239,239,233,0.06)",
            border: "1px solid rgba(239,239,233,0.06)",
          }}>
            {filteredAccounts.map((account) => (
              <div key={account.id} style={{ background: "#0D0D0D" }}>
                <AccountCard
                  account={account}
                  isSelected={selectedIds.has(account.id)}
                  onToggleSelect={handleToggleSelect}
                />
              </div>
            ))}
          </div>

          {filteredAccounts.length === 0 && (
            <div style={{
              padding: "4rem 2rem",
              textAlign: "center",
              border: "1px solid rgba(239,239,233,0.08)",
              color: "rgba(239,239,233,0.3)",
              marginTop: "2rem",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}>
              No accounts found for {selectedPlatform}. Check back soon.
            </div>
          )}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <Testimonials />

      {/* ── Bulk Add Bar ── */}
      {selectedIds.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 800,
            padding: "0.75rem 1rem",
            paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
            background: "#111111",
            borderTop: "1px solid rgba(239,239,233,0.18)",
            backdropFilter: "blur(20px)",
          }}
          id="bulk-add-bar"
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "10px",
              fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
              color: "#EFEFE9", whiteSpace: "nowrap",
            }}>
              {selectedIds.size} item{selectedIds.size > 1 ? "s" : ""} selected
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <button
                onClick={() => setSelectedIds(new Set())}
                style={{
                  display: "flex", alignItems: "center", gap: "0.35rem",
                  padding: "0.5rem 0.75rem", fontFamily: "var(--font-mono)",
                  fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "rgba(239,239,233,0.4)",
                  background: "transparent", border: "1px solid rgba(239,239,233,0.1)",
                  cursor: "pointer", transition: "all 0.2s",
                }}
                className="hover:text-[#EFEFE9] hover:border-[rgba(239,239,233,0.3)]"
              >
                <X size={12} /> Clear
              </button>
              <button
                onClick={handleBulkAdd}
                disabled={addableCount === 0}
                id="bulk-add-btn"
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.5rem 1.25rem", fontFamily: "var(--font-mono)",
                  fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase", background: "#FF3B00",
                  color: "#EFEFE9", border: "none", cursor: "pointer",
                  transition: "opacity 0.2s", whiteSpace: "nowrap",
                }}
                className="hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={12} />
                Add {addableCount} to cart →
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </main>
  );
}
