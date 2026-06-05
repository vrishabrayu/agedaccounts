import "./globals.css";
import { CartProvider } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";
import CheckoutModal from "../components/CheckoutModal";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Fast Accounts | Premium Social Media Marketplace",
  description:
    "Acquire top-tier social media assets. Premium accounts, instant delivery, secure checkout.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          {children}
          <CartDrawer />
          <CheckoutModal />
        </CartProvider>
      </body>
    </html>
  );
}
