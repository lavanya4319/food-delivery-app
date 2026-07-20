import { useEffect, useState } from "react";
import { FaCheckCircle, FaMotorcycle, FaUtensils, FaClock } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getUserOrders } from "../../api/orderApi";

import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);

    const response = await getUserOrders();

    if (response.success) {
      setOrders(response.orders);
    } else {
      toast.error(response.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="status pending">🟡 Pending</span>;

      case "Preparing":
        return <span className="status preparing">👨‍🍳 Preparing</span>;

      case "Out for Delivery":
        return (
          <span className="status delivery">
            🛵 Out For Delivery
          </span>
        );

      case "Delivered":
        return (
          <span className="status delivered">
            ✅ Delivered
          </span>
        );

      case "Cancelled":
        return (
          <span className="status cancelled">
            ❌ Cancelled
          </span>
        );

      default:
        return (
          <span className="status pending">
            🟡 Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="orders-loading">
        Loading Orders...
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="orders-page">

        <h1>📦 My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-orders">

            <h2>No Orders Yet</h2>

            <p>Place your first delicious order.</p>

          </div>
        ) : (
          <div className="orders-container">

            {orders.map((order) => (
              <div
                className="order-card"
                key={order._id}
              >
                <div className="order-header">

                  <h2>
                    {order.restaurant?.restaurantName ||
                      "Restaurant"}
                  </h2>

                  {getStatusBadge(order.status)}

                </div>

                <div className="tracking-box">

                  <div className="tracking-step active">
                    <FaClock />
                    <span>Pending</span>
                  </div>

                  <div className="tracking-line"></div>

                  <div
                    className={`tracking-step ${
                      order.status !== "Pending"
                        ? "active"
                        : ""
                    }`}
                  >
                    <FaUtensils />
                    <span>Preparing</span>
                  </div>

                  <div className="tracking-line"></div>

                  <div
                    className={`tracking-step ${
                      order.status ===
                        "Out for Delivery" ||
                      order.status === "Delivered"
                        ? "active"
                        : ""
                    }`}
                  >
                    <FaMotorcycle />
                    <span>Delivery</span>
                  </div>

                  <div className="tracking-line"></div>

                  <div
                    className={`tracking-step ${
                      order.status === "Delivered"
                        ? "active"
                        : ""
                    }`}
                  >
                    <FaCheckCircle />
                    <span>Delivered</span>
                  </div>

                </div>

                <div className="order-items">

                  {order.items.map((item) => (
                    <div
                      key={item.menuItem}
                      className="order-item"
                    >
                      <div>
                        <h3>{item.name}</h3>

                        <p>
                          Qty : {item.quantity}
                        </p>
                      </div>

                      <h3>
                        ₹ {item.price * item.quantity}
                      </h3>

                    </div>
                  ))}

                </div>

                <div className="order-footer">

                  <p>
                    <strong>Total :</strong> ₹{" "}
                    {order.totalAmount}
                  </p>

                  <p>
                    <strong>Payment :</strong>{" "}
                    {order.paymentStatus}
                  </p>

                  <p>
                    <strong>Method :</strong>{" "}
                    <span className="payment-mode">{order.paymentMethod}</span>
                  </p>

                  <p>
                    <strong>Date :</strong>{" "}
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </p>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </>
  );
};

export default Orders;