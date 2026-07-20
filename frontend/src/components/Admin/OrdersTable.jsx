import { Fragment, useState } from "react";
import { toast } from "react-toastify";

import {
  updateOrderStatus,
} from "../../api/adminApi";

import "./OrdersTable.css";

const OrdersTable = ({
  orders,
  refreshOrders,
}) => {
  const [loadingId, setLoadingId] =
    useState(null);
  const [expandedOrderId, setExpandedOrderId] =
    useState(null);

  const handleStatusChange = async (
    orderId,
    status
  ) => {
    setLoadingId(orderId);

    const response =
      await updateOrderStatus(
        orderId,
        status
      );

    if (response.success) {
      toast.success(response.message);
      refreshOrders();
    } else {
      toast.error(response.message);
    }

    setLoadingId(null);
  };

  return (
    <div className="orders-table-card">

      <div className="table-header">
        <h2>📦 Orders Management</h2>

        <span>{orders.length} Orders</span>
      </div>

      <div className="table-responsive">

        <table className="orders-table">

          <thead>
            <tr>
              <th>Customer</th>
              <th>Restaurant</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Update Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="no-data"
                >
                  No Orders Found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <Fragment key={order._id}>
                  <tr>

                    <td>
                      <strong>
                        {order.user?.name}
                      </strong>

                      <p className="small-text">
                        {order.user?.email}
                      </p>
                    </td>

                    <td>
                      {
                        order.restaurant
                          ?.restaurantName
                      }
                    </td>

                    <td>
                      <strong>
                        ₹ {order.totalAmount}
                      </strong>
                    </td>

                    <td>

                      <span className="payment-mode">
                        {order.paymentMethod}
                      </span>

                    </td>

                    <td>

                      <span
                        className={`order-status ${order.status
                          .replace(/\s/g, "")
                          .toLowerCase()}`}
                      >
                        {order.status}
                      </span>

                    </td>

                    <td>

                      <select
                        className="status-select"
                        value={order.status}
                        disabled={
                          loadingId ===
                          order._id
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            order._id,
                            e.target.value
                          )
                        }
                      >
                        <option>
                          Pending
                        </option>

                        <option>
                          Confirmed
                        </option>

                        <option>
                          Preparing
                        </option>

                        <option>
                          Out for Delivery
                        </option>

                        <option>
                          Delivered
                        </option>

                        <option>
                          Cancelled
                        </option>

                      </select>

                      {loadingId ===
                        order._id && (
                        <p
                          style={{
                            color:
                              "#ff5a1f",
                            fontSize:
                              "12px",
                            marginTop:
                              "6px",
                          }}
                        >
                          Updating...
                        </p>
                      )}

                    </td>

                    <td>
                      <div className="date-actions">
                        <span>
                          {new Date(
                            order.createdAt
                          ).toLocaleDateString()}
                        </span>
                        <button
                          type="button"
                          className="details-btn"
                          onClick={() =>
                            setExpandedOrderId(
                              expandedOrderId === order._id
                                ? null
                                : order._id
                            )
                          }
                        >
                          {expandedOrderId === order._id
                            ? "Hide Details"
                            : "View Details"}
                        </button>
                      </div>
                    </td>

                  </tr>

                  {expandedOrderId === order._id && (
                    <tr>
                      <td colSpan="7">
                        <div className="order-detail-card">
                          <div className="detail-grid">
                            <div>
                              <strong>Customer Name</strong>
                              <p>{order.user?.name || "Unknown Customer"}</p>
                            </div>

                            <div>
                              <strong>Customer Email</strong>
                              <p>{order.user?.email || "N/A"}</p>
                            </div>

                            <div>
                              <strong>Delivery Address</strong>
                              <p>{order.deliveryAddress}</p>
                            </div>

                            <div>
                              <strong>Phone</strong>
                              <p>{order.phone}</p>
                            </div>

                            <div>
                              <strong>Payment Method</strong>
                              <p>{order.paymentMethod}</p>
                            </div>

                            <div>
                              <strong>Payment Status</strong>
                              <p>{order.paymentStatus}</p>
                            </div>

                            <div>
                              <strong>Order ID</strong>
                              <p>{order._id}</p>
                            </div>

                            <div>
                              <strong>Order Date</strong>
                              <p>
                                {new Date(
                                  order.createdAt
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="detail-items">
                            <strong>Order Items</strong>

                            {order.items.map((item) => (
                              <div
                                key={`${order._id}-${item.menuItem}-${item.name}`}
                                className="detail-item"
                              >
                                <span>{item.name}</span>
                                <span>
                                  Qty {item.quantity} × ₹{item.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default OrdersTable;