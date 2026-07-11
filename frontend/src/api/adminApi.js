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