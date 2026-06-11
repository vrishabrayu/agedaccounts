"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("fastaccounts-cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure legacy items get a quantity of 1
        const withQuantity = parsed.map(item => ({...item, quantity: item.quantity || 1}));
        setCart(withQuantity);
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("fastaccounts-cart", JSON.stringify(cart));
  }, [cart]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  const addToCart = (account) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === account.id);
      if (existing) {
        return prev.map((item) =>
          item.id === account.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...account, quantity: 1 }];
    });
    setIsDrawerOpen(true);
    showToast("Added! Your products will be e-mailed to you after checkout.");
  };

  const addMultipleToCart = (accounts) => {
    setCart((prev) => {
      let nextCart = [...prev];
      accounts.forEach((acc) => {
        const existingIndex = nextCart.findIndex((item) => item.id === acc.id);
        if (existingIndex >= 0) {
          nextCart[existingIndex] = {
            ...nextCart[existingIndex],
            quantity: nextCart[existingIndex].quantity + 1
          };
        } else {
          nextCart.push({ ...acc, quantity: 1 });
        }
      });
      return nextCart;
    });
    if (accounts.length > 0) {
      setIsDrawerOpen(true);
      showToast(`${accounts.length} item${accounts.length > 1 ? "s" : ""} added! Your products will be e-mailed to you after checkout.`);
    }
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addMultipleToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isDrawerOpen,
        setIsDrawerOpen,
        toggleDrawer,
        cartTotal,
        cartItemCount,
        isCheckoutOpen,
        setIsCheckoutOpen,
        toast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
