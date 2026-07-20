import "./Sidebar.css";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: "🏠" },
    { key: "managers", label: "Restaurant Managers", icon: "👔" },
    { key: "requests", label: "Restaurant Requests", icon: "📝" },
    { key: "restaurants", label: "Restaurants", icon: "🍽" },
    { key: "customers", label: "Customers", icon: "👥" },
    { key: "orders", label: "Orders", icon: "📦" },
    { key: "payments", label: "Payments", icon: "💳" },
    { key: "revenue", label: "Revenue", icon: "📈" },
    { key: "analytics", label: "Analytics", icon: "📊" },
    { key: "reports", label: "Reports", icon: "🧾" },
    { key: "settings", label: "Platform Settings", icon: "⚙️" },
    { key: "logs", label: "Activity Logs", icon: "🕘" },
    { key: "logout", label: "Logout", icon: "🚪" },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <h2>🍔 FoodExpress</h2>
        <p>Super Admin Control Center</p>
      </div>

      <div className="admin-menu">
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={activeTab === item.key ? "active" : ""}
            onClick={() => setActiveTab(item.key)}
            type="button"
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div className="admin-footer">
        <p>Platform Administrator</p>
      </div>
    </aside>
  );
};

export default Sidebar;