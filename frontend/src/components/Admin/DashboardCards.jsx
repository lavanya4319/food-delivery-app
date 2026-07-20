import "./DashboardCards.css";

const DashboardCards = ({ dashboard }) => {
  const cards = [
    {
      title: "Total Users",
      value: dashboard.totalUsers,
      icon: "👥",
      className: "users-card",
    },
    {
      title: "Restaurants",
      value: dashboard.totalRestaurants,
      icon: "🍽",
      className: "restaurants-card",
    },
    {
      title: "Orders",
      value: dashboard.totalOrders,
      icon: "📦",
      className: "orders-card",
    },
    {
      title: "Revenue",
      value: `₹${dashboard.totalRevenue}`,
      icon: "💰",
      className: "revenue-card",
    },
    {
      title: "Pending Orders",
      value: dashboard.pendingOrders,
      icon: "⏳",
      className: "pending-card",
    },
    {
      title: "Delivered",
      value: dashboard.deliveredOrders,
      icon: "✅",
      className: "delivered-card",
    },
  ];

  return (
    <div className="dashboard-cards">
      {cards.map((card) => (
        <div key={card.title} className={`dashboard-card ${card.className}`}>
          <div className="card-icon">{card.icon}</div>
          <div className="card-info">
            <h2>{card.value}</h2>
            <p>{card.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;