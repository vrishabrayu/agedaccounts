"use client";

const platforms = [
  "All", "Instagram", "TikTok", "YouTube", "Twitter",
  "Reddit", "Snapchat", "Discord", "Facebook", "Quora"
];

export default function FilterMenu({ selected, onSelect }) {
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
                ? "1px solid #FF3B00"
                : "1px solid rgba(239,239,233,0.12)",
              background: isActive ? "#FF3B00" : "transparent",
              color: isActive ? "#EFEFE9" : "rgba(239,239,233,0.45)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
            className="hover:border-[rgba(239,239,233,0.35)] hover:text-[#EFEFE9]"
          >
            {platform}
          </button>
        );
      })}
    </div>
  );
}
