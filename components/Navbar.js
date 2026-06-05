"use client";
import { useCart } from "../context/CartContext";
import { ShoppingBag, Menu, X } from "lucide-react";
import styles from "./Navbar.module.css";
import { useState } from "react";

export default function Navbar() {
  const { cart, toggleDrawer } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className={styles.navbar} id="main-navbar">
        <div className={styles.left}>
          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            id="menu-toggle-btn"
          >
            <Menu size={20} />
          </button>
          <span className={styles.brand}>FAST ACCOUNTS</span>
        </div>

        <div className={styles.center}>
          <span className={styles.tagline}>
            PREMIUM SOCIAL ACCOUNTS
            <br />
            YOURS INSTANTLY
          </span>
        </div>

        <div className={styles.right}>
          <button
            className={styles.cartBtn}
            onClick={toggleDrawer}
            aria-label="Open Cart"
            id="nav-cart-btn"
          >
            <span className={styles.cartLabel}>
              CART {cart.length > 0 && `(${cart.length})`}
            </span>
            <ShoppingBag size={16} />
          </button>
        </div>
      </nav>

      {/* Full-screen menu overlay */}
      <div
        className={`${styles.menuOverlay} ${menuOpen ? styles.menuOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className={styles.menuHeader}>
          <button
            className={styles.menuClose}
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
            <span>CLOSE</span>
          </button>
        </div>
        <div className={styles.menuLinks}>
          <a
            href="#"
            className={styles.menuLink}
            onClick={() => {
              setMenuOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            HOME
          </a>
          <a
            href="#marketplace"
            className={styles.menuLink}
            onClick={() => setMenuOpen(false)}
          >
            MARKETPLACE
          </a>
          <a
            href="#"
            className={styles.menuLink}
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              toggleDrawer();
            }}
          >
            CART
          </a>
        </div>
        <div className={styles.menuFooter}>
          <span>© 2026 FAST ACCOUNTS</span>
        </div>
      </div>
    </>
  );
}
