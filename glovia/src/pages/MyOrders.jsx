import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./MyOrders.css";

const API_URL = "https://glovia-backend-8zxd.onrender.com/api/";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("gloviaToken");

      if (!token) {
        setError("Please log in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}orders/`, {
          headers: {
            Authorization: `Token ${token}`,
            Accept: "application/json",
          },
        });

        const contentType =
          response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          const responseText = await response.text();

          console.error(
            "Orders API returned non-JSON response:",
            responseText
          );

          throw new Error(
            `The server returned HTML instead of JSON (HTTP ${response.status}). Check your Django server and API URL.`
          );
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              data.detail ||
              "Unable to fetch your orders."
          );
        }

        if (!Array.isArray(data)) {
          throw new Error("Invalid orders response from server.");
        }

        const updatedOrders = data.map((order) => {
          const orderDate =
            order.created_at || new Date().toISOString();

          const deliveryDate = new Date(orderDate);
          deliveryDate.setDate(deliveryDate.getDate() + 5);

          const statusMap = {
            Placed: 0,
            Processing: 1,
            Shipped: 2,
            Delivered: 4,
            Cancelled: 0,
          };

          const items = (order.items || []).map((item) => {
            const productImage = item.product_image || "";

            return {
              ...item,
              name: item.product_name || "Product",
              price: Number(item.price || 0),
              quantity: Number(item.quantity || 1),
              image: productImage,
            };
          });

          return {
            ...order,
            orderId: order.id,
            orderDate,
            date: orderDate,
            total: Number(order.total_amount || 0),
            items,
            trackingStatus: statusMap[order.status] ?? 0,
            paymentMethod: order.payment_method || "N/A",
            deliveryDate: deliveryDate.toISOString(),
            backendStatus: order.status || "Placed",
          };
        });

        setOrders(updatedOrders);

        localStorage.setItem(
          "gloviaOrders",
          JSON.stringify(updatedOrders)
        );
      } catch (err) {
        console.error("Failed to load orders:", err);
        setError(
          err.message ||
            "Unable to load your orders. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleTrackOrder = (order) => {
    localStorage.setItem(
      "gloviaCurrentOrder",
      JSON.stringify(order)
    );

    navigate("/track-order");
  };

  return (
    <>
      <Navbar />

      <section className="cart-header">
        <p>GLOVIA COLLECTION</p>
        <h1>My Orders</h1>
        <p className="my-orders-subtitle">
          View your orders and track your deliveries.
        </p>
      </section>

      <div className="my-orders-page">
        <div className="my-orders-container">
          {loading ? (
            <div className="no-orders">
              <h2>Loading Orders...</h2>
              <p>Please wait while we fetch your orders.</p>
            </div>
          ) : error ? (
            <div className="no-orders">
              <h2>Unable to Load Orders</h2>
              <p>{error}</p>
              <button
                className="my-order-track-btn"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="no-orders">
              <h2>No Orders Yet</h2>
              <p>You haven't placed any orders yet.</p>

              <Link to="/products" className="shop-now-btn">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="my-orders-list">
              {orders.map((order) => {
                const isDelivered =
                  order.backendStatus === "Delivered";

                return (
                  <div
                    className="my-order-card"
                    key={order.orderId}
                  >
                    <div className="my-order-header">
                      <div>
                        <h3>Order ID</h3>
                        <p>#{order.orderId}</p>
                      </div>

                      <div>
                        <h3>Order Date</h3>
                        <p>
                          {new Date(
                            order.orderDate
                          ).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div className="my-order-products">
                      {order.items.map((item, itemIndex) => (
                        <div
                          className="my-order-product"
                          key={item.id || itemIndex}
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              onError={(event) => {
                                event.currentTarget.style.display =
                                  "none";
                                const placeholder =
                                  event.currentTarget.nextElementSibling;

                                if (placeholder) {
                                  placeholder.style.display = "flex";
                                }
                              }}
                            />
                          ) : null}

                          <div
                            className="my-order-product-placeholder"
                            style={{
                              display: item.image ? "none" : "flex",
                            }}
                          >
                            GLOVIA
                          </div>

                          <div className="my-order-product-info">
                            <h4>{item.name}</h4>

                            <p>
                              Quantity: {item.quantity}
                            </p>

                            <p>
                              ₹
                              {(
                                item.price * item.quantity
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="my-order-footer">
                      <div>
                        <h3>
                          Total: ₹
                          {order.total.toFixed(2)}
                        </h3>

                        <p>
                          Payment: {order.paymentMethod}
                        </p>

                        <p>
                          Status: {order.backendStatus}
                        </p>

                        <p>
                          <strong>
                            {isDelivered
                              ? "Delivery Date:"
                              : "Expected Delivery:"}
                          </strong>{" "}
                          {new Date(
                            order.deliveryDate
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      {!isDelivered &&
                        order.backendStatus !== "Cancelled" && (
                          <button
                            className="my-order-track-btn"
                            onClick={() =>
                              handleTrackOrder(order)
                            }
                          >
                            Track Order
                          </button>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />

      <style>{`
        .my-order-product-placeholder {
          width: 85px;
          height: 85px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          background: #fff3f3;
          color: #8b4149;
          font-size: 12px;
          letter-spacing: 1px;
        }

        .my-order-product img {
          width: 85px;
          height: 85px;
          object-fit: cover;
          flex-shrink: 0;
        }
      `}</style>
    </>
  );
}

export default MyOrders;
