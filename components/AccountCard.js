"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { Plus, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const platformSlugs = {
  Instagram: "instagram",
  Twitter: "x",
  YouTube: "youtube",
  TikTok: "tiktok",
  Reddit: "reddit",
  Discord: "discord",
  Snapchat: "snapchat",
  Quora: "quora",
  Facebook: "facebook",
};

export default function AccountCard({ account, isSelected, onToggleSelect }) {
  const { theme } = useTheme();
  const iconColor = theme === "dark" ? "EFEFE9" : "1a1a1a";
  const slug = platformSlugs[account.platform];
  const iconUrl = slug ? `https://cdn.simpleicons.org/${slug}/${iconColor}` : null;
  const { addToCart } = useCart();
  const cardRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power4.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 92%",
          toggleActions: "play none none none",
        },
      }
    );
    const card = cardRef.current;
    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === card) st.kill();
      });
    };
  }, []);

  const handleAddToCart = () => {
    addToCart(account);
    if (btnRef.current) {
      gsap.fromTo(btnRef.current, { scale: 1 }, {
        scale: 1.12, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1,
      });
    }
  };

  return (
    <div
      ref={cardRef}
      id={`account-card-${account.id}`}
      style={{
        background: isSelected ? "var(--selected-bg)" : "var(--card)",
        border: isSelected ? "1px solid rgba(255,59,0,0.5)" : "1px solid var(--border)",
        padding: "1.5rem",
        position: "relative",
        cursor: "default",
        transition: "border-color 0.2s ease, background 0.2s ease",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <button
        onClick={() => onToggleSelect && onToggleSelect(account.id)}
        aria-label={isSelected ? `Deselect ${account.niche}` : `Select ${account.niche}`}
        aria-pressed={isSelected}
        style={{
          position: "absolute",
          top: "0.5rem",
          right: "0.5rem",
          width: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span style={{
          width: "20px",
          height: "20px",
          border: isSelected ? "1px solid var(--accent-color)" : "1px solid var(--checkbox-border)",
          background: isSelected ? "var(--accent-color)" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
          flexShrink: 0,
        }}>
          {isSelected && <Check size={11} strokeWidth={3} color="var(--icon-on-accent)" />}
        </span>
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {iconUrl && (
          <Image
            src={iconUrl}
            alt={account.platform}
            width={14}
            height={14}
            style={{ opacity: 0.75 }}
            unoptimized
          />
        )}
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--muted-foreground)",
        }}>
          {account.platform}
        </span>
        <span style={{
          marginLeft: "auto",
          marginRight: "1.75rem",
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: "18px",
          color: "var(--foreground)",
          letterSpacing: "-0.02em",
        }}>
          ${account.price}
        </span>
      </div>

      <h3 style={{
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        fontSize: "clamp(1rem, 2vw, 1.25rem)",
        color: "var(--foreground)",
        letterSpacing: "-0.01em",
        lineHeight: 1.2,
        marginTop: "0.25rem",
      }}>
        {account.niche}
      </h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0.75rem",
        padding: "0.875rem",
        background: "var(--stat-bg)",
        border: "1px solid var(--border)",
      }}>
        {[
          { label: "Followers", value: account.followers || "—" },
          { label: "Engagement", value: account.engagement || "N/A" },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "8px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-faint)",
              marginBottom: "4px",
            }}>
              {label}
            </div>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--foreground)",
            }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      <button
        ref={btnRef}
        onClick={handleAddToCart}
        id={`add-to-cart-${account.id}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          padding: "0.75rem",
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--btn-inverted-fg)",
          background: "var(--btn-inverted-bg)",
          border: "none",
          cursor: "pointer",
          transition: "background 0.2s, color 0.2s",
          width: "100%",
          marginTop: "auto",
        }}
        className="hover:bg-accent hover:text-accent-foreground"
      >
        <Plus size={13} strokeWidth={2.5} />
        Add to Cart
      </button>
    </div>
  );
}
