import "./Sidebar.css";

const Sidebar = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="admin-sidebar">

      <h2>FoodExpress</h2>

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
        🏠 Dashboard
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
        👥 Users
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
        🍽 Restaurants
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
        📦 Orders
      </button>

    </div>
  );
};

export default Sidebar;