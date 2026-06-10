"use client";
import { useMemo, useState, useCallback } from "react";
import Hero from "./Hero";
import Marquee from "./Marquee";
import FilterMenu from "./FilterMenu";
import AccountCard from "./AccountCard";
import { useCart } from "../context/CartContext";
import { ShoppingBag, X } from "lucide-react";
import styles from "../app/(storefront)/page.module.css";

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
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
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

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const addableCount = selectedIds.size;

  return (
    <main className={styles.main}>
      <Hero />
      <Marquee />

      <section id="marketplace" className={styles.marketplace}>
        <div className={styles.container}>
          <div className={styles.marketplaceHeader}>
            <h2>SOCIAL ACCOUNTS</h2>
            <p>
              FILTER BY PLATFORM AND FIND THE PERFECT AUDIENCE FOR YOUR BRAND.
            </p>
          </div>

          <FilterMenu
            platforms={platforms}
            selected={selectedPlatform}
            onSelect={setSelectedPlatform}
          />

          <div className={styles.grid}>
            {filteredProducts.map((product) => (
              <AccountCard
                key={product.id}
                account={product}
                isSelected={selectedIds.has(product.id)}
                onToggleSelect={handleToggleSelect}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className={styles.emptyState}>
              <p>
                {initialProducts.length === 0
                  ? "NO PRODUCTS IN STOCK YET. CHECK BACK SOON."
                  : `NO ACCOUNTS FOUND FOR ${selectedPlatform.toUpperCase()}. CHECK BACK LATER.`}
              </p>
            </div>
          )}
        </div>
      </section>

      {selectedIds.size > 0 && (
        <div className={styles.bulkBar} id="bulk-add-bar">
          <div className={styles.bulkBarContent}>
            <span className={styles.bulkBarText}>
              {selectedIds.size} ITEM{selectedIds.size > 1 ? "S" : ""} SELECTED
            </span>
            <div className={styles.bulkBarActions}>
              <button
                className={styles.bulkClearBtn}
                onClick={handleClearSelection}
                aria-label="Clear selection"
              >
                <X size={14} />
                <span>CLEAR</span>
              </button>
              <button
                className={styles.bulkAddBtn}
                onClick={handleBulkAdd}
                disabled={addableCount === 0}
                id="bulk-add-btn"
              >
                <ShoppingBag size={14} />
                <span>
                  ADD {addableCount > 0 ? addableCount : ""} TO CART →
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
