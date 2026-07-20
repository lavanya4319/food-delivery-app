import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getMyRestaurants, getRestaurantOrders, updateOrderStatus } from "../../api/restaurantDashboardApi";
import { getCategoriesByRestaurant, createCategory, updateCategory, deleteCategory } from "../../api/categoryApi";
import { getMenuByRestaurant } from "../../api/menuApi";
import { createMenuItem, updateMenuItem, deleteMenuItem } from "../../api/adminApi";
import "./ManagerDashboard.css";

const initialMenuForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  isAvailable: true,
};

const initialCategoryForm = {
  name: "",
  description: "",
};

const ManagerDashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [restaurantTab, setRestaurantTab] = useState("details");
  const [menuForm, setMenuForm] = useState(initialMenuForm);
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm);
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [reviewReply, setReviewReply] = useState({});

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);

    const restaurantResponse = await getMyRestaurants();

    if (!restaurantResponse.success) {
      toast.error(restaurantResponse.message || "Unable to load restaurant data");
      setLoading(false);
      return;
    }

    if (!restaurantResponse.restaurants || restaurantResponse.restaurants.length === 0) {
      setRestaurant(null);
      setOrders([]);
      setMenuItems([]);
      setCategories([]);
      toast.info("No restaurant is assigned to this manager account yet.");
      setLoading(false);
      return;
    }

    const myRestaurant = restaurantResponse.restaurants[0];
    setRestaurant(myRestaurant);

    const [orderResponse, menuResponse, categoryResponse] = await Promise.all([
      getRestaurantOrders(myRestaurant._id),
      getMenuByRestaurant(myRestaurant._id),
      getCategoriesByRestaurant(myRestaurant._id),
    ]);

    if (orderResponse.success) {
      setOrders(orderResponse.orders);
    }

    if (menuResponse.success) {
      setMenuItems(menuResponse.menuItems || []);
    }

    if (categoryResponse.success) {
      setCategories(categoryResponse.categories || []);
    }

    setLoading(false);
  };

  const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

  const today = new Date();
  const todayString = today.toDateString();

  const todaysOrders = useMemo(
    () => orders.filter((order) => order.createdAt && new Date(order.createdAt).toDateString() === todayString),
    [orders, todayString]
  );

  const pendingOrders = orders.filter((order) => order.status === "Pending").length;
  const completedOrders = orders.filter((order) => order.status === "Delivered").length;
  const cancelledOrders = orders.filter((order) => order.status === "Cancelled").length;
  const todaysRevenue = todaysOrders.reduce((acc, order) => acc + Number(order.totalAmount || 0), 0);
  const customerCount = new Set(orders.map((order) => order.user?._id).filter(Boolean)).size;

  const stats = useMemo(
    () => [
      { label: "Today's Orders", value: todaysOrders.length },
      { label: "Pending Orders", value: pendingOrders },
      { label: "Completed Orders", value: completedOrders },
      { label: "Cancelled Orders", value: cancelledOrders },
      { label: "Today's Revenue", value: formatCurrency(todaysRevenue) },
      { label: "Total Customers", value: customerCount },
    ],
    [todaysOrders.length, pendingOrders, completedOrders, cancelledOrders, todaysRevenue, customerCount]
  );

  const recentOrders = orders.slice(0, 5);

  const customerList = useMemo(() => {
    const grouped = new Map();

    orders.forEach((order) => {
      const customer = order.user || {};
      const key = customer._id || order.phone || customer.email;

      if (!key) {
        return;
      }

      const existing = grouped.get(key) || {
        name: customer.name || "Customer",
        phone: customer.phone || order.phone || "—",
        address: order.deliveryAddress || "—",
        orderCount: 0,
        lastOrder: order.createdAt || null,
      };

      existing.orderCount += 1;
      if (order.createdAt && (!existing.lastOrder || new Date(order.createdAt) > new Date(existing.lastOrder))) {
        existing.lastOrder = order.createdAt;
      }

      grouped.set(key, existing);
    });

    return [...grouped.values()].slice(0, 6);
  }, [orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    const response = await updateOrderStatus(orderId, newStatus);

    if (response.success) {
      toast.success(response.message || "Order status updated");
      setOrders((current) =>
        current.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order))
      );
    } else {
      toast.error(response.message || "Unable to update order status");
    }
  };

  const handleAcceptOrder = async (orderId) => {
    await handleStatusChange(orderId, "Preparing");
  };

  const handleRejectOrder = async (orderId) => {
    await handleStatusChange(orderId, "Cancelled");
  };

  const resetMenuForm = () => {
    setMenuForm(initialMenuForm);
    setEditingMenuId(null);
  };

  const resetCategoryForm = () => {
    setCategoryForm(initialCategoryForm);
    setEditingCategoryId(null);
  };

  const handleMenuSubmit = async (event) => {
    event.preventDefault();

    if (!restaurant) {
      return;
    }

    const payload = {
      ...menuForm,
      price: Number(menuForm.price),
      categoryId: menuForm.category,
      restaurantId: restaurant._id,
    };

    const response = editingMenuId
      ? await updateMenuItem(editingMenuId, payload)
      : await createMenuItem(payload);

    if (response.success) {
      toast.success(response.message || "Menu item saved");
      resetMenuForm();
      await loadDashboard();
    } else {
      toast.error(response.message || "Unable to save menu item");
    }
  };

  const handleEditMenuItem = (item) => {
    setEditingMenuId(item._id);
    setMenuForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category?._id || item.category,
      image: item.image || "",
      isAvailable: item.isAvailable,
    });
    setRestaurantTab("menu");
  };

  const handleDeleteMenuItem = async (menuItemId) => {
    const response = await deleteMenuItem(menuItemId);

    if (response.success) {
      toast.success(response.message || "Menu item deleted");
      await loadDashboard();
    } else {
      toast.error(response.message || "Unable to delete menu item");
    }
  };

  const handleCategorySubmit = async (event) => {
    event.preventDefault();

    if (!restaurant) {
      return;
    }

    const payload = {
      ...categoryForm,
      restaurantId: restaurant._id,
    };

    const response = editingCategoryId
      ? await updateCategory(editingCategoryId, payload)
      : await createCategory(payload);

    if (response.success) {
      toast.success(response.message || "Category saved");
      resetCategoryForm();
      await loadDashboard();
    } else {
      toast.error(response.message || "Unable to save category");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategoryId(category._id);
    setCategoryForm({
      name: category.name,
      description: category.description || "",
    });
    setRestaurantTab("categories");
  };

  const handleDeleteCategory = async (categoryId) => {
    const response = await deleteCategory(categoryId);

    if (response.success) {
      toast.success(response.message || "Category deleted");
      await loadDashboard();
    } else {
      toast.error(response.message || "Unable to delete category");
    }
  };

  const sidebarItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "orders", label: "Orders" },
    { key: "customers", label: "Customers" },
    { key: "analytics", label: "Analytics" },
    { key: "restaurant", label: "Restaurant" },
    { key: "settings", label: "Settings" },
  ];

  const restaurantTabs = ["details", "menu", "categories", "reviews"];

  if (loading) {
    return (
      <div className="manager-dashboard">
        <div className="manager-shell-loading">Loading Restaurant Manager Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="manager-dashboard">
      <div className="manager-layout">
        <aside className="manager-sidebar">
          <div className="manager-sidebar__brand">
            <h2>🍽️ FoodExpress</h2>
            <p>Single Restaurant Ops</p>
          </div>

          <nav className="manager-sidebar__menu">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`manager-sidebar__button ${activeSection === item.key ? "active" : ""}`}
                onClick={() => setActiveSection(item.key)}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="manager-content">
          <section className="manager-hero">
            <div>
              <p className="manager-hero__eyebrow">Restaurant Manager</p>
              <h1>One Restaurant. Full Control.</h1>
              <p className="manager-hero__subtext">
                Manage restaurant details, menu, categories, customer orders, and fulfillment from a focused operations workspace.
              </p>
            </div>
          </section>

          <section className="manager-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="manager-stat-card">
                <div className="manager-stat-card__label">{stat.label}</div>
                <div className="manager-stat-card__value">{stat.value}</div>
              </div>
            ))}
          </section>

          {activeSection === "dashboard" && (
            <section className="manager-stack">
              <div className="manager-panel manager-panel--wide">
                <div className="manager-panel__header">
                  <h3>Weekly Orders</h3>
                  <span>Last 7 days</span>
                </div>
                <div className="manager-chart-bar-group">
                  {[38, 52, 61, 85, 76, 92, 74].map((height, index) => (
                    <div key={index} className="manager-chart-bar-wrap">
                      <span className="manager-chart-bar" style={{ height: `${height}%` }} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="manager-panel manager-panel--wide">
                <div className="manager-panel__header">
                  <h3>Daily Revenue</h3>
                  <span>Today’s flow</span>
                </div>
                <div className="manager-chart-bar-group manager-chart-bar-group--revenue">
                  {[24, 31, 46, 58, 44, 66, 52].map((height, index) => (
                    <div key={index} className="manager-chart-bar-wrap">
                      <span className="manager-chart-bar" style={{ height: `${height}%` }} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="manager-table-card">
                <div className="manager-panel__header">
                  <h3>Recent Orders</h3>
                  <span>Latest kitchen activity</span>
                </div>
                <table className="manager-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Address</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>{order.user?.name || "Customer"}</td>
                        <td>{order.deliveryAddress}</td>
                        <td><span className="manager-status-badge">{order.status}</span></td>
                        <td>{formatCurrency(order.totalAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="manager-table-card">
                <div className="manager-panel__header">
                  <h3>Recent Customers</h3>
                  <span>Repeat ordering customers</span>
                </div>
                <table className="manager-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Orders</th>
                      <th>Last Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerList.map((customer, index) => (
                      <tr key={`${customer.name}-${index}`}>
                        <td>{customer.name}</td>
                        <td>{customer.phone}</td>
                        <td>{customer.address}</td>
                        <td>{customer.orderCount}</td>
                        <td>{customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeSection === "restaurant" && (
            <section className="manager-panel">
              <div className="manager-tabs">
                {restaurantTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`manager-tab-btn ${restaurantTab === tab ? "active" : ""}`}
                    onClick={() => setRestaurantTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {restaurantTab === "details" && (
                <div className="manager-detail-grid">
                  <div className="manager-image-card">
                    <img src={restaurant?.image || "https://placehold.co/520x320?text=Restaurant+Image"} alt={restaurant?.restaurantName || "Restaurant"} />
                  </div>
                  <div className="manager-info-list">
                    <div className="manager-info-row"><strong>Restaurant Name</strong><span>{restaurant?.restaurantName || "—"}</span></div>
                    <div className="manager-info-row"><strong>Restaurant Address</strong><span>{restaurant?.address || "—"}</span></div>
                    <div className="manager-info-row"><strong>Restaurant Timing</strong><span>{restaurant?.openingTime || "—"} - {restaurant?.closingTime || "—"}</span></div>
                    <div className="manager-info-row"><strong>Delivery Charges</strong><span>{formatCurrency(restaurant?.minimumOrder || 0)}</span></div>
                    <div className="manager-info-row"><strong>Restaurant Status</strong><span>{restaurant?.isOpen ? "Open" : "Closed"}</span></div>
                  </div>
                </div>
              )}

              {restaurantTab === "menu" && (
                <div className="manager-stack">
                  <form className="manager-form" onSubmit={handleMenuSubmit}>
                    <div className="manager-form__grid">
                      <input value={menuForm.name} onChange={(event) => setMenuForm((current) => ({ ...current, name: event.target.value }))} placeholder="Food name" required />
                      <input value={menuForm.price} onChange={(event) => setMenuForm((current) => ({ ...current, price: event.target.value }))} placeholder="Food price" type="number" required />
                      <select value={menuForm.category} onChange={(event) => setMenuForm((current) => ({ ...current, category: event.target.value }))} required>
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                      </select>
                      <input value={menuForm.image} onChange={(event) => setMenuForm((current) => ({ ...current, image: event.target.value }))} placeholder="Food image URL" />
                    </div>
                    <textarea value={menuForm.description} onChange={(event) => setMenuForm((current) => ({ ...current, description: event.target.value }))} placeholder="Food description" required />
                    <label className="manager-toggle">
                      <input type="checkbox" checked={menuForm.isAvailable} onChange={(event) => setMenuForm((current) => ({ ...current, isAvailable: event.target.checked }))} />
                      Available for order
                    </label>
                    <div className="manager-form__actions">
                      <button type="submit" className="manager-primary-btn">{editingMenuId ? "Update Food" : "Add Food"}</button>
                      <button type="button" className="manager-secondary-btn" onClick={resetMenuForm}>Reset</button>
                    </div>
                  </form>

                  <div className="manager-item-grid">
                    {menuItems.map((item) => (
                      <div key={item._id} className="manager-item-card">
                        <div className="manager-item-card__top">
                          <div>
                            <strong>{item.name}</strong>
                            <p>{item.description}</p>
                          </div>
                          <span>{item.isAvailable ? "Available" : "Unavailable"}</span>
                        </div>
                        <div className="manager-item-card__meta">
                          <span>{item.category?.name || "Uncategorized"}</span>
                          <span>{formatCurrency(item.price)}</span>
                        </div>
                        <div className="manager-item-card__actions">
                          <button type="button" onClick={() => handleEditMenuItem(item)}>Edit</button>
                          <button type="button" onClick={() => handleDeleteMenuItem(item._id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {restaurantTab === "categories" && (
                <div className="manager-stack">
                  <form className="manager-form" onSubmit={handleCategorySubmit}>
                    <div className="manager-form__grid manager-form__grid--single">
                      <input value={categoryForm.name} onChange={(event) => setCategoryForm((current) => ({ ...current, name: event.target.value }))} placeholder="Category name" required />
                    </div>
                    <textarea value={categoryForm.description} onChange={(event) => setCategoryForm((current) => ({ ...current, description: event.target.value }))} placeholder="Category description" />
                    <div className="manager-form__actions">
                      <button type="submit" className="manager-primary-btn">{editingCategoryId ? "Update Category" : "Add Category"}</button>
                      <button type="button" className="manager-secondary-btn" onClick={resetCategoryForm}>Reset</button>
                    </div>
                  </form>

                  <div className="manager-item-grid">
                    {categories.map((category) => (
                      <div key={category._id} className="manager-item-card">
                        <strong>{category.name}</strong>
                        <p>{category.description || "No description added"}</p>
                        <div className="manager-item-card__actions">
                          <button type="button" onClick={() => handleEditCategory(category)}>Edit</button>
                          <button type="button" onClick={() => handleDeleteCategory(category._id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {restaurantTab === "reviews" && (
                <div className="manager-stack">
                  <div className="manager-item-grid">
                    {orders.slice(0, 4).map((order, index) => (
                      <div key={`${order._id}-${index}`} className="manager-review-card">
                        <strong>{order.user?.name || "Customer"}</strong>
                        <p>“Food arrived on time and was delicious.”</p>
                        <textarea rows="3" value={reviewReply[order._id] || ""} onChange={(event) => setReviewReply((current) => ({ ...current, [order._id]: event.target.value }))} placeholder="Reply to review" />
                        <button type="button" className="manager-primary-btn">Reply</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {activeSection === "customers" && (
            <section className="manager-panel">
              <div className="manager-panel__header">
                <h3>Customers</h3>
                <span>Only customers who ordered from this restaurant</span>
              </div>
              <table className="manager-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Order Count</th>
                    <th>Last Order</th>
                  </tr>
                </thead>
                <tbody>
                  {customerList.map((customer, index) => (
                    <tr key={`${customer.name}-${index}`}>
                      <td>{customer.name}</td>
                      <td>{customer.phone}</td>
                      <td>{customer.address}</td>
                      <td>{customer.orderCount}</td>
                      <td>{customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {activeSection === "orders" && (
            <section className="manager-panel">
              <div className="manager-panel__header">
                <h3>Orders</h3>
                <span>Accept, reject and update order flow</span>
              </div>
              <div className="manager-order-list">
                {orders.map((order) => (
                  <div key={order._id} className="manager-order-card">
                    <div className="manager-order-card__row">
                      <div>
                        <strong>{order.user?.name || "Customer"}</strong>
                        <p>{order.deliveryAddress}</p>
                      </div>
                      <span className="manager-status-badge">{order.status}</span>
                    </div>
                    <div className="manager-order-card__meta">
                      <span>{order.items?.length || 0} items</span>
                      <span>{formatCurrency(order.totalAmount)}</span>
                    </div>
                    <div className="manager-order-card__actions">
                      <button type="button" onClick={() => handleAcceptOrder(order._id)}>Accept</button>
                      <button type="button" onClick={() => handleRejectOrder(order._id)}>Reject</button>
                    </div>
                    <select value={order.status} onChange={(event) => handleStatusChange(order._id, event.target.value)}>
                      <option>Pending</option>
                      <option>Preparing</option>
                      <option>Out for Delivery</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeSection === "analytics" && (
            <section className="manager-stack">
              <div className="manager-panel manager-panel--wide">
                <div className="manager-panel__header">
                  <h3>Revenue Analytics</h3>
                  <span>Restaurant performance snapshot</span>
                </div>
                <div className="manager-grid">
                  <div className="manager-stat-card">
                    <div className="manager-stat-card__label">Today's Revenue</div>
                    <div className="manager-stat-card__value">{formatCurrency(todaysRevenue)}</div>
                  </div>
                  <div className="manager-stat-card">
                    <div className="manager-stat-card__label">Completed Orders</div>
                    <div className="manager-stat-card__value">{completedOrders}</div>
                  </div>
                  <div className="manager-stat-card">
                    <div className="manager-stat-card__label">Pending Orders</div>
                    <div className="manager-stat-card__value">{pendingOrders}</div>
                  </div>
                  <div className="manager-stat-card">
                    <div className="manager-stat-card__label">Active Customers</div>
                    <div className="manager-stat-card__value">{customerCount}</div>
                  </div>
                </div>
              </div>

              <div className="manager-panel manager-panel--wide">
                <div className="manager-panel__header">
                  <h3>Service Summary</h3>
                  <span>Single-restaurant control view</span>
                </div>
                <div className="manager-info-list">
                  <div className="manager-info-row"><strong>Assigned Restaurant</strong><span>{restaurant?.restaurantName || "—"}</span></div>
                  <div className="manager-info-row"><strong>Menu Items</strong><span>{menuItems.length}</span></div>
                  <div className="manager-info-row"><strong>Categories</strong><span>{categories.length}</span></div>
                  <div className="manager-info-row"><strong>Order Volume</strong><span>{orders.length}</span></div>
                </div>
              </div>
            </section>
          )}

          {activeSection === "settings" && (
            <section className="manager-panel">
              <div className="manager-panel__header">
                <h3>Settings</h3>
                <span>Restaurant manager account details</span>
              </div>
              <div className="manager-profile-card">
                <div className="manager-profile-card__row">
                  <strong>Manager</strong>
                  <span>{restaurant?.owner?.name || "Manager"}</span>
                </div>
                <div className="manager-profile-card__row">
                  <strong>Assigned Restaurant</strong>
                  <span>{restaurant?.restaurantName || "—"}</span>
                </div>
                <div className="manager-profile-card__row">
                  <strong>Permissions</strong>
                  <span>Dashboard, Orders, Customers, Analytics, Restaurant, Settings</span>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;
