import API from "./axios";

// Get restaurants owned by logged in restaurant owner
export const getMyRestaurants = async () => {
  try {
    const response = await API.get(
      "/restaurants/my-restaurants"
    );

    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

// Get orders of a restaurant
export const getRestaurantOrders = async (restaurantId) => {
  try {
    const response = await API.get(
      `/orders/restaurant/${restaurantId}`
    );

    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

// Update order status
export const updateOrderStatus = async (
  orderId,
  status
) => {
  try {
    const response = await API.put(
      `/orders/${orderId}/status`,
      {
        status,
      }
    );

    return response.data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};