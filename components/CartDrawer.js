"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { X, Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";

export default function CartDrawer() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    isDrawerOpen,
    setIsDrawerOpen,
    cartTotal,
    cartItemCount,
    clearCart,
    setIsCheckoutOpen,
  } = useCart();

  const handleCheckout = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setIsCheckoutOpen(true), 300);
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsDrawerOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "var(--overlay-backdrop)",
              backdropFilter: "blur(4px)",
              zIndex: 950,
            }}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
            role="dialog"
            aria-label="Shopping cart"
            id="cart-drawer"
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "min(440px, 100vw)",
              background: "var(--surface-elevated)",
              borderLeft: "1px solid var(--border)",
              zIndex: 960,
              display: "flex",
              flexDirection: "column",
              overflowY: "hidden",
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid var(--border)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <ShoppingBag size={16} color="var(--foreground)" opacity={0.7} />
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--foreground)",
                }}>
                  Cart ({cartItemCount})
                </span>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close cart"
                id="close-cart-btn"
                style={{ color: "var(--muted-foreground)", transition: "color 0.2s" }}
                className="hover:text-[var(--foreground)]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem", WebkitOverflowScrolling: "touch" }}>
              <AnimatePresence>
                {cart.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "1rem",
                      height: "100%",
                      color: "var(--text-faint)",
                    }}
                  >
                    <ShoppingBag size={40} strokeWidth={1} />
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                      Your cart is empty
                    </p>
                  </motion.div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
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
                        <div style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "9px",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: "var(--muted-foreground)",
                          marginBottom: "2px",
                        }}>
                          {item.platform}
                        </div>
                        <div style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "var(--foreground)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                          {item.niche}
                        </div>
                      </div>
                      {/* Qty controls */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{
                            width: 24, height: 24, border: "1px solid var(--border-strong)",
                            background: "transparent", color: "var(--foreground)", display: "flex",
                            alignItems: "center", justifyContent: "center", cursor: "pointer",
                          }}
                          className="hover:border-[var(--text-subtle)] transition-colors"
                        >
                          <Minus size={10} />
                        </button>
                        <span style={{
                          fontFamily: "var(--font-mono)", fontWeight: 700,
                          fontSize: "12px", color: "var(--foreground)", minWidth: "16px", textAlign: "center",
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{
                            width: 24, height: 24, border: "1px solid var(--border-strong)",
                            background: "transparent", color: "var(--foreground)", display: "flex",
                            alignItems: "center", justifyContent: "center", cursor: "pointer",
                          }}
                          className="hover:border-[var(--text-subtle)] transition-colors"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                      {/* Price */}
                      <div style={{
                        fontFamily: "var(--font-mono)", fontWeight: 700,
                        fontSize: "14px", color: "var(--foreground)", minWidth: "48px", textAlign: "right",
                      }}>
                        ${item.price * item.quantity}
                      </div>
                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.niche}`}
                        style={{ color: "var(--text-faint)", transition: "color 0.2s" }}
                        className="hover:text-[#FF3B00]"
                      >
                        <Trash2 size={13} />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div style={{
              padding: "1.25rem 1rem",
              paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))",
              borderTop: "1px solid var(--border)",
              background: "var(--background)",
              display: "flex",
              flexDirection: "column",
              gap: "0.875rem",
              flexShrink: 0,
            }}>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  id="clear-cart-btn"
                  style={{
                    fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700,
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    color: "var(--text-faint)", background: "transparent",
                    border: "none", cursor: "pointer", textAlign: "left",
                    transition: "color 0.2s",
                  }}
                  className="hover:text-[#FF3B00]"
                >
                  Clear all
                </button>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700,
                  letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-subtle)",
                }}>
                  Total
                </span>
                <span style={{
                  fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "24px",
                  letterSpacing: "-0.02em", color: "var(--foreground)",
                }}>
                  ${cartTotal}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                id="checkout-btn"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
                  padding: "1rem", width: "100%",
                  fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 700,
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  background: cart.length === 0 ? "var(--border)" : "#FF3B00",
                  color: cart.length === 0 ? "var(--text-faint)" : "var(--foreground)",
                  border: "none", cursor: cart.length === 0 ? "not-allowed" : "pointer",
                  transition: "background 0.2s, opacity 0.2s",
                }}
                className="hover:opacity-90"
              >
                Checkout Securely <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
