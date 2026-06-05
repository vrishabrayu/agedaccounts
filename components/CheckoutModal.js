"use client";
import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useCart } from "../context/CartContext";
import styles from "./CheckoutModal.module.css";
import { X, ArrowRight } from "lucide-react";

export default function CheckoutModal() {
  const { cart, cartTotal, isCheckoutOpen, setIsCheckoutOpen, clearCart } =
    useCart();
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  const handleClose = useCallback(() => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25 });
    gsap.to(modalRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.25,
      onComplete: () => setIsCheckoutOpen(false),
    });
  }, [setIsCheckoutOpen]);

  useEffect(() => {
    if (!isCheckoutOpen) return;

    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    );
    gsap.fromTo(
      modalRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power4.out" }
    );

    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isCheckoutOpen, handleClose]);

  if (!isCheckoutOpen) return null;

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      id="checkout-modal"
    >
      <div
        className={styles.modal}
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.closeBtn}
          onClick={handleClose}
          aria-label="Close checkout modal"
        >
          <X size={20} />
        </button>

        <h2 id="checkout-modal-title" className={styles.title}>
          SECURE CHECKOUT
        </h2>

        <div className={styles.summary}>
          <div className={styles.summaryHeader}>
            <span>ORDER SUMMARY</span>
            <span>{cart.length} ITEMS</span>
          </div>
          <div className={styles.summaryItems}>
            {cart.map((item) => (
              <div key={item.id} className={styles.summaryItem}>
                <span>
                  {item.platform} — {item.niche}
                </span>
                <span>${item.price}</span>
              </div>
            ))}
          </div>
          <div className={styles.summaryTotal}>
            <span>TOTAL</span>
            <span>${cartTotal}</span>
          </div>
        </div>

        <div className={styles.paymentMethods}>
          <button className={styles.payBtn} onClick={() => {
            alert("Stripe integration coming soon. Total: $" + cartTotal);
            handleClose();
            clearCart();
          }}>
            <span>PAY WITH CARD (STRIPE)</span>
            <ArrowRight size={14} />
          </button>
          <button className={styles.payBtnSecondary} onClick={() => {
            alert("Crypto payment coming soon. Total: $" + cartTotal);
            handleClose();
            clearCart();
          }}>
            <span>PAY WITH CRYPTO</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <p className={styles.disclaimer}>
          STRIPE INTEGRATION PLACEHOLDER — CONNECT YOUR ACCOUNT LATER.
        </p>
      </div>
    </div>
  );
}
