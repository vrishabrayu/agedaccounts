"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { useCart } from "../context/CartContext";
import {
  X,
  ArrowRight,
  Shield,
  Loader2,
  Lock,
  Mail,
  Check,
} from "lucide-react";

const SELECTABLE_COINS = [
  { id: "usdtbsc", name: "Tether USD (BSC)", label: "Tether USD (BSC/BEP20)", recommended: true },
  { id: "btc", name: "Bitcoin (BTC)", label: "Bitcoin (BTC)" },
  { id: "eth", name: "Ethereum (ETH)", label: "Ethereum (ETH)" },
  { id: "ltc", name: "Litecoin (LTC)", label: "Litecoin (LTC)" },
];

export default function CheckoutModal() {
  const { cart, cartTotal, isCheckoutOpen, setIsCheckoutOpen } = useCart();
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState("usdtbsc");
  const [paymentNotice, setPaymentNotice] = useState(null);

  const handleClose = useCallback(() => {
    if (loading) return;
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.22 });
    gsap.to(modalRef.current, {
      y: 24,
      opacity: 0,
      duration: 0.22,
      onComplete: () => {
        setIsCheckoutOpen(false);
        setError(null);
        setLoading(false);
        setPaymentNotice(null);
      },
    });
  }, [setIsCheckoutOpen, loading]);

  useEffect(() => {
    if (!isCheckoutOpen) return;
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.28 });
    gsap.fromTo(
      modalRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.42, ease: "power4.out" }
    );

    const onKey = (e) => {
      if (e.key === "Escape" && !loading) handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isCheckoutOpen, handleClose, loading]);

  const handlePayWithCryptocurrency = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Enter your email to receive your account credentials.");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError(null);
    setPaymentNotice(null);

    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          coin: selectedCoin,
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            niche: item.niche,
            platform: item.platform,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not start checkout.");
      }

      if (!data.invoiceUrl) {
        throw new Error("Payment provider did not return a checkout URL.");
      }

      window.location.href = data.invoiceUrl;
    } catch (checkoutError) {
      setError(checkoutError.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (!isCheckoutOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={() => !loading && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      id="checkout-modal"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111111",
          border: "1px solid rgba(239,239,233,0.12)",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "min(92vh, 900px)",
          overflowY: "auto",
          position: "relative",
          padding: "2rem",
        }}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          disabled={loading}
          aria-label="Close checkout"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            color: "rgba(239,239,233,0.4)",
            transition: "color 0.2s",
            opacity: loading ? 0.4 : 1,
          }}
          className="hover:text-[#EFEFE9]"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <Shield size={14} color="#FF3B00" />
          <h2
            id="checkout-modal-title"
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#EFEFE9",
            }}
          >
            Secure Checkout
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Order summary */}
          <div style={{
            background: "#1A1A1A",
            border: "1px solid rgba(239,239,233,0.07)",
            padding: "1rem",
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(239,239,233,0.35)",
              marginBottom: "0.75rem",
            }}>
              <span>Order Summary</span>
              <span>{cart.length} Item{cart.length !== 1 ? "s" : ""}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {cart.map((item) => (
                <div key={item.id} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "rgba(239,239,233,0.7)",
                }}>
                  <span>{item.platform} — {item.niche} {item.quantity > 1 ? ` ×${item.quantity}` : ""}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginTop: "0.875rem",
              paddingTop: "0.875rem",
              borderTop: "1px solid rgba(239,239,233,0.08)",
              fontFamily: "var(--font-mono)",
            }}>
              <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(239,239,233,0.4)" }}>
                Total
              </span>
              <span style={{ fontSize: "22px", fontWeight: 700, color: "#EFEFE9", letterSpacing: "-0.02em" }}>
                ${cartTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Email input */}
          <div>
            <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <span style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(239,239,233,0.45)",
              }}>
                <Mail size={12} />
                Delivery Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                required
                autoComplete="email"
                style={{
                  width: "100%",
                  padding: "0.9rem 1rem",
                  border: "1px solid rgba(239,239,233,0.15)",
                  background: "#0D0D0D",
                  color: "#EFEFE9",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                  outline: "none",
                }}
              />
            </label>
            <p style={{
              marginTop: "0.5rem",
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              color: "rgba(239,239,233,0.3)",
              letterSpacing: "0.06em",
              lineHeight: 1.5,
            }}>
              Account credentials will be delivered to this email after payment is confirmed.
            </p>
          </div>

          {/* Crypto selection */}
          <div style={{
            background: "rgba(239,239,233,0.03)",
            border: "1px solid rgba(239,239,233,0.06)",
            padding: "1rem",
          }}>
            <h3 style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#EFEFE9",
              marginBottom: "0.5rem",
            }}>
              Select Cryptocurrency
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.875rem" }}>
              {SELECTABLE_COINS.map((coin) => {
                const isSelected = selectedCoin === coin.id;
                return (
                  <button
                    key={coin.id}
                    type="button"
                    onClick={() => setSelectedCoin(coin.id)}
                    disabled={loading}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem 0.85rem",
                      width: "100%",
                      background: isSelected ? "rgba(255,59,0,0.06)" : "#0D0D0D",
                      border: isSelected ? "1px solid #FF3B00" : "1px solid rgba(239,239,233,0.08)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      color: "#EFEFE9",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                      minHeight: "unset",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        border: isSelected ? "3px solid #FF3B00" : "1px solid rgba(239,239,233,0.2)",
                        background: isSelected ? "transparent" : "#1A1A1A",
                      }} />
                      <span style={{ fontWeight: isSelected ? 700 : 400 }}>{coin.name}</span>
                    </div>
                    {coin.recommended && (
                      <span style={{
                        fontSize: "7.5px",
                        fontWeight: 700,
                        color: "#FF3B00",
                        background: "rgba(255,59,0,0.08)",
                        padding: "1px 5px",
                        letterSpacing: "0.03em",
                      }}>
                        ⭐ RECOMMENDED
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p style={{
              marginTop: "0.875rem",
              paddingTop: "0.875rem",
              borderTop: "1px solid rgba(239,239,233,0.08)",
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              color: "rgba(239,239,233,0.3)",
              lineHeight: 1.55,
            }}>
              You will be redirected directly to the secure payment page with the QR code and wallet address for your selected coin.
            </p>
          </div>

          {/* Secure Payment Trust Box */}
          <div style={{
            display: "flex",
            gap: "0.75rem",
            padding: "0.875rem 1rem",
            background: "rgba(255,59,0,0.05)",
            border: "1px solid rgba(255,59,0,0.15)",
          }}>
            <Lock size={14} color="#FF3B00" style={{ flexShrink: 0, marginTop: "2px" }} />
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              color: "rgba(239,239,233,0.55)",
              lineHeight: 1.65,
              letterSpacing: "0.04em",
            }}>
              Secure payment powered by NOWPayments. Your payment is processed securely and supports 300+ cryptocurrencies.
            </p>
          </div>

          {/* Errors & Notices */}
          {error && (
            <div style={{
              padding: "0.875rem 1rem",
              background: "rgba(255,59,0,0.08)",
              border: "1px solid rgba(255,59,0,0.3)",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              fontWeight: 700,
              color: "#FF3B00",
              lineHeight: 1.6,
            }}>
              {error}
            </div>
          )}

          {paymentNotice && (
            <div style={{
              padding: "0.875rem 1rem",
              background: "rgba(255,59,0,0.08)",
              border: "1px solid rgba(255,59,0,0.3)",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              fontWeight: 700,
              color: "#FF3B00",
              lineHeight: 1.6,
            }}>
              {paymentNotice}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <button
              onClick={handlePayWithCryptocurrency}
              disabled={loading || cart.length === 0}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                padding: "1.05rem 1.25rem",
                width: "100%",
                background: "#FF3B00",
                color: "#EFEFE9",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                border: "none",
                cursor: loading || cart.length === 0 ? "not-allowed" : "pointer",
                opacity: loading || cart.length === 0 ? 0.6 : 1,
                transition: "opacity 0.2s",
              }}
              className="hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Redirecting to NOWPayments...
                </>
              ) : (
                <>
                  Pay with Crypto
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
