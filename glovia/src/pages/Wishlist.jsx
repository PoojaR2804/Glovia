import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import AddToCartPopup from "../components/AddToCartPopup";
import { useCart } from "../context/CartContext";

function Wishlist() {
  const navigate = useNavigate();

  const [addedProduct, setAddedProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  const API_URL = "http://127.0.0.1:8000/api";

  const getToken = () => {
    return localStorage.getItem("gloviaToken");
  };

  // ---------------- LOAD WISHLIST ----------------

  useEffect(() => {
    const loadWishlist = async () => {
      const token = getToken();

      if (!token) {
        setWishlist([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/wishlist/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load wishlist");
        }

        const data = await response.json();

        const products = data.items.map((item) => ({
          ...item.product,
          Image: item.product.image,
          wishlistItemId: item.id,
          price: Number(item.product.price),
          rating: Number(item.product.rating),
        }));

        setWishlist(products);
      } catch (error) {
        console.error("Wishlist loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  // ---------------- REMOVE FROM WISHLIST ----------------

  const removeFromWishlist = async (id) => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    const item = wishlist.find(
      (item) => item.id === id
    );

    if (!item) return;

    try {
      const response = await fetch(
        `${API_URL}/wishlist/items/${item.wishlistItemId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove from wishlist");
      }

      const data = await response.json();

      const products = data.items.map((item) => ({
        ...item.product,
        Image: item.product.image,
        wishlistItemId: item.id,
        price: Number(item.product.price),
        rating: Number(item.product.rating),
      }));

      setWishlist(products);
    } catch (error) {
      console.error(
        "Remove wishlist error:",
        error
      );
    }
  };

  // ---------------- ADD TO CART ----------------

  const handleAddToCart = (product) => {
    const isLoggedIn =
      localStorage.getItem("gloviaLoggedIn") === "true";

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    addToCart(product);
    setAddedProduct(product.name);
  };

  return (
    <>
      <Navbar />

      <AddToCartPopup
        productName={addedProduct}
        onClose={() => setAddedProduct(null)}
      />

      <div className="wishlist-page">

        <section className="wishlist-header">
          <p>GLOVIA COLLECTION</p>

          <h1>My Wishlist</h1>

          <span>
            Save your favorite beauty essentials for later.
          </span>
        </section>

        {loading ? (
          <section className="empty-wishlist">
            <h2>Loading Wishlist...</h2>
          </section>
        ) : wishlist.length > 0 ? (

          <section className="wishlist-grid">

            {wishlist.map((product) => (

              <div
                className="wishlist-card"
                key={product.id}
              >

                <div className="wishlist-image">

                  <Link
                    to={`/product/${product.id}`}
                    className="wishlist-image-link"
                  >
                    <img
                      src={product.image || product.Image}
                      alt={product.name}
                    />
                  </Link>

                  <button
                    type="button"
                    className="wishlist-remove-heart"
                    onClick={() =>
                      removeFromWishlist(product.id)
                    }
                    aria-label="Remove from wishlist"
                  >
                    ♥
                  </button>

                </div>

                <div className="wishlist-info">

                  <p>{product.category}</p>

                  <h3>{product.name}</h3>

                  <div className="wishlist-rating">
                    ★ {product.rating}
                  </div>

                  <div className="wishlist-price">
                    ₹{product.price}
                  </div>

                  <button
                    type="button"
                    className="wishlist-cart-button"
                    onClick={() =>
                      handleAddToCart(product)
                    }
                  >
                    <span>🛒</span>
                    Add to Cart
                  </button>

                </div>

              </div>

            ))}

          </section>

        ) : (

          <section className="empty-wishlist">

            <div className="empty-wishlist-icon">
              ♡
            </div>

            <h2>Your Wishlist is Empty</h2>

            <p>
              Save products you love and find them here later.
            </p>

            <Link
              to="/products"
              className="shop-now-button"
            >
              Explore Products →
            </Link>

          </section>

        )}

      </div>

      <Footer />
    </>
  );
}

export default Wishlist;