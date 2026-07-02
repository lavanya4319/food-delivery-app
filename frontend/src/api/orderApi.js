import API from "./axios";

export const placeOrder = async (orderData) => {
  try {
    const { data } = await API.post("/orders", orderData);
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to place order",
      }
    );
  }
};

export const getUserOrders = async () => {
  try {
    const { data } = await API.get("/orders");
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch orders",
      }
    );
  }
};