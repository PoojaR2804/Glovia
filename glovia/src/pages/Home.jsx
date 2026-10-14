import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import AddToCartPopup from "../components/AddToCartPopup";
import { fetchProducts } from "../api/productApi";

function Home() {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const isLoggedIn =
    localStorage.getItem("gloviaLoggedIn") === "true";

  const [addedProduct, setAddedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const API_URL = "http://127.0.0.1:8000/api";
  const getToken = () => localStorage.getItem("gloviaToken");

  // Load products from Django
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error("Product loading error:", err);
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Load wishlist from Django
  useEffect(() => {
    const loadWishlist = async () => {
      const token = getToken();

      if (
        !token ||
        localStorage.getItem("gloviaLoggedIn") !== "true"
      ) {
        setWishlist([]);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/wishlist/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Unable to load wishlist");
        }

        const data = await response.json();

        setWishlist(
          Array.isArray(data.items) ? data.items : []
        );
      } catch (err) {
        console.error("Wishlist loading error:", err);
      }
    };

    loadWishlist();
  }, []);

  const categories = [
    { icon: "🧴", name: "Face Care", text: "Glow & nourish" },
    { icon: "💇", name: "Hair Care", text: "Healthy & beautiful" },
    { icon: "🧼", name: "Body Care", text: "Soft & refreshed" },
    { icon: "☀️", name: "Sun Care", text: "Protect your skin" },
    { icon: "💋", name: "Lip Care", text: "Soft & hydrated" },
    { icon: "🪒", name: "Grooming", text: "Everyday essentials" },
  ];

  // Add or remove a product from the backend wishlist
  const toggleWishlist = async (product) => {
    const token = getToken();

    if (
      !isLoggedIn ||
      !token
    ) {
      navigate("/login");
      return;
    }

    if (wishlistLoading) return;

    setWishlistLoading(true);

    try {
      const existingItem = wishlist.find(
        (item) => item.product?.id === product.id
      );

      let response;

      if (existingItem) {
        // Remove product from wishlist
        response = await fetch(
          `${API_URL}/wishlist/items/${existingItem.id}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
      } else {
        // Add product to wishlist
        response = await fetch(
          `${API_URL}/wishlist/items/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
              product_id: product.id,
            }),
          }
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to update wishlist."
        );
      }

      // Update the heart status using the backend response
      setWishlist(
        Array.isArray(data.items) ? data.items : []
      );
    } catch (err) {
      console.error("Wishlist update error:", err);
      window.alert(
        err.message || "Unable to update wishlist. Please try again."
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  // Check whether a product is in the wishlist
  const isWishlisted = (productId) =>
    wishlist.some(
      (item) => item.product?.id === productId
    );

  const handleShopNow = () => {
    navigate(isLoggedIn ? "/products" : "/login");
  };

  // Add product to cart
  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      price: Number(product.price),
      Image: product.image || product.Image,
    });

    setAddedProduct(product.name);
  };

  // Display the first four products from Django
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="glovia-home">
      <Navbar />

      <AddToCartPopup
        productName={addedProduct}
        onClose={() => setAddedProduct(null)}
      />

      {/* Hero Section */}
      <section className="glovia-hero">
        <div className="hero-left">
          <p className="hero-overline">
            BEAUTY • CARE • GLOW
          </p>

          <h1>
            Your Skin.
            <br />
            Your <em>Glow.</em>
          </h1>

          <p className="hero-text">
            Discover skincare and personal care products specially
            selected to make your everyday beauty routine better.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={handleShopNow}
          >
            Shop Now <span>→</span>
          </button>
        </div>

        <div className="hero-right">
          <div className="hero-photo">
            <img
              src="https://i.pinimg.com/736x/74/9c/77/749c778d65c4662cf82607059fd4de41.jpg"
              alt="GLOVIA skincare collection"
            />
          </div>

          <span className="floating-petal petal-one">✿</span>
          <span className="floating-petal petal-two">❀</span>
          <span className="floating-petal petal-three">✿</span>
        </div>
      </section>

      {/* Categories Section */}
      <section className="category-section" id="categories">
        <div className="decorative-heading">
          <p>SHOP BY CATEGORY</p>

          <div className="heading-decoration">
            <span></span>
            <b>♡</b>
            <span></span>
          </div>
        </div>

        <div className="category-container">
          {categories.map((category, index) => (
            <Link
              to={`/products?category=${encodeURIComponent(
                category.name
              )}`}
              className="category-box"
              key={index}
            >
              <div className="category-icon">
                {category.icon}
              </div>

              <h3>{category.name}</h3>
              <p>{category.text}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="featured-heading">
          <p>OUR PICKS</p>

          <div className="featured-title-row">
            <span></span>
            <h2>Featured Products</h2>
            <span></span>
          </div>

          <div className="small-heart">♡</div>
        </div>

        <div className="products-container">
          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p>{error}</p>
          ) : featuredProducts.length === 0 ? (
            <p>No featured products available.</p>
          ) : (
            featuredProducts.map((product) => (
              <div
                className="featured-product"
                key={product.id}
              >
                <div className="product-image-box">
                  <Link
                    to={`/product/${product.id}`}
                    className="product-image-link"
                  >
                    <img
                      src={product.image || product.Image}
                      alt={product.name}
                    />
                  </Link>

                  <button
                    className={`wishlist-button ${
                      isWishlisted(product.id)
                        ? "wishlist-button-active"
                        : ""
                    }`}
                    type="button"
                    disabled={wishlistLoading}
                    onClick={() => toggleWishlist(product)}
                    aria-label={
                      isWishlisted(product.id)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                    aria-pressed={isWishlisted(product.id)}
                  >
                    {isWishlisted(product.id) ? "♥" : "♡"}
                  </button>
                </div>

                <div className="product-information">
                  <p className="product-category">
                    {product.category?.toUpperCase()}
                  </p>

                  <h3>{product.name}</h3>

                  <div className="rating">
                    <span>
                      {"★".repeat(
                        Math.min(
                          5,
                          Math.max(
                            0,
                            Math.round(Number(product.rating) || 0)
                          )
                        )
                      )}
                      {"☆".repeat(
                        5 -
                          Math.min(
                            5,
                            Math.max(
                              0,
                              Math.round(Number(product.rating) || 0)
                            )
                          )
                      )}
                    </span>
                  </div>

                  <div className="product-bottom">
                    <strong>₹{product.price}</strong>

                    <button
                      className="add-cart-button"
                      type="button"
                      onClick={() => handleAddToCart(product)}
                    >
                      <span className="cart-button-icon">
                        🛒
                      </span>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="view-all-container">
          <Link
            to="/products"
            className="view-all-button"
          >
            View All Products →
          </Link>
        </div>
      </section>

      {/* Offers and Why GLOVIA Section */}
      <section className="lower-section">
        <div className="offer-card">
          <div className="offer-details">
            <p>GLOVIA SPECIAL</p>

            <h2>
              Glow More,
              <br />
              Spend Less <span>✦</span>
            </h2>

            <p className="offer-description">
              Get up to <strong>30% OFF</strong> on selected
              skincare essentials.
            </p>

            <Link
              to="/products"
              className="offer-button"
            >
              Explore Offers →
            </Link>
          </div>

          <div className="gift-box">
            <div className="gift-ribbon"></div>
            <div className="gift-lid"></div>
            <div className="gift-body"></div>
          </div>

          <div className="discount-circle">
            <span>UP TO</span>
            <strong>30%</strong>
            <span>OFF</span>
          </div>
        </div>

        <div className="why-glovia">
          <div className="why-heading">
            <p>WHY GLOVIA?</p>
            <h2>Beauty Made Simple</h2>

            <div className="why-line">
              <span></span>
              <b>♡</b>
              <span></span>
            </div>
          </div>

          <div className="why-items">
            <div className="why-item">
              <div className="why-icon">♧</div>
              <h3>Carefully Selected</h3>
              <p>
                Products chosen with your everyday beauty needs
                in mind.
              </p>
            </div>

            <div className="why-item">
              <div className="why-icon">♥</div>
              <h3>Made For You</h3>
              <p>
                Simple beauty essentials for every skincare routine.
              </p>
            </div>

            <div className="why-item">
              <div className="why-icon">🚚</div>
              <h3>Easy Shopping</h3>
              <p>
                Smooth, secure and fast delivery to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glovia-footer">
        <div className="footer-logo">
          <div className="footer-brand">GLOVIA</div>

          <div className="footer-decoration">
            <span></span>
            <b>♡</b>
            <span></span>
          </div>

          <p>Glow Begins With You ✨</p>
        </div>

        <div className="footer-menu">
          <Link to="/home">Home</Link>
          <Link to="/products">Shop</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">Cart</Link>
        </div>

        <p className="copyright">
          © 2026 GLOVIA. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;