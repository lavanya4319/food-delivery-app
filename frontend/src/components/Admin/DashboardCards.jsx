import "./DashboardCards.css";

const DashboardCards = ({ dashboard }) => {
  return (
    <div className="dashboard-cards">

      <div className="dashboard-card">
        <h2>👥</h2>

        <h3>{dashboard.totalUsers}</h3>

        <p>Total Users</p>
      </div>

      <div className="dashboard-card">
        <h2>🍽</h2>

        <h3>{dashboard.totalRestaurants}</h3>

        <p>Restaurants</p>
      </div>

      <div className="dashboard-card">
        <h2>📦</h2>

        <h3>{dashboard.totalOrders}</h3>

        <p>Total Orders</p>
      </div>

      <div className="dashboard-card">
        <h2>💰</h2>

        <h3>₹ {dashboard.totalRevenue}</h3>

        <p>Total Revenue</p>
      </div>

      <div className="dashboard-card">
        <h2>🟡</h2>

        <h3>{dashboard.pendingOrders}</h3>

        <p>Pending Orders</p>
      </div>

      <div className="dashboard-card">
        <h2>✅</h2>

        <h3>{dashboard.deliveredOrders}</h3>

        <p>Delivered Orders</p>
      </div>

    </div>
  );
};

export default DashboardCards;