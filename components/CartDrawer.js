"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useCart } from "../context/CartContext";
import styles from "./CartDrawer.module.css";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

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
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isDrawerOpen) {
      gsap.to(overlayRef.current, {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.3,
      });
      gsap.to(drawerRef.current, {
        x: 0,
        duration: 0.5,
        ease: "power4.out",
      });
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.3,
      });
      gsap.to(drawerRef.current, {
        x: "100%",
        duration: 0.4,
        ease: "power4.in",
      });
    }
  }, [isDrawerOpen]);

  const handleCheckout = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setIsCheckoutOpen(true);
    }, 300);
  };

  return (
    <>
      <div
        className={styles.overlay}
        ref={overlayRef}
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden={!isDrawerOpen}
      />
      <div
        className={styles.drawer}
        ref={drawerRef}
        aria-hidden={!isDrawerOpen}
        role="dialog"
        aria-label="Shopping cart"
        id="cart-drawer"
      >
        <div className={styles.header}>
          <h2>YOUR CART ({cartItemCount})</h2>
          <button
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close cart"
            id="close-cart-btn"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.items}>
          {cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <ShoppingBag size={40} strokeWidth={1} />
              <p>YOUR CART IS EMPTY.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemInfo}>
                  <div className={styles.itemPlatform}>{item.platform} account</div>
                  <div className={styles.itemNiche}>{item.niche}</div>
                </div>
                <div className={styles.itemRight}>
                  <div className={styles.itemPrice}>${item.price * item.quantity}</div>
                  <div className={styles.qtyControls}>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className={styles.qtyBtn}
                    >-</button>
                    <span className={styles.qtyValue}>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className={styles.qtyBtn}
                    >+</button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className={styles.removeBtn}
                    aria-label={`Remove ${item.niche} from cart`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.footer}>
          {cart.length > 0 && (
            <button
              className={styles.clearBtn}
              onClick={clearCart}
              id="clear-cart-btn"
            >
              CLEAR ALL
            </button>
          )}
          <div className={styles.totalRow}>
            <span>TOTAL</span>
            <span className={styles.totalPrice}>${cartTotal}</span>
          </div>
          <button
            className={styles.checkoutBtn}
            disabled={cart.length === 0}
            onClick={handleCheckout}
            id="checkout-btn"
          >
            <span>CHECKOUT SECURELY</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
