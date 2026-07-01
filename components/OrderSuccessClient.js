"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "../context/CartContext";
import { CheckCircle2, Clock, XCircle, ArrowRight, Loader2 } from "lucide-react";

const STATUS_LABELS = {
  PENDING: "Payment pending",
  PAID: "Paid",
  FAILED: "Payment failed",
  FULFILLED: "Fulfilled",
};

function StatusIcon({ status }) {
  if (status === "PAID" || status === "FULFILLED") {
    return <CheckCircle2 size={28} color="#FF3B00" />;
  }
  if (status === "FAILED") {
    return <XCircle size={28} color="#FF3B00" />;
  }
  return <Clock size={28} color="#FF3B00" />;
}

export default function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 12;

    async function fetchOrder() {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load order.");
        }

        if (!cancelled) {
          setOrder(data.order);
          setLoading(false);

          if (data.order.status === "PENDING" && attempts < maxAttempts) {
            attempts += 1;
            setTimeout(fetchOrder, 5000);
          }
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message);
          setLoading(false);
        }
      }
    }

    fetchOrder();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const isPaid = order?.status === "PAID" || order?.status === "FULFILLED";

  return (
    <main
      style={{
        minHeight: "100vh",
        paddingTop: "calc(var(--navbar-height, 72px) + 3rem)",
        paddingBottom: "5rem",
        background: "var(--background)",
        paddingLeft: "clamp(1rem, 5vw, 4rem)",
        paddingRight: "clamp(1rem, 5vw, 4rem)",
      }}
    >
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        {loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              padding: "4rem 1rem",
              color: "var(--muted-foreground)",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            <Loader2 size={24} className="animate-spin" />
            Confirming your payment...
          </div>
        )}

        {!loading && error && (
          <div
            style={{
              border: "1px solid var(--border-strong)",
              padding: "2rem",
              background: "var(--card)",
            }}
          >
            <h1
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--foreground)",
                marginBottom: "0.75rem",
              }}
            >
              Order not found
            </h1>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--muted-foreground)" }}>
              {error}
            </p>
          </div>
        )}

        {!loading && order && (
          <div
            style={{
              border: "1px solid var(--border-strong)",
              background: "var(--card)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "2rem",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "1rem",
              }}
            >
              <StatusIcon status={order.status} />
              <div>
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
                  Order Confirmation
                </p>
                <h1
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(1.5rem, 4vw, 2rem)",
                    fontWeight: 700,
                    color: "var(--foreground)",
                    lineHeight: 1.15,
                  }}
                >
                  {isPaid ? "Payment received successfully." : "Payment status update"}
                </h1>
              </div>
            </div>

            <div style={{ padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                }}
              >
                <div>
                  <div style={{ color: "var(--text-faint)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                    Order ID
                  </div>
                  <div style={{ color: "var(--foreground)", wordBreak: "break-all" }}>{order.id}</div>
                </div>
                <div>
                  <div style={{ color: "var(--text-faint)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                    Payment Status
                  </div>
                  <div style={{ color: "var(--foreground)", fontWeight: 700 }}>
                    {STATUS_LABELS[order.status] || order.status}
                  </div>
                </div>
                <div>
                  <div style={{ color: "var(--text-faint)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                    Amount
                  </div>
                  <div style={{ color: "var(--foreground)", fontWeight: 700 }}>${order.amount.toFixed(2)}</div>
                </div>
                <div>
                  <div style={{ color: "var(--text-faint)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                    Email
                  </div>
                  <div style={{ color: "var(--foreground)" }}>{order.customerEmail}</div>
                </div>
              </div>

              <div
                style={{
                  marginTop: "0.5rem",
                  padding: "1rem",
                  background: "var(--stat-bg)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--foreground)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Next steps
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.4rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    color: "var(--muted-foreground)",
                    lineHeight: 1.6,
                  }}
                >
                  {isPaid ? (
                    <>
                      <li>Your payment has been confirmed on NOWPayments.</li>
                      <li>Account credentials will be delivered to your email shortly.</li>
                      <li>Check your inbox and spam folder within the next few minutes.</li>
                    </>
                  ) : order.status === "PENDING" ? (
                    <>
                      <li>Your payment is being confirmed on the blockchain.</li>
                      <li>This page will update automatically once payment is finished.</li>
                      <li>You will receive credentials by email after confirmation.</li>
                    </>
                  ) : (
                    <>
                      <li>Your payment could not be completed.</li>
                      <li>Return to your cart and try again, or contact support.</li>
                    </>
                  )}
                </ul>
              </div>

              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                  padding: "0.9rem 1.25rem",
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
                Back to Marketplace <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
