"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { Plus, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const platformIcons = {
  Instagram: "https://cdn.simpleicons.org/instagram/EFEFE9",
  Twitter: "https://cdn.simpleicons.org/x/EFEFE9",
  YouTube: "https://cdn.simpleicons.org/youtube/EFEFE9",
  TikTok: "https://cdn.simpleicons.org/tiktok/EFEFE9",
  Reddit: "https://cdn.simpleicons.org/reddit/EFEFE9",
  Discord: "https://cdn.simpleicons.org/discord/EFEFE9",
  Snapchat: "https://cdn.simpleicons.org/snapchat/EFEFE9",
  Quora: "https://cdn.simpleicons.org/quora/EFEFE9",
  Facebook: "https://cdn.simpleicons.org/facebook/EFEFE9",
};

const platformColors = {
  Instagram: "#E1306C",
  Twitter: "#1DA1F2",
  YouTube: "#FF0000",
  TikTok: "#69C9D0",
  Reddit: "#FF4500",
  Discord: "#5865F2",
  Snapchat: "#FFFC00",
  Quora: "#B92B27",
  Facebook: "#1877F2",
};

export default function AccountCard({ account, isSelected, onToggleSelect }) {
  const router = useRouter();
  const iconUrl = platformIcons[account.platform];
  const accentColor = platformColors[account.platform] ?? "#FF3B00";
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
    // Capture ref value in local var to avoid stale ref in cleanup
    const card = cardRef.current;
    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === card) st.kill();
      });
    };
  }, []);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(account);
    if (btnRef.current) {
      gsap.fromTo(btnRef.current, { scale: 1 }, {
        scale: 1.12, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1,
      });
    }
  };

  const handleCardClick = () => {
    router.push(`/products/${account.id}`);
  };

  return (
    <div
      ref={cardRef}
      id={`account-card-${account.id}`}
      onClick={handleCardClick}
      style={{
        background: isSelected ? "rgba(255,59,0,0.06)" : "#141414",
        border: isSelected ? "1px solid rgba(255,59,0,0.5)" : "1px solid rgba(239,239,233,0.08)",
        padding: "1.5rem",
        position: "relative",
        cursor: "pointer",
        transition: "border-color 0.2s ease, background 0.2s ease",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
      className="group hover:border-[rgba(239,239,233,0.2)]"
    >
      {/* Select checkbox — large touch target for mobile */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect && onToggleSelect(account.id);
        }}
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
          border: isSelected ? "1px solid #FF3B00" : "1px solid rgba(239,239,233,0.2)",
          background: isSelected ? "#FF3B00" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
          flexShrink: 0,
        }}>
          {isSelected && <Check size={11} strokeWidth={3} color="#EFEFE9" />}
        </span>
      </button>

      {/* Platform badge */}
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
          color: "rgba(239,239,233,0.45)",
        }}>
          {account.platform}
        </span>
        <span style={{
          marginLeft: "auto",
          marginRight: "1.75rem",
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: "18px",
          color: "#EFEFE9",
          letterSpacing: "-0.02em",
        }}>
          ${account.price}
        </span>
      </div>

      {/* Niche title */}
      <h3 style={{
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        fontSize: "clamp(1rem, 2vw, 1.25rem)",
        color: "#EFEFE9",
        letterSpacing: "-0.01em",
        lineHeight: 1.2,
        marginTop: "0.25rem",
      }}>
        {account.niche}
      </h3>

      {/* Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0.75rem",
        padding: "0.875rem",
        background: "rgba(239,239,233,0.03)",
        border: "1px solid rgba(239,239,233,0.06)",
      }}>
        {[
          { label: "Followers", value: account.followers },
          { label: "Engagement", value: account.engagement },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "8px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(239,239,233,0.3)",
              marginBottom: "4px",
            }}>
              {label}
            </div>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              fontWeight: 700,
              color: "#EFEFE9",
            }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Add to cart */}
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
          color: "#0D0D0D",
          background: "#EFEFE9",
          border: "none",
          cursor: "pointer",
          transition: "background 0.2s, color 0.2s",
          width: "100%",
          marginTop: "auto",
        }}
        className="hover:bg-[#FF3B00] hover:text-[#EFEFE9]"
      >
        <Plus size={13} strokeWidth={2.5} />
        Add to Cart
      </button>
    </div>
  );
}
