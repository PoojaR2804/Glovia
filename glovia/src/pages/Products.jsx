import { useState, useEffect } from "react";
import {
  Link,
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import AddToCartPopup from "../components/AddToCartPopup";
import { useCart } from "../context/CartContext";
import { fetchProducts } from "../api/productApi";

function Products() {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [addedProduct, setAddedProduct] = useState(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [wishlist, setWishlist] = useState([]);

  const [searchParams] = useSearchParams();
  const categoryFromHome = searchParams.get("category");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    categoryFromHome || "All"
  );

  const [categoryOpen, setCategoryOpen] = useState(false);

  const API_URL = "http://127.0.0.1:8000/api";

  const getToken = () => {
    return localStorage.getItem("gloviaToken");
  };

  // ---------------- CATEGORY ----------------

  useEffect(() => {
    setCategory(categoryFromHome || "All");
  }, [categoryFromHome]);

  // ---------------- PRODUCTS ----------------

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error(
          "Error fetching products:",
          err
        );

        setError(
          "Unable to load products. Please try again."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ---------------- LOAD WISHLIST ----------------

  useEffect(() => {
    const loadWishlist = async () => {
      const token = getToken();

      if (!token) {
        setWishlist([]);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/wishlist/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load wishlist"
          );
        }

        const data = await response.json();

        setWishlist(data.items);

      } catch (error) {
        console.error(
          "Wishlist loading error:",
          error
        );
      }
    };

    loadWishlist();
  }, []);

  const categories = [
    "All",
    "Face Care",
    "Hair Care",
    "Body Care",
    "Sun Care",
    "Lip Care",
    "Grooming",
  ];

  // ---------------- TOGGLE WISHLIST ----------------

  const toggleWishlist = async (product) => {
    const isLoggedIn =
      localStorage.getItem("gloviaLoggedIn") === "true";

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const token = getToken();

    const existingItem = wishlist.find(
      (item) => item.product.id === product.id
    );

    try {

      // REMOVE
      if (existingItem) {

        const response = await fetch(
          `${API_URL}/wishlist/items/${existingItem.id}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to remove wishlist item"
          );
        }

        const data = await response.json();

        setWishlist(data.items);

        return;
      }

      // ADD
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
          "Failed to add wishlist item"
        );
      }

      const data = await response.json();

      setWishlist(data.items);

    } catch (error) {
      console.error(
        "Wishlist error:",
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

  // ---------------- FILTER ----------------

  const filteredProducts = products.filter(
    (product) => {

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );

  return (
    <>
      <Navbar />

      <AddToCartPopup
        productName={addedProduct}
        onClose={() => setAddedProduct(null)}
      />

      <div className="products-page">

        <section className="products-header">

          <p>GLOVIA COLLECTION</p>

          <h1>Discover Your Glow</h1>

          <span>
            Explore our carefully selected skincare and personal
            care essentials.
          </span>

        </section>

        <section className="products-controls">

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <div className="category-dropdown">

            <button
              type="button"
              className={`category-selected ${
                categoryOpen
                  ? "category-selected-open"
                  : ""
              }`}
              onClick={() =>
                setCategoryOpen(!categoryOpen)
              }
            >

              <span>{category}</span>

              <span
                className={`category-arrow ${
                  categoryOpen
                    ? "category-arrow-up"
                    : ""
                }`}
              >
                ▾
              </span>

            </button>

            {categoryOpen && (

              <div className="category-options">

                {categories.map((item) => (

                  <button
                    type="button"
                    key={item}
                    className={`category-option ${
                      category === item
                        ? "category-option-active"
                        : ""
                    }`}
                    onClick={() => {
                      setCategory(item);
                      setCategoryOpen(false);
                    }}
                  >
                    {item}
                  </button>

                ))}

              </div>

            )}

          </div>

        </section>

        <section className="products-grid">

          {loading ? (

            <div className="no-products">
              <h3>Loading products...</h3>
            </div>

          ) : error ? (

            <div className="no-products">
              <h3>{error}</h3>
            </div>

          ) : filteredProducts.length > 0 ? (

            filteredProducts.map((product) => {

              const isWishlisted =
                wishlist.some(
                  (item) =>
                    item.product.id === product.id
                );

              return (

                <div
                  className="product-card"
                  key={product.id}
                >

                  <div className="product-card-image">

                    <Link
                      to={`/product/${product.id}`}
                      className="product-image-link"
                    >
                      <img
                        src={
                          product.image ||
                          product.Image
                        }
                        alt={product.name}
                      />
                    </Link>

                    <button
                      className={`product-wishlist ${
                        isWishlisted
                          ? "wishlist-active"
                          : ""
                      }`}
                      type="button"
                      onClick={() =>
                        toggleWishlist(product)
                      }
                      aria-label={
                        isWishlisted
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >
                      {isWishlisted
                        ? "♥"
                        : "♡"}
                    </button>

                  </div>

                  <div className="product-card-info">

                    <p>{product.category}</p>

                    <h3>{product.name}</h3>

                    <div className="product-rating">
                      ★ {product.rating}
                    </div>

                    <div className="product-price">
                      ₹{product.price}
                    </div>

                    <div className="product-buttons">

                      <Link
                        to={`/product/${product.id}`}
                        className="product-view-button"
                      >
                        View Product
                      </Link>

                      <button
                        type="button"
                        className="product-add-cart-button"
                        onClick={() =>
                          handleAddToCart(product)
                        }
                      >
                        🛒 Add to Cart
                      </button>

                    </div>

                  </div>

                </div>

              );
            })

          ) : (

            <div className="no-products">

              <h3>No products found</h3>

              <p>
                Try another search or category.
              </p>

            </div>

          )}

        </section>

      </div>

      <Footer />
    </>
  );
}

export default Products;