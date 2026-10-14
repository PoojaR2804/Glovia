import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/checkout";
import Payment from "./pages/Payment";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import OrderSuccess from "./pages/OrderSuccess";
import OrderTracking from "./pages/OrderTracking";
import MyOrders from "./pages/MyOrders";
import AddToCartPopup from "./components/AddToCartPopup";
import Profile from "./pages/Profile";

import { CartProvider } from "./context/CartContext";



function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}


function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />

        <Routes>
         
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          
          <Route path="/products" element={<Products />} />

          
          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />

          
          <Route
            path="/wishlist"
            element={<Wishlist />}
          />

          
          <Route
            path="/cart"
            element={<Cart />}
          />

          
          <Route
            path="/checkout"
            element={<Checkout />}
          />

          
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />
          <Route path="/Payment" element={<Payment />} />
          <Route path="/order-success" element={<OrderSuccess />} />

          <Route path="/track-order" element={<OrderTracking />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders" element={<AddToCartPopup />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;