"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Plus, ShoppingBag, ArrowLeft, ShieldCheck, Mail, Key, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import gsap from "gsap";

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

export default function ProductDetailClient({ product }) {
  const { addToCart, cart } = useCart();
  const [added, setAdded] = useState(false);
  const btnRef = useRef(null);

  const iconUrl = platformIcons[product.platform];
  const accentColor = platformColors[product.platform] ?? "#FF3B00";

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    if (btnRef.current) {
      gsap.fromTo(btnRef.current, { scale: 1 }, {
        scale: 1.05, duration: 0.1, ease: "power2.out", yoyo: true, repeat: 1,
      });
    }
    setTimeout(() => setAdded(false), 2000);
  };

  const alreadyInCart = cart.some((item) => item.id === product.id);

  return (
    <div style={{ minHeight: "100vh", background: "#0D0D0D", color: "#EFEFE9", padding: "2rem clamp(1rem, 4vw, 3rem) 6rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Navigation / Breadcrumb */}
        <div style={{ marginBottom: "2rem" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(239,239,233,0.5)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            className="hover:text-[#FF3B00]"
          >
            <ArrowLeft size={14} /> Back to Marketplace
          </Link>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "3rem",
          alignItems: "start",
          marginBottom: "4rem"
        }}>
          
          {/* Left Column: Visual representation */}
          <div style={{
            background: "#141414",
            border: `1px solid rgba(239,239,233,0.08)`,
            padding: "3rem 2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            minHeight: "400px",
          }}>
            {/* Platform Accent Glow */}
            <div style={{
              position: "absolute",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background: accentColor,
              opacity: 0.08,
              filter: "blur(50px)",
              pointerEvents: "none",
            }} />

            {iconUrl && (
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "rgba(239,239,233,0.03)",
                border: "1px solid rgba(239,239,233,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2rem",
              }}>
                <Image
                  src={iconUrl}
                  alt={product.platform}
                  width={40}
                  height={40}
                  unoptimized
                />
              </div>
            )}

            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(239,239,233,0.45)",
              marginBottom: "0.5rem"
            }}>
              {product.platform}
            </span>

            <h2 style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "24px",
              color: "#EFEFE9",
              letterSpacing: "-0.02em",
              textAlign: "center",
              marginBottom: "2rem"
            }}>
              {product.niche}
            </h2>

            {/* Micro Specs */}
            <div style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1px",
              background: "rgba(239,239,233,0.06)",
              border: "1px solid rgba(239,239,233,0.06)",
            }}>
              {[
                { label: "Followers", value: product.followers || "—" },
                { label: "Engagement", value: product.engagement || "—" },
                { label: "Est. Year", value: "2012/2013" },
                { label: "Stock Available", value: product.availableStock }
              ].map(({ label, value }) => (
                <div key={label} style={{ background: "#141414", padding: "1rem", textAlign: "center" }}>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "8px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(239,239,233,0.35)",
                    marginBottom: "4px"
                  }}>
                    {label}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#EFEFE9"
                  }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Info, pricing, actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Title & Badge */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "#FF3B00",
                  border: "1px solid rgba(255,59,0,0.3)",
                  background: "rgba(255,59,0,0.05)",
                  padding: "0.25rem 0.5rem",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}>
                  Aged & Verified
                </span>
                <span style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "rgba(239,239,233,0.5)",
                  border: "1px solid rgba(239,239,233,0.15)",
                  padding: "0.25rem 0.5rem",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}>
                  Instant Delivery
                </span>
              </div>

              <h1 style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: "clamp(2rem, 3vw, 2.75rem)",
                color: "#EFEFE9",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}>
                {product.platform} Account ({product.niche})
              </h1>
            </div>

            {/* Stars Rating (Amazon/Flipkart style) */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ display: "flex", gap: "2px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={15} fill="#FF3B00" color="#FF3B00" />
                ))}
              </div>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                fontWeight: 700,
                color: "#EFEFE9",
              }}>
                4.9
              </span>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "rgba(239,239,233,0.4)",
              }}>
                (142 customer reviews)
              </span>
            </div>

            {/* Price section */}
            <div style={{
              borderTop: "1px solid rgba(239,239,233,0.08)",
              borderBottom: "1px solid rgba(239,239,233,0.08)",
              padding: "1.25rem 0",
              display: "flex",
              alignItems: "baseline",
              gap: "1rem",
            }}>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: "36px",
                color: "#EFEFE9",
                letterSpacing: "-0.02em",
              }}>
                ${product.price}
              </span>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "rgba(239,239,233,0.45)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>
                per account + full access
              </span>
            </div>

            {/* Quick Description */}
            <p style={{
              fontSize: "14px",
              fontFamily: "var(--font-sans)",
              color: "rgba(239,239,233,0.65)",
              lineHeight: 1.6,
            }}>
              High-quality, aged social media asset. Hand-registered and maintained to ensure maximum trust score and account health. Ready for business scaling or personal use.
            </p>

            {/* Add to Cart button */}
            <div style={{ marginTop: "1rem" }}>
              <button
                ref={btnRef}
                onClick={handleAddToCart}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                  width: "100%",
                  maxWidth: "400px",
                  padding: "1.1rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#0D0D0D",
                  background: added ? "#55EFC4" : "#EFEFE9",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.2s, color 0.2s",
                }}
                className="hover:bg-[#FF3B00] hover:text-[#EFEFE9]"
              >
                {added ? (
                  <>
                    <Check size={16} strokeWidth={2.5} />
                    Added!
                  </>
                ) : (
                  <>
                    <Plus size={16} strokeWidth={2.5} />
                    Add to Cart
                  </>
                )}
              </button>
              {alreadyInCart && (
                <div style={{
                  marginTop: "0.5rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  color: "rgba(239,239,233,0.4)",
                  letterSpacing: "0.05em"
                }}>
                  * This item is already in your cart.
                </div>
              )}
            </div>

            {/* Security Guarantee Box */}
            <div style={{
              display: "flex",
              gap: "0.75rem",
              padding: "1rem",
              background: "rgba(239,239,233,0.02)",
              border: "1px solid rgba(239,239,233,0.06)",
              marginTop: "1.5rem",
              maxWidth: "500px",
            }}>
              <ShieldCheck size={18} color="#FF3B00" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#EFEFE9", marginBottom: "4px" }}>
                  Instant Automated Delivery
                </h4>
                <p style={{ fontSize: "11px", color: "rgba(239,239,233,0.5)", lineHeight: 1.5 }}>
                  Credentials will be automatically sent to your provided email address immediately upon payment confirmation.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Detailed Description sections */}
        <div style={{
          borderTop: "1px solid rgba(239,239,233,0.08)",
          paddingTop: "4rem",
        }}>
          <h3 style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: "18px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#EFEFE9",
            marginBottom: "2.5rem"
          }}>
            Technical Specifications & Details
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2.5rem",
          }}>
            
            {/* Account Info */}
            <div style={{
              background: "#141414",
              border: "1px solid rgba(239,239,233,0.06)",
              padding: "2rem",
            }}>
              <h4 style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#FF3B00",
                marginBottom: "1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <ShieldCheck size={14} /> Account Information
              </h4>
              <ul style={{
                listStyleType: "square",
                paddingLeft: "1.25rem",
                margin: 0,
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                color: "rgba(239,239,233,0.65)",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                lineHeight: 1.5,
              }}>
                <li>Accounts are automatically registered, you'll get ready to use accounts.</li>
                <li>All accounts were originally created in 2012/13.</li>
                <li>Profiles are fully blank, with no added profile pictures and followers/followings.</li>
                <li>Two-Factor Authentication (2FA) is enabled on every account.</li>
                <li>Accounts have been registered using IP addresses from various countries.</li>
                <li>Mail provided will be Firstmail.ltd which can be secured by the client itself.</li>
              </ul>
            </div>

            {/* Important Info */}
            <div style={{
              background: "#141414",
              border: "1px solid rgba(239,239,233,0.06)",
              padding: "2rem",
            }}>
              <h4 style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#FF3B00",
                marginBottom: "1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <Mail size={14} /> Important Information
              </h4>
              <p style={{
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                color: "rgba(239,239,233,0.65)",
                lineHeight: 1.6,
                margin: 0,
              }}>
                Instagram may occasionally request SMS verification during login or account activity. This is a normal security measure. You can complete verification using your own phone number or a trusted SMS activation service.
              </p>
            </div>

            {/* Login Instructions */}
            <div style={{
              background: "#141414",
              border: "1px solid rgba(239,239,233,0.06)",
              padding: "2rem",
            }}>
              <h4 style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#FF3B00",
                marginBottom: "1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <Key size={14} /> Login Instructions
              </h4>
              <ul style={{
                listStyleType: "square",
                paddingLeft: "1.25rem",
                margin: 0,
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                color: "rgba(239,239,233,0.65)",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                lineHeight: 1.5,
              }}>
                <li>Always use the provided 2FA code or backup codes when signing in.</li>
                <li>Backup codes should be stored securely, as they can be used if you cannot access your authenticator.</li>
              </ul>
            </div>

          </div>

          {/* Account Data Format */}
          <div style={{
            background: "#141414",
            border: "1px solid rgba(239,239,233,0.06)",
            padding: "2rem",
            marginTop: "2.5rem",
          }}>
            <h4 style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#FF3B00",
              marginBottom: "1rem",
            }}>
              Account Data Format
            </h4>
            <p style={{
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              color: "rgba(239,239,233,0.65)",
              lineHeight: 1.6,
              marginBottom: "1.25rem",
            }}>
              Account details are provided in a standardized format for easy reading. The exact formatting may vary slightly between account sets and does not affect the quality or functionality of the account.
            </p>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              background: "#0D0D0D",
              padding: "1rem 1.5rem",
              border: "1px solid rgba(239,239,233,0.15)",
              color: "#FF3B00",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}>
              <span style={{ color: "rgba(239,239,233,0.4)" }}>Example Format:</span> Email : Email Password : Username : Password : 2FA Secret key
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
