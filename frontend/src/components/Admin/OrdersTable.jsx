import "./OrdersTable.css";

const OrdersTable = ({ orders }) => {
  return (
    <div className="orders-table-container">
      <h2>📦 All Orders</h2>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Restaurant</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Payment Status</th>
            <th>Order Status</th>
            <th>Ordered On</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-data">
                No Orders Found
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order.user?.name}</td>

                <td>
                  {order.restaurant?.restaurantName}
                </td>

                <td>₹ {order.totalAmount}</td>

                <td>{order.paymentMethod}</td>

                <td>
                  <span
                    className={`payment-status ${
                      order.paymentStatus === "Paid"
                        ? "paid"
                        : order.paymentStatus ===
                          "Pending"
                        ? "pending"
                        : "failed"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>

                <td>
                  <span
                    className={`order-status ${order.status
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td>
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;