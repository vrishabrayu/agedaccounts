"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { useCart } from "../context/CartContext";
import { X, ArrowRight, Shield, Mail, CheckCircle2 } from "lucide-react";

export default function CheckoutModal() {
  const { cart, cartTotal, isCheckoutOpen, setIsCheckoutOpen, clearCart } = useCart();
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  // Step: "summary" | "email" | "success"
  const [step, setStep] = useState("summary");
  const [paymentMethod, setPaymentMethod] = useState(null); // "card" | "crypto"
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");

  const handleClose = useCallback(() => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.22 });
    gsap.to(modalRef.current, {
      y: 24, opacity: 0, duration: 0.22,
      onComplete: () => {
        setIsCheckoutOpen(false);
        // Reset state after close animation
        setTimeout(() => {
          setStep("summary");
          setEmail("");
          setEmailError("");
          setPaymentMethod(null);
        }, 100);
      },
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

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleProceed = (method) => {
    setPaymentMethod(method);
    setStep("email");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setSubmitting(true);
    // Simulate order submission — replace with real API call when backend is ready
    await new Promise((r) => setTimeout(r, 1200));
    const id = `ORD-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(id);
    setStep("success");
    clearCart();
    setSubmitting(false);
  };

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
        background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111111", border: "1px solid rgba(239,239,233,0.12)",
          width: "100%", maxWidth: "480px", padding: "2rem", position: "relative",
        }}
      >
        {/* Close */}
        {step !== "success" && (
          <button
            onClick={handleClose}
            aria-label="Close checkout"
            style={{
              position: "absolute", top: "1rem", right: "1rem",
              color: "rgba(239,239,233,0.4)", transition: "color 0.2s",
            }}
            className="hover:text-[#EFEFE9]"
          >
            <X size={18} />
          </button>
        )}

        {/* ── STEP: Order Summary ── */}
        {step === "summary" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <Shield size={14} color="#FF3B00" />
              <h2 id="checkout-modal-title" style={{
                fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "11px",
                letterSpacing: "0.2em", textTransform: "uppercase", color: "#EFEFE9",
              }}>
                Secure Checkout
              </h2>
            </div>

            {/* Order summary */}
            <div style={{
              background: "#1A1A1A", border: "1px solid rgba(239,239,233,0.07)",
              padding: "1rem", marginBottom: "1.5rem",
            }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "rgba(239,239,233,0.35)", marginBottom: "0.75rem",
              }}>
                <span>Order Summary</span>
                <span>{cart.length} Item{cart.length !== 1 ? "s" : ""}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {cart.map((item) => (
                  <div key={item.id} style={{
                    display: "flex", justifyContent: "space-between",
                    fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(239,239,233,0.7)",
                  }}>
                    <span>{item.platform} — {item.niche}{item.quantity > 1 ? ` ×${item.quantity}` : ""}</span>
                    <span>${item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "baseline",
                marginTop: "0.875rem", paddingTop: "0.875rem",
                borderTop: "1px solid rgba(239,239,233,0.08)", fontFamily: "var(--font-mono)",
              }}>
                <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(239,239,233,0.4)" }}>Total</span>
                <span style={{ fontSize: "22px", fontWeight: 700, color: "#EFEFE9", letterSpacing: "-0.02em" }}>${cartTotal}</span>
              </div>
            </div>

            {/* Payment options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button
                onClick={() => handleProceed("card")}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
                  padding: "1rem", width: "100%", background: "#FF3B00", color: "#EFEFE9",
                  fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 700,
                  letterSpacing: "0.15em", textTransform: "uppercase", border: "none", cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
                className="hover:opacity-90"
              >
                Pay with Card (Stripe) <ArrowRight size={14} />
              </button>
              <button
                onClick={() => handleProceed("crypto")}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
                  padding: "1rem", width: "100%", background: "transparent", color: "rgba(239,239,233,0.65)",
                  fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 700,
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  border: "1px solid rgba(239,239,233,0.15)", cursor: "pointer",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                className="hover:border-[rgba(239,239,233,0.4)] hover:text-[#EFEFE9]"
              >
                Pay with Crypto <ArrowRight size={14} />
              </button>
            </div>

            <p style={{
              marginTop: "1rem", textAlign: "center", fontFamily: "var(--font-mono)",
              fontSize: "8px", letterSpacing: "0.15em", textTransform: "uppercase",
              color: "rgba(239,239,233,0.2)",
            }}>
              256-bit SSL encryption · Instant delivery
            </p>
          </>
        )}

        {/* ── STEP: Email Capture ── */}
        {step === "email" && (
          <>
            <button
              onClick={() => setStep("summary")}
              style={{
                display: "flex", alignItems: "center", gap: "0.35rem",
                fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700,
                letterSpacing: "0.15em", textTransform: "uppercase",
                color: "rgba(239,239,233,0.35)", background: "transparent",
                border: "none", cursor: "pointer", marginBottom: "1.5rem",
                transition: "color 0.2s",
              }}
              className="hover:text-[#EFEFE9]"
            >
              ← Back
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <Mail size={14} color="#FF3B00" />
              <h2 id="checkout-modal-title" style={{
                fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "11px",
                letterSpacing: "0.2em", textTransform: "uppercase", color: "#EFEFE9",
              }}>
                Where to send your accounts
              </h2>
            </div>

            <p style={{
              fontFamily: "var(--font-sans)", fontSize: "0.875rem",
              color: "rgba(239,239,233,0.5)", lineHeight: 1.65, marginBottom: "1.5rem",
            }}>
              Enter the email address where you'd like to receive your account credentials.
              {paymentMethod === "card" ? " You'll be redirected to Stripe to complete payment." : " You'll receive a crypto payment address next."}
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label
                  htmlFor="checkout-email"
                  style={{
                    display: "block", fontFamily: "var(--font-mono)", fontSize: "9px",
                    fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                    color: "rgba(239,239,233,0.4)", marginBottom: "0.5rem",
                  }}
                >
                  Delivery Email
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                  placeholder="your@email.com"
                  autoFocus
                  required
                  style={{
                    width: "100%", padding: "0.875rem 1rem",
                    background: "#1A1A1A", border: emailError
                      ? "1px solid #FF3B00"
                      : "1px solid rgba(239,239,233,0.12)",
                    color: "#EFEFE9", fontFamily: "var(--font-mono)", fontSize: "13px",
                    outline: "none", transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(239,239,233,0.35)"; }}
                  onBlur={(e) => { if (!emailError) e.target.style.borderColor = "rgba(239,239,233,0.12)"; }}
                />
                {emailError && (
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: "9px",
                    color: "#FF3B00", marginTop: "0.4rem", letterSpacing: "0.1em",
                  }}>
                    {emailError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
                  padding: "1rem", width: "100%",
                  background: submitting ? "rgba(255,59,0,0.5)" : "#FF3B00",
                  color: "#EFEFE9", fontFamily: "var(--font-mono)", fontSize: "11px",
                  fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
                  border: "none", cursor: submitting ? "not-allowed" : "pointer",
                  transition: "opacity 0.2s",
                }}
                className="hover:opacity-90"
              >
                {submitting ? "Processing…" : `Place Order — $${cartTotal}`}
                {!submitting && <ArrowRight size={14} />}
              </button>
            </form>
          </>
        )}

        {/* ── STEP: Success ── */}
        {step === "success" && (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <CheckCircle2 size={48} color="#FF3B00" style={{ margin: "0 auto 1.5rem" }} />
            <h2 style={{
              fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "1.1rem",
              letterSpacing: "-0.01em", color: "#EFEFE9", marginBottom: "0.75rem",
            }}>
              ORDER RECEIVED
            </h2>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: "0.9rem",
              color: "rgba(239,239,233,0.55)", lineHeight: 1.65, marginBottom: "1.5rem",
            }}>
              Your order <strong style={{ color: "#EFEFE9", fontFamily: "var(--font-mono)" }}>{orderId}</strong> has been placed.
              Account credentials will be delivered to <strong style={{ color: "#EFEFE9" }}>{email}</strong> within minutes.
            </p>
            <div style={{
              padding: "1rem",
              background: "rgba(255,59,0,0.06)", border: "1px solid rgba(255,59,0,0.2)",
              fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em",
              textTransform: "uppercase", color: "rgba(239,239,233,0.5)",
              marginBottom: "1.5rem", lineHeight: 1.8,
            }}>
              Check your spam folder if you don't see the email within 15 minutes.
              Contact support@ageddaccount.store with your order ID if you need help.
            </div>
            <button
              onClick={handleClose}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                padding: "0.875rem 2rem", background: "#EFEFE9", color: "#0D0D0D",
                fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700,
                letterSpacing: "0.15em", textTransform: "uppercase", border: "none",
                cursor: "pointer", transition: "opacity 0.2s", width: "100%",
              }}
              className="hover:opacity-85"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
