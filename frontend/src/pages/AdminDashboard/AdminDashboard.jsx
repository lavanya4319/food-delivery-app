import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
  getDashboardStats,
  getAllUsers,
  getAllRestaurants,
  getAllOrders,
  assignRestaurantToManager,
} from "../../api/adminApi";

import Sidebar from "../../components/Admin/Sidebar";
import DashboardCards from "../../components/Admin/DashboardCards";
import UsersTable from "../../components/Admin/UsersTable";
import RestaurantsTable from "../../components/Admin/RestaurantsTable";
import OrdersTable from "../../components/Admin/OrdersTable";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activityPage, setActivityPage] = useState(1);
  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
  });

  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignmentForm, setAssignmentForm] = useState({
    managerId: "",
    restaurantId: "",
  });
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);

    const [dashboardResponse, usersResponse, restaurantsResponse, ordersResponse] = await Promise.all([
      getDashboardStats(),
      getAllUsers(),
      getAllRestaurants(),
      getAllOrders(),
    ]);

    if (dashboardResponse.success) {
      setDashboard(dashboardResponse.dashboard);
    }

    if (usersResponse.success) {
      setUsers(usersResponse.users);
    }

    if (restaurantsResponse.success) {
      setRestaurants(restaurantsResponse.restaurants);
    }

    if (ordersResponse.success) {
      setOrders(ordersResponse.orders);
    }

    setLoading(false);
  };

  const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

  const handleAssignmentChange = (e) => {
    const { name, value } = e.target;

    setAssignmentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAssignRestaurant = async (e) => {
    e.preventDefault();

    if (!assignmentForm.managerId || !assignmentForm.restaurantId) {
      toast.error("Please select both a manager and a restaurant.");
      return;
    }

    setAssigning(true);

    const response = await assignRestaurantToManager(
      assignmentForm.managerId,
      assignmentForm.restaurantId
    );

    if (response.success) {
      toast.success(response.message);
      setAssignmentForm({ managerId: "", restaurantId: "" });
      await loadAdminData();
    } else {
      toast.error(response.message);
    }

    setAssigning(false);
  };

  const managerUsers = useMemo(
    () => users.filter((user) => ["manager", "restaurant"].includes(user.role)),
    [users]
  );

  const customerUsers = useMemo(
    () => users.filter((user) => user.role === "customer"),
    [users]
  );

  const paidOrders = useMemo(
    () => orders.filter((order) => order.paymentStatus === "Paid"),
    [orders]
  );

  const platformSummary = useMemo(
    () => [
      {
        label: "Platform Managers",
        value: managerUsers.length,
        caption: "Assigned restaurant owners",
      },
      {
        label: "Customer Accounts",
        value: customerUsers.length,
        caption: "Active end users",
      },
      {
        label: "Paid Orders",
        value: paidOrders.length,
        caption: "Successful checkout events",
      },
      {
        label: "Revenue Payout",
        value: formatCurrency(dashboard.totalRevenue),
        caption: "Gross platform revenue",
      },
    ],
    [managerUsers.length, customerUsers.length, paidOrders.length, dashboard.totalRevenue]
  );

  const recentPlatformActivity = useMemo(() => orders.slice(0, 12), [orders]);
  const activityPageSize = 3;
  const activityPageCount = Math.max(1, Math.ceil(recentPlatformActivity.length / activityPageSize));
  const paginatedActivity = useMemo(() => {
    const start = (activityPage - 1) * activityPageSize;
    return recentPlatformActivity.slice(start, start + activityPageSize);
  }, [recentPlatformActivity, activityPage]);

  const renderDashboardOverview = () => (
    <div className="admin-portal-stack">
      <section className="admin-hero-card">
        <div>
          <p className="admin-hero__eyebrow">Super Admin Command Center</p>
          <h2>Platform-wide operational control</h2>
          <p>
            Monitor restaurant managers, approve restaurant operations, control order flow,
            and orchestrate platform revenue from one premium SaaS-style workspace.
          </p>
        </div>
        <div className="admin-hero__badge">Live Platform</div>
      </section>

      <DashboardCards dashboard={dashboard} />

      <section className="admin-metric-grid">
        {platformSummary.map((item) => (
          <article key={item.label} className="glass-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.caption}</small>
          </article>
        ))}
      </section>

      <section className="admin-grid">
        <article className="glass-card admin-card--span-2">
          <div className="admin-card__header">
            <h3>Platform Highlights</h3>
            <span>Operational pulse</span>
          </div>
          <ul className="admin-list">
            <li>Managers are scoped only to their assigned restaurant workspace.</li>
            <li>Admin controls remain distinct from the manager dashboard experience.</li>
            <li>Platform revenue and order health are monitored in one place.</li>
          </ul>
        </article>

        <article className="glass-card">
          <div className="admin-card__header">
            <h3>Recent Activity</h3>
            <span>Latest orders</span>
          </div>
          <div className="admin-activity-list">
            {paginatedActivity.map((order) => (
              <div key={order._id} className="admin-activity-item">
                <div className="admin-activity-meta">
                  <strong>{order.user?.name || "Customer"}</strong>
                  <small>{order.restaurant?.restaurantName || "Restaurant"}</small>
                </div>
                <span className="status-pill pending">{order.status}</span>
              </div>
            ))}
          </div>
          <div className="admin-pagination">
            {Array.from({ length: activityPageCount }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={`admin-page-btn ${activityPage === page ? "active" : ""}`}
                onClick={() => setActivityPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </article>
      </section>
    </div>
  );

  const renderManagers = () => (
    <div className="admin-portal-stack">
      <section className="glass-card admin-card--full">
        <div className="admin-card__header">
          <h3>Restaurant Managers</h3>
          <span>{managerUsers.length} managers onboarded</span>
        </div>

        <form className="admin-assignment-form" onSubmit={handleAssignRestaurant}>
          <div className="admin-compact-grid">
            <label>
              <span>Select Manager</span>
              <select
                name="managerId"
                value={assignmentForm.managerId}
                onChange={handleAssignmentChange}
              >
                <option value="">Choose a manager</option>
                {managerUsers.map((manager) => (
                  <option key={manager._id} value={manager._id}>
                    {manager.name} ({manager.email})
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Select Restaurant</span>
              <select
                name="restaurantId"
                value={assignmentForm.restaurantId}
                onChange={handleAssignmentChange}
              >
                <option value="">Choose a restaurant</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant._id} value={restaurant._id}>
                    {restaurant.restaurantName}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button type="submit" className="admin-primary-btn" disabled={assigning}>
            {assigning ? "Assigning..." : "Assign Restaurant to Manager"}
          </button>
        </form>

        <div className="admin-compact-grid">
          {managerUsers.length === 0 ? (
            <p className="admin-empty-state">No restaurant managers found.</p>
          ) : (
            managerUsers.map((manager) => (
              <div key={manager._id} className="admin-mini-card">
                <strong>{manager.name}</strong>
                <p>{manager.email}</p>
                <span>{manager.isBlocked ? "Blocked" : "Active"}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );

  const renderRequests = () => (
    <div className="admin-portal-stack">
      <section className="glass-card admin-card--full">
        <div className="admin-card__header">
          <h3>Restaurant Requests</h3>
          <span>{restaurants.length} restaurants in queue</span>
        </div>
        <div className="admin-request-list">
          {restaurants.length === 0 ? (
            <p className="admin-empty-state">No restaurant requests found.</p>
          ) : (
            restaurants.slice(0, 6).map((restaurant) => (
              <div key={restaurant._id} className="admin-request-item">
                <div>
                  <strong>{restaurant.restaurantName}</strong>
                  <p>{restaurant.address || "No address provided"}</p>
                </div>
                <span className={restaurant.isOpen ? "status-pill active" : "status-pill pending"}>
                  {restaurant.isOpen ? "Approved" : "Review"}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );

  const renderCustomers = () => <UsersTable users={customerUsers} refreshUsers={loadAdminData} />;

  const renderPayments = () => (
    <div className="admin-portal-stack">
      <section className="glass-card admin-card--full">
        <div className="admin-card__header">
          <h3>Payments & Settlements</h3>
          <span>{paidOrders.length} successful payment records</span>
        </div>
        <div className="admin-compact-grid">
          <div className="admin-mini-card">
            <strong>{paidOrders.length}</strong>
            <p>Confirmed payments</p>
          </div>
          <div className="admin-mini-card">
            <strong>{formatCurrency(dashboard.totalRevenue)}</strong>
            <p>Settled revenue</p>
          </div>
          <div className="admin-mini-card">
            <strong>{orders.length}</strong>
            <p>Total transactions</p>
          </div>
        </div>
      </section>
    </div>
  );

  const renderRevenue = () => (
    <div className="admin-portal-stack">
      <section className="glass-card admin-card--full">
        <div className="admin-card__header">
          <h3>Revenue Overview</h3>
          <span>Gross platform earnings</span>
        </div>
        <div className="admin-revenue-box">
          <div>
            <p>Total revenue</p>
            <strong>{formatCurrency(dashboard.totalRevenue)}</strong>
          </div>
          <div>
            <p>Orders processed</p>
            <strong>{dashboard.totalOrders}</strong>
          </div>
        </div>
      </section>
    </div>
  );

  const renderAnalytics = () => (
    <div className="admin-portal-stack">
      <section className="glass-card admin-card--full">
        <div className="admin-card__header">
          <h3>Platform Analytics</h3>
          <span>Trusted insights</span>
        </div>
        <div className="admin-chart-grid">
          <div className="admin-chart-bar-group">
            {[42, 55, 68, 60, 75, 89, 72].map((value, index) => (
              <div key={index} className="admin-chart-bar-wrap">
                <span className="admin-chart-bar" style={{ height: `${value}%` }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const renderReports = () => (
    <div className="admin-portal-stack">
      <section className="glass-card admin-card--full">
        <div className="admin-card__header">
          <h3>Admin Reports</h3>
          <span>Executive summary view</span>
        </div>
        <div className="admin-compact-grid">
          <div className="admin-mini-card">
            <strong>{dashboard.pendingOrders}</strong>
            <p>Pending orders</p>
          </div>
          <div className="admin-mini-card">
            <strong>{dashboard.deliveredOrders}</strong>
            <p>Delivered orders</p>
          </div>
          <div className="admin-mini-card">
            <strong>{restaurants.length}</strong>
            <p>Restaurant records</p>
          </div>
        </div>
      </section>
    </div>
  );

  const renderSettings = () => (
    <div className="admin-portal-stack">
      <section className="glass-card admin-card--full">
        <div className="admin-card__header">
          <h3>Platform Settings</h3>
          <span>Configuration controls</span>
        </div>
        <ul className="admin-list">
          <li>Role boundary: managers stay limited to their assigned restaurant.</li>
          <li>Admin control: full platform oversight stays in the super admin console.</li>
          <li>Operations visibility: dashboard, revenue, orders, users, and logs remain centralized.</li>
        </ul>
      </section>
    </div>
  );

  const renderLogs = () => (
    <div className="admin-portal-stack">
      <section className="glass-card admin-card--full">
        <div className="admin-card__header">
          <h3>Activity Logs</h3>
          <span>Recent platform actions</span>
        </div>
        <div className="admin-activity-list">
          {paginatedActivity.map((order) => (
            <div key={`${order._id}-log`} className="admin-activity-item">
              <div className="admin-activity-meta">
                <strong>{order.user?.name || "Customer"}</strong>
                <small>{new Date(order.createdAt).toLocaleString()}</small>
              </div>
              <span className="status-pill pending">{order.status}</span>
            </div>
          ))}
        </div>
        <div className="admin-pagination">
          {Array.from({ length: activityPageCount }, (_, index) => index + 1).map((page) => (
            <button
              key={`log-${page}`}
              type="button"
              className={`admin-page-btn ${activityPage === page ? "active" : ""}`}
              onClick={() => setActivityPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      </section>
    </div>
  );

  if (loading) {
    return <div className="admin-loading">Loading Admin Dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="admin-content">
        <h1>🛡 Super Admin Dashboard</h1>
        <p className="admin-subtitle">
          Keep the full food delivery platform under centralized control with a differentiated
          SaaS-style administrator workspace.
        </p>

        {activeTab === "dashboard" && renderDashboardOverview()}
        {activeTab === "managers" && renderManagers()}
        {activeTab === "requests" && renderRequests()}
        {activeTab === "restaurants" && (
          <RestaurantsTable restaurants={restaurants} refreshRestaurants={loadAdminData} />
        )}
        {activeTab === "customers" && renderCustomers()}
        {activeTab === "orders" && <OrdersTable orders={orders} refreshOrders={loadAdminData} />}
        {activeTab === "payments" && renderPayments()}
        {activeTab === "revenue" && renderRevenue()}
        {activeTab === "analytics" && renderAnalytics()}
        {activeTab === "reports" && renderReports()}
        {activeTab === "settings" && renderSettings()}
        {activeTab === "logs" && renderLogs()}
      </div>
    </div>
  );
};

export default AdminDashboard;