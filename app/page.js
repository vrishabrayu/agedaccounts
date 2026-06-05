"use client";
import { useState, useCallback } from "react";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import FilterMenu from "../components/FilterMenu";
import AccountCard from "../components/AccountCard";
import { mockAccounts } from "../data/mockAccounts";
import { useCart } from "../context/CartContext";
import { ShoppingBag, X } from "lucide-react";
import styles from "./page.module.css";

export default function Home() {
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const { addMultipleToCart, cart } = useCart();

  const filteredAccounts =
    selectedPlatform === "All"
      ? mockAccounts
      : mockAccounts.filter((acc) => acc.platform === selectedPlatform);

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
    const accountsToAdd = mockAccounts.filter((acc) =>
      selectedIds.has(acc.id)
    );
    addMultipleToCart(accountsToAdd);
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
            selected={selectedPlatform}
            onSelect={setSelectedPlatform}
          />

          <div className={styles.grid}>
            {filteredAccounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                isSelected={selectedIds.has(account.id)}
                onToggleSelect={handleToggleSelect}
              />
            ))}
          </div>

          {filteredAccounts.length === 0 && (
            <div className={styles.emptyState}>
              <p>
                NO ACCOUNTS FOUND FOR {selectedPlatform.toUpperCase()}. CHECK
                BACK LATER.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Bulk add floating bar */}
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
