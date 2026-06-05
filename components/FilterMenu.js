"use client";
import styles from "./FilterMenu.module.css";

const platforms = ["All", "Instagram", "TikTok", "YouTube", "Twitter", "Reddit", "Snapchat", "Discord", "Facebook", "Quora"];

export default function FilterMenu({ selected, onSelect }) {
  return (
    <div className={styles.filterMenu}>
      <div className={styles.scrollContainer}>
        {platforms.map(platform => (
          <button
            key={platform}
            className={`${styles.filterBtn} ${selected === platform ? styles.active : ""}`}
            onClick={() => onSelect(platform)}
            aria-pressed={selected === platform}
          >
            {platform}
          </button>
        ))}
      </div>
    </div>
  );
}
