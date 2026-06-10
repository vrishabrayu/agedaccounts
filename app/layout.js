import "./globals.css";
import { CartProvider } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";
import CheckoutModal from "../components/CheckoutModal";
import CartToast from "../components/CartToast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Aged Accounts | Premium Social Media Marketplace",
  description:
    "Acquire top-tier social media assets. Premium accounts, instant delivery, secure checkout.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Aged Accounts",
  },
};

// Next.js 14+ requires viewport in a separate export
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0D0D0D",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
          <CartDrawer />
          <CheckoutModal />
          <CartToast />
        </CartProvider>
      </body>
    </html>
  );
}
