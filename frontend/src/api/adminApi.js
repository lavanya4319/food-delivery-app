import API from "./axios";

export const getDashboardStats = async () => {
  try {
    const { data } = await API.get("/admin/dashboard");
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Server Error",
      }
    );
  }
};

export const getAllUsers = async () => {
  try {
    const { data } = await API.get("/admin/users");
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Server Error",
      }
    );
  }
};

export const toggleUserBlockStatus = async (userId) => {
  try {
    const { data } = await API.patch(
      `/admin/users/${userId}/block`
    );

    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Server Error",
      }
    );
  }
};

export const getAllRestaurants = async () => {
  try {
    const { data } = await API.get("/admin/restaurants");
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Server Error",
      }
    );
  }
};

export const createRestaurant = async (payload) => {
  try {
    const { data } = await API.post("/restaurants", payload);
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Server Error",
      }
    );
  }
};

export const updateRestaurant = async (
  restaurantId,
  payload
) => {
  try {
    const { data } = await API.put(
      `/restaurants/${restaurantId}`,
      payload
    );
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Server Error",
      }
    );
  }
};

export const deleteRestaurant = async (restaurantId) => {
  try {
    const { data } = await API.delete(
      `/restaurants/${restaurantId}`
    );
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Server Error",
      }
    );
  }
};

export const toggleRestaurantStatus = async (
  restaurantId
) => {
  try {
    const { data } = await API.patch(
      `/restaurants/${restaurantId}/status`
    );

    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Server Error",
      }
    );
  }
};

export const getAllOrders = async () => {
  try {
    const { data } = await API.get("/admin/orders");
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Server Error",
      }
    );
  }
};

export const getMenuByRestaurant = async (
  restaurantId
) => {
  try {
    const { data } = await API.get(
      `/menu-items/restaurant/${restaurantId}`
    );
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Server Error",
      }
    );
  }
};

export const createMenuItem = async (payload) => {
  try {
    const { data } = await API.post(
      "/menu-items",
      payload
    );
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Server Error",
      }
    );
  }
};

export const updateMenuItem = async (
  menuItemId,
  payload
) => {
  try {
    const { data } = await API.put(
      `/menu-items/${menuItemId}`,
      payload
    );
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Server Error",
      }
    );
  }
};

export const deleteMenuItem = async (menuItemId) => {
  try {
    const { data } = await API.delete(
      `/menu-items/${menuItemId}`
    );
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Server Error",
      }
    );
  }
};

export const updateOrderStatus = async (
  orderId,
  status
) => {
  try {
    const { data } = await API.patch(
      `/admin/orders/${orderId}/status`,
      {
        status,
      }
    );

    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Server Error",
      }
    );
  }
};