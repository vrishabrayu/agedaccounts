"use client";
import styles from "./Marquee.module.css";

const platforms = [
  "Instagram", "TikTok", "YouTube", "Twitter", "Reddit", "Snapchat", "Discord", "Facebook", "Quora"
];

export default function Marquee() {
  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marquee}>
        {/* Render twice for seamless loop */}
        <div className={styles.marqueeTrack}>
          {platforms.map((platform, i) => (
            <span key={i} className={styles.item}>{platform}</span>
          ))}
        </div>
        <div className={styles.marqueeTrack} aria-hidden="true">
          {platforms.map((platform, i) => (
            <span key={i} className={styles.item}>{platform}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
