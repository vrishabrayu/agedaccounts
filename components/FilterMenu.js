"use client";

import { PLATFORMS } from "../data/platforms";

const defaultPlatforms = ["All", ...PLATFORMS];

export default function FilterMenu({ platforms = defaultPlatforms, selected, onSelect }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        overflowX: "auto",
        paddingBottom: "0.5rem",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {platforms.map((platform) => {
        const isActive = selected === platform;
        return (
          <button
            key={platform}
            onClick={() => onSelect(platform)}
            aria-pressed={isActive}
            style={{
              flexShrink: 0,
              padding: "0.5rem 1rem",
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              border: isActive
                ? "1px solid var(--accent-color)"
                : "1px solid var(--border-strong)",
              background: isActive ? "var(--accent-color)" : "transparent",
              color: isActive ? "var(--accent-foreground-color)" : "var(--filter-inactive)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            {platform}
          </button>
        );
      })}
    </div>
  );
}
