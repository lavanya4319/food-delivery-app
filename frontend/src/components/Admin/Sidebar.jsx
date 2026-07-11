import "./Sidebar.css";

const Sidebar = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <aside className="admin-sidebar">

      <div className="admin-logo">
        <h2>🍔 FoodExpress</h2>
        <p>Admin Panel</p>
      </div>

      <div className="admin-menu">

        <button
          className={
            activeTab === "dashboard"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("dashboard")
          }
        >
          <span>🏠</span>
          Dashboard
        </button>

        <button
          className={
            activeTab === "users"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("users")
          }
        >
          <span>👥</span>
          Users
        </button>

        <button
          className={
            activeTab === "restaurants"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("restaurants")
          }
        >
          <span>🍽</span>
          Restaurants
        </button>

        <button
          className={
            activeTab === "orders"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("orders")
          }
        >
          <span>📦</span>
          Orders
        </button>

      </div>

      <div className="admin-footer">
        <p>Administrator</p>
      </div>

    </aside>
  );
};

export default Sidebar;