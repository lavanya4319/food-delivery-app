import { useEffect, useState } from "react";

import {
  getDashboardStats,
  getAllUsers,
  getAllRestaurants,
  getAllOrders,
} from "../../api/adminApi";

import Sidebar from "../../components/Admin/Sidebar";
import DashboardCards from "../../components/Admin/DashboardCards";
import UsersTable from "../../components/Admin/UsersTable";
import RestaurantsTable from "../../components/Admin/RestaurantsTable";
import OrdersTable from "../../components/Admin/OrdersTable";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] =
    useState("dashboard");

  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
  });

  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] =
    useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);

    const [
      dashboardResponse,
      usersResponse,
      restaurantsResponse,
      ordersResponse,
    ] = await Promise.all([
      getDashboardStats(),
      getAllUsers(),
      getAllRestaurants(),
      getAllOrders(),
    ]);

    if (dashboardResponse.success) {
      setDashboard(
        dashboardResponse.dashboard
      );
    }

    if (usersResponse.success) {
      setUsers(usersResponse.users);
    }

    if (restaurantsResponse.success) {
      setRestaurants(
        restaurantsResponse.restaurants
      );
    }

    if (ordersResponse.success) {
      setOrders(ordersResponse.orders);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="admin-content">

        <>
        <h1>🛡 Admin Dashboard</h1>

        <p className="admin-subtitle">
    Welcome back! Manage users, restaurants, orders and monitor your platform from one place.
        </p>
        </>

        {activeTab === "dashboard" && (
          <DashboardCards
            dashboard={dashboard}
          />
        )}

        {activeTab === "users" && (
          <UsersTable
          users={users}
          refreshUsers={loadAdminData}
          />
        )}

        {activeTab ===
          "restaurants" && (
          <RestaurantsTable
            restaurants={restaurants}
            refreshRestaurants={loadAdminData}
          />
        )}

        {activeTab === "orders" && (
          <OrdersTable
            orders={orders}
            refreshOrders={loadAdminData}
          />
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;