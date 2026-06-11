"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { useCart } from "../context/CartContext";
import { X, ArrowRight, Shield } from "lucide-react";

export default function CheckoutModal() {
  const { cart, cartTotal, isCheckoutOpen, setIsCheckoutOpen, clearCart } = useCart();
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const [paymentNotice, setPaymentNotice] = useState(null);

  const handleClose = useCallback(() => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.22 });
    gsap.to(modalRef.current, {
      y: 24, opacity: 0, duration: 0.22,
      onComplete: () => setIsCheckoutOpen(false),
    });
  }, [setIsCheckoutOpen]);

  useEffect(() => {
    if (!isCheckoutOpen) return;
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.28 });
    gsap.fromTo(modalRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42, ease: "power4.out" });

    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isCheckoutOpen, handleClose]);

  if (!isCheckoutOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      id="checkout-modal"
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface-elevated)",
          border: "1px solid var(--border-strong)",
          width: "100%",
          maxWidth: "480px",
          padding: "2rem",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          aria-label="Close checkout"
          style={{
            position: "absolute", top: "1rem", right: "1rem",
            color: "var(--text-subtle)", transition: "color 0.2s",
          }}
          className="hover:text-[var(--foreground)]"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <Shield size={14} color="#FF3B00" />
          <h2
            id="checkout-modal-title"
            style={{
              fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "11px",
              letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--foreground)",
            }}
          >
            Secure Checkout
          </h2>
        </div>

        {/* Order summary */}
        <div style={{
          background: "var(--card)", border: "1px solid var(--border)",
          padding: "1rem", marginBottom: "1.5rem",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "var(--muted-foreground)", marginBottom: "0.75rem",
          }}>
            <span>Order Summary</span>
            <span>{cart.length} Item{cart.length !== 1 ? "s" : ""}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {cart.map((item) => (
              <div key={item.id} style={{
                display: "flex", justifyContent: "space-between",
                fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--muted-foreground)",
              }}>
                <span>{item.platform} — {item.niche}</span>
                <span>${item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            marginTop: "0.875rem", paddingTop: "0.875rem",
            borderTop: "1px solid var(--border)",
            fontFamily: "var(--font-mono)",
          }}>
            <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-subtle)" }}>
              Total
            </span>
            <span style={{ fontSize: "22px", fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
              ${cartTotal}
            </span>
          </div>
        </div>

        {/* Payment buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* Inline payment notice — shown when user clicks before Stripe is wired */}
          {paymentNotice && (
            <div style={{
              padding: "0.875rem 1rem",
              background: "rgba(255,59,0,0.08)",
              border: "1px solid rgba(255,59,0,0.3)",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#FF3B00",
              lineHeight: 1.6,
            }}>
              {paymentNotice}
            </div>
          )}
          <button
            onClick={() => setPaymentNotice(`Stripe checkout coming soon. Your total of $${cartTotal} has been saved.`)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
              padding: "1rem", width: "100%", background: "#FF3B00", color: "var(--foreground)",
              fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 700,
              letterSpacing: "0.15em", textTransform: "uppercase", border: "none", cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            className="hover:opacity-90"
          >
            Pay with Card (Stripe) <ArrowRight size={14} />
          </button>
          <button
            onClick={() => setPaymentNotice(`Crypto checkout coming soon. Your total of $${cartTotal} has been saved.`)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
              padding: "1rem", width: "100%", background: "transparent", color: "var(--muted-foreground)",
              fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 700,
              letterSpacing: "0.15em", textTransform: "uppercase",
              border: "1px solid var(--border-strong)", cursor: "pointer",
              transition: "border-color 0.2s, color 0.2s",
            }}
            className="hover:border-[var(--text-subtle)] hover:text-[var(--foreground)]"
          >
            Pay with Crypto <ArrowRight size={14} />
          </button>
        </div>

        <p style={{
          marginTop: "1rem", textAlign: "center",
          fontFamily: "var(--font-mono)", fontSize: "8px",
          letterSpacing: "0.15em", textTransform: "uppercase",
          color: "var(--border-strong)",
        }}>
          Payment integration — connect your provider later.
        </p>
      </div>
    </div>
  );
}
