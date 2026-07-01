import { Suspense } from "react";
import OrderSuccessClient from "../../../../components/OrderSuccessClient";

export const metadata = {
  title: "Order Success | Aged Accounts",
  description: "Your payment status and order confirmation.",
};

export const dynamic = "force-dynamic";

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            paddingTop: "calc(var(--navbar-height, 72px) + 3rem)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-mono)",
            color: "var(--muted-foreground)",
          }}
        >
          Loading order...
        </main>
      }
    >
      <OrderSuccessClient />
    </Suspense>
  );
}
