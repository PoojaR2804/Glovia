import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const [profileOpen, setProfileOpen] = useState(false);
  const [categoriesActive, setCategoriesActive] = useState(false);

  const isLoggedIn =
    localStorage.getItem("gloviaLoggedIn") === "true" &&
    Boolean(localStorage.getItem("gloviaToken"));

  const handleLogout = () => {
    // Clear login information
    localStorage.removeItem("gloviaLoggedIn");
    localStorage.removeItem("gloviaToken");

    // Clear frontend-only cart and wishlist copies
    [
      "gloviaCart",
      "gloviaWishlist",
      "cart",
      "wishlist",
    ].forEach((key) => localStorage.removeItem(key));

    setProfileOpen(false);

    // Reload the app to reset React state
    window.location.replace("/");
  };

  const handleCategoriesClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      setCategoriesActive(true);

      document.getElementById("categories")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      navigate("/");

      setTimeout(() => {
        document.getElementById("categories")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  return (
    <nav className="glovia-navbar">
      {/* Logo */}
      <Link to="/" className="glovia-logo">
        <span className="logo-text">GLOVIA</span>

        <div className="logo-decoration">
          <i></i>
          <b>♡</b>
          <i></i>
        </div>
      </Link>

      {/* Navigation */}
      <div className="main-navigation">
        <Link
          to="/"
          className={
            location.pathname === "/" && !categoriesActive
              ? "active"
              : ""
          }
          onClick={() => setCategoriesActive(false)}
        >
          Home
          {location.pathname === "/" && !categoriesActive && (
            <span className="nav-dot"></span>
          )}
        </Link>

        <Link
          to="/products"
          className={
            location.pathname === "/products" ? "active" : ""
          }
        >
          Shop
          {location.pathname === "/products" && (
            <span className="nav-dot"></span>
          )}
        </Link>

        <a
          href="#categories"
          className={categoriesActive ? "active" : ""}
          onClick={handleCategoriesClick}
        >
          Categories
          {categoriesActive && (
            <span className="nav-dot"></span>
          )}
        </a>

        {/* Wishlist */}
        <Link
          to={isLoggedIn ? "/wishlist" : "/login"}
          className={
            location.pathname === "/wishlist" ? "active" : ""
          }
        >
          Wishlist
          <span className="nav-heart"> ♡</span>

          {location.pathname === "/wishlist" && (
            <span className="nav-dot"></span>
          )}
        </Link>

        {/* Cart */}
        <Link
          to={isLoggedIn ? "/cart" : "/login"}
          className={
            location.pathname === "/cart"
              ? "active cart-link"
              : "cart-link"
          }
        >
          Cart
          <span className="cart-symbol"> 🛒</span>

          <span className="cart-count">
            {isLoggedIn ? cartCount : 0}
          </span>

          {location.pathname === "/cart" && (
            <span className="nav-dot"></span>
          )}
        </Link>

        {/* Profile dropdown */}
        {isLoggedIn && (
          <div className="profile-dropdown">
            <button
              type="button"
              className={
                location.pathname === "/profile"
                  ? "profile-link active"
                  : "profile-link"
              }
              onClick={() => setProfileOpen(!profileOpen)}
            >
              ♡ <span>Profile</span>
            </button>

            {profileOpen && (
              <div className="profile-menu">
                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                >
                  My Profile
                </Link>

                <Link
                  to="/orders"
                  onClick={() => setProfileOpen(false)}
                >
                  <span>📦</span> My Orders
                </Link>

                <div className="profile-menu-line"></div>

                <button
                  type="button"
                  onClick={handleLogout}
                >
                  <span>↪</span> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
