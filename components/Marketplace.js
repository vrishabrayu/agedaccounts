"use client";
import { useMemo, useState, useCallback } from "react";
import Hero from "./Hero";
import FilterMenu from "./FilterMenu";
import AccountCard from "./AccountCard";
import { Testimonials } from "./ui/testimonials-columns";
import { useCart } from "../context/CartContext";
import { ShoppingBag, X } from "lucide-react";
import { motion } from "framer-motion";

export default function Marketplace({ initialProducts = [] }) {
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const { addMultipleToCart } = useCart();

  const platforms = useMemo(
    () => ["All", ...new Set(initialProducts.map((product) => product.platform))],
    [initialProducts]
  );

  const filteredProducts =
    selectedPlatform === "All"
      ? initialProducts
      : initialProducts.filter((product) => product.platform === selectedPlatform);

  const handleToggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleBulkAdd = () => {
    const productsToAdd = initialProducts.filter((product) =>
      selectedIds.has(product.id)
    );
    addMultipleToCart(productsToAdd);
    setSelectedIds(new Set());
  };

  const addableCount = selectedIds.size;

  return (
    <main style={{ minHeight: "100vh", background: "var(--background)" }}>
      <Hero />

      <section
        id="marketplace"
        style={{
          padding: "4rem clamp(1rem, 4vw, 3rem) 5rem",
          background: "var(--background)",
          minHeight: "100vh",
          scrollMarginTop: "var(--navbar-height, 72px)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            style={{ marginBottom: "2.5rem" }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "0.25rem 0.75rem",
                border: "1px solid var(--border-strong)",
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--text-subtle)",
                marginBottom: "1rem",
              }}
            >
              Marketplace
            </div>
            <h2
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: "clamp(1.75rem, 4vw, 3rem)",
                letterSpacing: "-0.02em",
                color: "var(--foreground)",
                lineHeight: 1.1,
              }}
            >
              SOCIAL ACCOUNTS
            </h2>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--text-subtle)",
                marginTop: "0.5rem",
              }}
            >
              Filter by platform and find the perfect audience for your brand.
            </p>
          </motion.div>

          <FilterMenu
            platforms={platforms}
            selected={selectedPlatform}
            onSelect={setSelectedPlatform}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1px",
              marginTop: "2rem",
              background: "var(--grid-line)",
              border: "1px solid var(--grid-line)",
            }}
          >
            {filteredProducts.map((product) => (
              <div key={product.id} style={{ background: "var(--background)" }}>
                <AccountCard
                  account={product}
                  isSelected={selectedIds.has(product.id)}
                  onToggleSelect={handleToggleSelect}
                />
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div
              style={{
                padding: "4rem 2rem",
                textAlign: "center",
                border: "1px solid var(--border)",
                color: "var(--text-faint)",
                marginTop: "2rem",
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              {initialProducts.length === 0
                ? "No products in stock yet. Check back soon."
                : `No accounts found for ${selectedPlatform}. Check back soon.`}
            </div>
          )}
        </div>
      </section>

      <Testimonials />

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
            background: "var(--bulk-bar-bg)",
            borderTop: "1px solid var(--border-strong)",
            backdropFilter: "blur(20px)",
          }}
          id="bulk-add-bar"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--foreground)",
                whiteSpace: "nowrap",
              }}
            >
              {selectedIds.size} item{selectedIds.size > 1 ? "s" : ""} selected
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <button
                onClick={() => setSelectedIds(new Set())}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.5rem 0.75rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--text-subtle)",
                  background: "transparent",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <X size={12} /> Clear
              </button>
              <button
                onClick={handleBulkAdd}
                disabled={addableCount === 0}
                id="bulk-add-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1.25rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  background: "var(--accent-color)",
                  color: "var(--accent-foreground-color)",
                  border: "none",
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                  whiteSpace: "nowrap",
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
