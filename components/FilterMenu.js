"use client";
import styles from "./FilterMenu.module.css";

import { PLATFORMS } from "../data/platforms";

const defaultPlatforms = ["All", ...PLATFORMS];

export default function FilterMenu({ platforms = defaultPlatforms, selected, onSelect }) {
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
