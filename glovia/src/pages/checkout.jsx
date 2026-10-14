import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./checkout.css";

function Checkout() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isBuyNow =
    new URLSearchParams(location.search).get("mode") === "buyNow";

  const buyNowItem = isBuyNow
    ? JSON.parse(localStorage.getItem("gloviaBuyNow") || "null")
    : null;

  const checkoutItems =
    isBuyNow && buyNowItem ? [buyNowItem] : cart;

  const subtotal = checkoutItems.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity || 1),
    0
  );

  const deliveryCharge = subtotal >= 999 ? 0 : 50;
  const finalTotal = subtotal + deliveryCharge;

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    email: "",
    house: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("gloviaToken");

    if (!token || localStorage.getItem("gloviaLoggedIn") !== "true") {
      navigate("/login");
      return;
    }

    if (!checkoutItems.length) {
      setError("Your cart is empty. Please add products first.");
      return;
    }

    // Save checkout details and continue to payment.
    const checkoutData = {
      address: { ...address },
      items: checkoutItems,
      total: subtotal,
      finalTotal,
      deliveryCharge,
      isBuyNow,
    };

    localStorage.setItem(
      "gloviaCheckout",
      JSON.stringify(checkoutData)
    );

    navigate("/payment");
  };

  return (
    <>
      <Navbar />

      <div className="checkout-page">
        <section className="checkout-heading">
          <p>GLOVIA COLLECTION</p>
          <h1>Checkout</h1>
          <span>
            Complete your order with your delivery details.
          </span>
        </section>

        {checkoutItems.length === 0 ? (
          <div className="checkout-empty">
            <h2>Your cart is empty!</h2>
            <p>Add some skincare products to continue.</p>
            <Link to="/products" className="checkout-shop-btn">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="checkout-container">
            <div className="checkout-form-section">
              <h2>Delivery Address</h2>

              {error && (
                <p className="checkout-error">{error}</p>
              )}

              <form onSubmit={handleSubmit}>
                <div className="checkout-form-grid">
                  <div className="checkout-field">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={address.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="checkout-field">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      required
                    />
                  </div>

                  <div className="checkout-field checkout-full-width">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={address.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="checkout-field checkout-full-width">
                    <label>House / Street Address</label>
                    <textarea
                      name="house"
                      value={address.house}
                      onChange={handleChange}
                      placeholder="Enter your complete address"
                      required
                    />
                  </div>

                  <div className="checkout-field">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                      required
                    />
                  </div>

                  <div className="checkout-field">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleChange}
                      placeholder="Enter state"
                      required
                    />
                  </div>

                  <div className="checkout-field checkout-full-width">
                    <label>PIN Code</label>
                    <input
                      type="text"
                      name="pincode"
                      value={address.pincode}
                      onChange={handleChange}
                      placeholder="Enter 6-digit PIN code"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="checkout-continue-btn"
                >
                  Continue to Payment
                </button>

                <p className="checkout-delivery-note">
                  Choose your payment method on the next page.
                </p>
              </form>
            </div>

            <div className="checkout-summary">
              <h2>Order Summary</h2>

              <div className="checkout-items">
                {checkoutItems.map((item, index) => (
                  <div
                    className="checkout-item"
                    key={item.id || index}
                  >
                    <img
                      src={item.image || item.Image}
                      alt={item.name || item.Name || "Product"}
                    />

                    <div className="checkout-item-info">
                      <h3>{item.name || item.Name}</h3>
                      <p>Qty: {item.quantity || 1}</p>
                      <p>
                        ₹{Number(item.price || item.Price || 0).toFixed(2)} each
                      </p>
                    </div>

                    <strong>
                      ₹
                      {(
                        Number(item.price || item.Price || 0) *
                        Number(item.quantity || 1)
                      ).toFixed(2)}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="checkout-price-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="checkout-price-row">
                <span>Delivery Charge</span>
                <span>
                  {deliveryCharge === 0
                    ? "FREE"
                    : `₹${deliveryCharge.toFixed(2)}`}
                </span>
              </div>

              <div className="checkout-price-row checkout-total">
                <span>Total Amount</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>

              <p className="checkout-delivery-note">
                Free delivery on orders above ₹999.
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Checkout;
