import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext(null);
const API_URL = "https://glovia-backend-8zxd.onrender.com/api";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartUser, setCartUser] = useState(
    localStorage.getItem("gloviaToken")
  );

  const getToken = () => localStorage.getItem("gloviaToken");

  const formatCart = (items = []) =>
    items.map((item) => ({
      ...item.product,
      Image: item.product.image,
      price: Number(item.product.price),
      rating: Number(item.product.rating || 0),
      quantity: item.quantity,
      cartItemId: item.id,
    }));

  // Reload cart whenever the logged-in user changes.
  useEffect(() => {
    let cancelled = false;

    const loadCart = async () => {
      const token = getToken();

      setCartUser(token);

      if (!token) {
        setCart([]);
        return;
      }

      setCart([]);

      try {
        const response = await fetch(`${API_URL}/cart/`, {
          headers: {
            Authorization: `Token ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load cart");
        }

        const data = await response.json();

        if (!cancelled && getToken() === token) {
          setCart(formatCart(data.items));
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Cart loading error:", error);
          setCart([]);
        }
      }
    };

    loadCart();

    // Also detect login/logout changes in other browser tabs.
    const handleStorage = (event) => {
      if (
        event.key === "gloviaToken" ||
        event.key === "gloviaLoggedIn"
      ) {
        setCartUser(getToken());
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      cancelled = true;
      window.removeEventListener("storage", handleStorage);
    };
  }, [cartUser]);

  const addToCart = async (product) => {
    const token = getToken();

    if (!token) {
      setCart([]);
      alert("Please login first.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cart/items/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const data = await response.json();

      if (getToken() === token) {
        setCart(formatCart(data.items));
      }
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const token = getToken();

    if (!token) {
      setCart([]);
      alert("Please login first.");
      return;
    }

    const item = cart.find((product) => product.id === productId);

    if (!item) return;

    if (quantity < 1) {
      await removeFromCart(productId);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/cart/items/${item.cartItemId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ quantity }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      const data = await response.json();

      if (getToken() === token) {
        setCart(formatCart(data.items));
      }
    } catch (error) {
      console.error("Update quantity error:", error);
    }
  };

  const increaseQuantity = (productId) => {
    const item = cart.find((product) => product.id === productId);
    if (item) updateQuantity(productId, item.quantity + 1);
  };

  const decreaseQuantity = (productId) => {
    const item = cart.find((product) => product.id === productId);
    if (item) updateQuantity(productId, item.quantity - 1);
  };

  const removeFromCart = async (productId) => {
    const token = getToken();

    if (!token) {
      setCart([]);
      return;
    }

    const item = cart.find((product) => product.id === productId);
    if (!item) return;

    try {
      const response = await fetch(
        `${API_URL}/cart/items/${item.cartItemId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove product");
      }

      const data = await response.json();

      if (getToken() === token) {
        setCart(formatCart(data.items));
      }
    } catch (error) {
      console.error("Remove from cart error:", error);
    }
  };

  const cartCount = cart.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        cartCount,
        cartTotal,
        refreshCart: () => setCartUser(getToken()),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
