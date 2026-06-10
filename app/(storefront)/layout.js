import { CartProvider } from "../../context/CartContext";
import CartDrawer from "../../components/CartDrawer";
import CheckoutModal from "../../components/CheckoutModal";
import Navbar from "../../components/Navbar";

export default function StorefrontLayout({ children }) {
  return (
    <CartProvider>
      <Navbar />
      {children}
      <CartDrawer />
      <CheckoutModal />
    </CartProvider>
  );
}
