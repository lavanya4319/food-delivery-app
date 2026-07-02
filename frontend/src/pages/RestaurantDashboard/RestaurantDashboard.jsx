import { useEffect, useState } from "react";
import {
  getMyRestaurants,
  getRestaurantOrders,
  updateOrderStatus,
} from "../../api/restaurantDashboardApi";

import "./RestaurantDashboard.css";

const RestaurantDashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);

    const restaurantResponse = await getMyRestaurants();

    if (
      restaurantResponse.success &&
      restaurantResponse.restaurants.length > 0
    ) {
      const myRestaurant = restaurantResponse.restaurants[0];

      setRestaurant(myRestaurant);

      const orderResponse = await getRestaurantOrders(
        myRestaurant._id
      );

      if (orderResponse.success) {
        setOrders(orderResponse.orders);
      }
    }

    setLoading(false);
  };

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    const response = await updateOrderStatus(
      orderId,
      newStatus
    );

    if (response.success) {
      loadDashboard();
    } else {
      alert(response.message);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="restaurant-dashboard">
      <h1>🍽 Restaurant Dashboard</h1>

      {restaurant && (
        <div className="restaurant-info-card">
          <img
            src={restaurant.image}
            alt={restaurant.restaurantName}
          />

          <div>
            <h2>{restaurant.restaurantName}</h2>

            <p>{restaurant.description}</p>

            <p>
              ⭐ Rating : {restaurant.rating || 4.5}
            </p>

            <p>
              🚚 Delivery Time :{" "}
              {restaurant.deliveryTime}
            </p>

            <p>
              {restaurant.isOpen
                ? "🟢 Restaurant Open"
                : "🔴 Restaurant Closed"}
            </p>
          </div>
        </div>
      )}

      <h2 className="orders-title">
        Customer Orders
      </h2>

      {orders.length === 0 ? (
        <div className="no-orders">
          No Orders Yet
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div
              key={order._id}
              className="dashboard-order-card"
            >
              <h3>
                Customer : {order.user?.name}
              </h3>

              <p>📧 {order.user?.email}</p>

              <p>📱 {order.phone}</p>

              <p>
                📍 {order.deliveryAddress}
              </p>

              <hr />

              <h4>Ordered Items</h4>

              {order.items.map((item) => (
                <div
                  key={item.menuItem}
                  className="dashboard-item"
                >
                  <span>
                    {item.name}
                  </span>

                  <span>
                    x {item.quantity}
                  </span>
                </div>
              ))}

              <hr />

              <h3>
                Total : ₹ {order.totalAmount}
              </h3>

              <p>
                <strong>
                  Payment Method :
                </strong>{" "}
                {order.paymentMethod}
              </p>

              <p>
                <strong>
                  Payment Status :
                </strong>{" "}
                {order.paymentStatus}
              </p>

              <div className="status-box">
                <label>
                  Order Status
                </label>

                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(
                      order._id,
                      e.target.value
                    )
                  }
                >
                  <option>Pending</option>
                  <option>Confirmed</option>
                  <option>Preparing</option>
                  <option>
                    Out for Delivery
                  </option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard;