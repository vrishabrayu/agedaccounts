import { CartProvider } from "../../context/CartContext";
import CartDrawer from "../../components/CartDrawer";
import CheckoutModal from "../../components/CheckoutModal";
import CartToast from "../../components/CartToast";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function StorefrontLayout({ children }) {
  return (
    <CartProvider>
      <Navbar />
      {children}
      <Footer />
      <CartDrawer />
      <CheckoutModal />
      <CartToast />
    </CartProvider>
  );
}
