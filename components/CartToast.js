"use client";
import { useCart } from "../context/CartContext";
import { Mail, X } from "lucide-react";

export default function CartToast() {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.875rem 1.25rem",
        background: "var(--card)",
        border: "1px solid var(--border-strong)",
        boxShadow: "0 8px 48px var(--overlay-backdrop)",
        maxWidth: "min(480px, calc(100vw - 2rem))",
        width: "max-content",
        animation: "toastIn 0.35s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Icon */}
      <span
        style={{
          width: "28px",
          height: "28px",
          background: "rgba(255,59,0,0.12)",
          border: "1px solid rgba(255,59,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Mail size={13} color="#FF3B00" />
      </span>

      {/* Message */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--foreground)",
          lineHeight: 1.5,
        }}
      >
        {toast}
      </span>

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
