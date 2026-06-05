"use client";
import styles from "./AccountCard.module.css";
import { Plus, Check } from "lucide-react";
import { useCart } from "../context/CartContext";

const platformIcons = {
  Instagram: "https://cdn.simpleicons.org/instagram/000000",
  Twitter: "https://cdn.simpleicons.org/x/000000",
  YouTube: "https://cdn.simpleicons.org/youtube/000000",
  TikTok: "https://cdn.simpleicons.org/tiktok/000000",
  Reddit: "https://cdn.simpleicons.org/reddit/000000",
  Discord: "https://cdn.simpleicons.org/discord/000000",
  Snapchat: "https://cdn.simpleicons.org/snapchat/000000",
  Quora: "https://cdn.simpleicons.org/quora/000000",
  Facebook: "https://cdn.simpleicons.org/facebook/000000",
};

export default function AccountCard({
  account,
  isSelected,
  onToggleSelect,
}) {
  const iconUrl = platformIcons[account.platform];
  const { addToCart } = useCart();

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ""}`}
      id={`account-card-${account.id}`}
    >
      {/* Selection checkbox */}
      <button
        className={styles.checkbox}
        onClick={() => onToggleSelect && onToggleSelect(account.id)}
        aria-label={
          isSelected
            ? `Deselect ${account.niche} account`
            : `Select ${account.niche} account`
        }
        aria-pressed={isSelected}
      >
        {isSelected ? (
          <Check size={14} strokeWidth={3} />
        ) : (
          <span className={styles.checkboxEmpty} />
        )}
      </button>

      <div className={styles.header}>
        <div className={styles.platformBadge}>
          {iconUrl && <img src={iconUrl} alt={account.platform} width={16} height={16} />}
          <span>{account.platform}</span>
        </div>
        <div className={styles.price}>${account.price}</div>
      </div>

      <div className={styles.body}>
        <h3 className={styles.niche}>{account.niche}</h3>

        <div className={styles.stats}>
          <div className={styles.statGroup}>
            <span className={styles.statLabel}>Followers</span>
            <span className={styles.statValue}>{account.followers}</span>
          </div>
          <div className={styles.statGroup}>
            <span className={styles.statLabel}>Engagement</span>
            <span className={styles.statValue}>{account.engagement}</span>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <button
          className={styles.addBtn}
          onClick={() => addToCart(account)}
          id={`add-to-cart-${account.id}`}
        >
          <Plus size={14} />
          <span>ADD TO CART</span>
        </button>
      </div>
    </div>
  );
}
