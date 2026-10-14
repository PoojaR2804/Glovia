import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AddToCartPopup from "../components/AddToCartPopup";
import { useCart } from "../context/CartContext";
import { fetchProducts } from "../api/productApi";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [addedProduct, setAddedProduct] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const [wishlist, setWishlist] = useState([]);
  const [wishlistItemId, setWishlistItemId] = useState(null);

  const API_URL = "http://127.0.0.1:8000/api";

  const getToken = () => {
    return localStorage.getItem("gloviaToken");
  };

  const isLoggedIn =
    localStorage.getItem("gloviaLoggedIn") === "true";

  // ---------------- FETCH PRODUCT ----------------

  useEffect(() => {
    setLoading(true);

    fetchProducts()
      .then((data) => {
        const foundProduct = data.find(
          (item) => item.id === Number(id)
        );

        setProduct(foundProduct || null);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setProduct(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // ---------------- LOAD WISHLIST ----------------

  useEffect(() => {
    const loadWishlist = async () => {
      const token = getToken();

      if (!token) {
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
          throw new Error("Failed to load wishlist");
        }

        const data = await response.json();

        setWishlist(data.items);

        const currentItem = data.items.find(
          (item) => item.product.id === Number(id)
        );

        setWishlistItemId(
          currentItem ? currentItem.id : null
        );
      } catch (error) {
        console.error(
          "Wishlist loading error:",
          error
        );
      }
    };

    loadWishlist();
  }, [id]);

  // ---------------- LOADING ----------------

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="product-not-found">
          <h1>Loading product...</h1>
        </div>

        <Footer />
      </>
    );
  }

  // ---------------- PRODUCT NOT FOUND ----------------

  if (!product) {
    return (
      <>
        <Navbar />

        <div className="product-not-found">
          <h1>Product Not Found</h1>

          <p>
            Sorry, we couldn't find the product you're looking for.
          </p>

          <Link to="/products">
            ← Back to Shop
          </Link>
        </div>

        <Footer />
      </>
    );
  }

  const isWishlisted = wishlist.some(
    (item) => item.product.id === product.id
  );

  // ---------------- ADD TO CART ----------------

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    setAddedProduct(product.name);
  };

  // ---------------- BUY NOW ----------------

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const buyNowProduct = {
      ...product,
      quantity: quantity,
    };

    localStorage.setItem(
      "gloviaBuyNow",
      JSON.stringify(buyNowProduct)
    );

    navigate("/checkout?mode=buyNow");
  };

  // ---------------- WISHLIST ----------------

  const handleWishlist = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const token = getToken();

    try {
      // REMOVE FROM WISHLIST
      if (isWishlisted && wishlistItemId) {
        const response = await fetch(
          `${API_URL}/wishlist/items/${wishlistItemId}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to remove from wishlist"
          );
        }

        const data = await response.json();

        setWishlist(data.items);
        setWishlistItemId(null);

        return;
      }

      // ADD TO WISHLIST
      const response = await fetch(
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

      if (!response.ok) {
        throw new Error(
          "Failed to add to wishlist"
        );
      }

      const data = await response.json();

      setWishlist(data.items);

      const addedItem = data.items.find(
        (item) => item.product.id === product.id
      );

      setWishlistItemId(
        addedItem ? addedItem.id : null
      );
    } catch (error) {
      console.error(
        "Wishlist error:",
        error
      );
    }
  };

  // ---------------- QUANTITY ----------------

  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((current) =>
      current > 1 ? current - 1 : 1
    );
  };

  return (
    <>
      <Navbar />

      <AddToCartPopup
        productName={addedProduct}
        onClose={() => setAddedProduct(null)}
      />

      <main className="product-details-page">

        <div className="product-breadcrumb">
          <span>{product.name}</span>
        </div>

        <section className="product-details-container">

          <div className="product-details-image">

            <img
              src={product.image || product.Image}
              alt={product.name}
            />

            <button
              type="button"
              className={`product-details-wishlist ${
                isWishlisted
                  ? "wishlist-active"
                  : ""
              }`}
              onClick={handleWishlist}
              aria-label={
                isWishlisted
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
            >
              {isWishlisted ? "♥" : "♡"}
            </button>

          </div>

          <div className="product-details-info">

            <p className="product-details-category">
              {product.category}
            </p>

            <h1>{product.name}</h1>

            <div className="product-details-rating">
              <span>★</span>

              <strong>{product.rating}</strong>

              <span>Customer Rating</span>
            </div>

            <div className="product-details-price">
              ₹{product.price}
            </div>

            <p className="product-details-description">
              A carefully selected GLOVIA beauty essential
              designed to complement your daily skincare
              and personal care routine.
            </p>

            <div className="product-benefits">

              <div>
                <span>✦</span>
                Quality Ingredients
              </div>

              <div>
                <span>♡</span>
                Gentle Care
              </div>

              <div>
                <span>✓</span>
                Everyday Essentials
              </div>

            </div>

            <div className="quantity-section">

              <span>Quantity</span>

              <div className="quantity-control">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                >
                  +
                </button>

              </div>

            </div>

            <div className="product-delivery-date">

              <span>🚚</span>

              <p>
                <strong>Expected Delivery:</strong>{" "}

                {(() => {
                  const deliveryDate = new Date();

                  deliveryDate.setDate(
                    deliveryDate.getDate() + 5
                  );

                  return deliveryDate.toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  );
                })()}
              </p>

            </div>

            <div className="product-details-actions">

              <button
                type="button"
                className="product-details-cart"
                onClick={handleAddToCart}
              >
                🛒 Add to Cart
              </button>

              <button
                type="button"
                className="product-details-wishlist-button"
                onClick={handleWishlist}
              >
                {isWishlisted
                  ? "♥ Wishlisted"
                  : "♡ Add to Wishlist"}
              </button>

              <button
                type="button"
                className="buy-now-btn"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>

            </div>

            <div className="product-details-extra">

              <div>
                <strong>Free Delivery</strong>
                <span>On orders above ₹999</span>
              </div>

              <div>
                <strong>Secure Shopping</strong>
                <span>Safe and simple checkout</span>
              </div>

              <div>
                <strong>GLOVIA Care</strong>
                <span>
                  Beauty essentials selected for you
                </span>
              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default ProductDetails;