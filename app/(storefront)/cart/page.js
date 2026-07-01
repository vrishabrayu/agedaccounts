"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "../../../context/CartContext";
import { ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const {
    cart,
    cartTotal,
    cartItemCount,
    removeFromCart,
    updateQuantity,
    setIsCheckoutOpen,
    setIsDrawerOpen,
  } = useCart();

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [setIsDrawerOpen]);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCheckoutOpen(true);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        paddingTop: "calc(var(--navbar-height, 72px) + 2.5rem)",
        paddingBottom: "5rem",
        background: "var(--background)",
        paddingLeft: "clamp(1rem, 5vw, 4rem)",
        paddingRight: "clamp(1rem, 5vw, 4rem)",
      }}
    >
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "2rem",
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--filter-inactive)",
            minHeight: "unset",
          }}
          className="hover:text-[var(--foreground)]"
        >
          <ArrowLeft size={14} /> Continue Shopping
        </Link>

        <div style={{ marginBottom: "2rem" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--muted-foreground)",
              marginBottom: "0.5rem",
            }}
          >
            Your Cart
          </p>
          <h1
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              color: "var(--foreground)",
              letterSpacing: "-0.02em",
            }}
          >
            {cartItemCount} item{cartItemCount !== 1 ? "s" : ""}
          </h1>
        </div>

        {cart.length === 0 ? (
          <div
            style={{
              border: "1px solid var(--border)",
              background: "var(--card)",
              padding: "3rem 2rem",
              textAlign: "center",
            }}
          >
            <ShoppingBag size={36} strokeWidth={1} color="var(--muted-foreground)" style={{ margin: "0 auto 1rem" }} />
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--muted-foreground)",
                marginBottom: "1.5rem",
              }}
            >
              Your cart is empty
            </p>
            <Link
              href="/#marketplace"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.85rem 1.25rem",
                background: "#FF3B00",
                color: "var(--accent-foreground-color)",
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                minHeight: "unset",
              }}
            >
              Browse Marketplace <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "9px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {item.platform}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "var(--foreground)",
                      }}
                    >
                      {item.niche}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{
                        width: 28,
                        height: 28,
                        border: "1px solid var(--border-strong)",
                        color: "var(--foreground)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      −
                    </button>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        minWidth: 20,
                        textAlign: "center",
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{
                        width: 28,
                        height: 28,
                        border: "1px solid var(--border-strong)",
                        color: "var(--foreground)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      +
                    </button>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: 700,
                      minWidth: 56,
                      textAlign: "right",
                    }}
                  >
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      color: "var(--text-faint)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      minHeight: "unset",
                    }}
                    className="hover:text-[#FF3B00]"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div
              style={{
                border: "1px solid var(--border-strong)",
                background: "var(--card)",
                padding: "1.25rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: "1rem",
                  fontFamily: "var(--font-mono)",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--muted-foreground)",
                  }}
                >
                  Total
                </span>
                <span style={{ fontSize: "24px", fontWeight: 700 }}>${cartTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  width: "100%",
                  padding: "1rem",
                  background: "#FF3B00",
                  color: "var(--accent-foreground-color)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  border: "none",
                  cursor: "pointer",
                }}
                className="hover:opacity-90"
              >
                Proceed to Checkout <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
