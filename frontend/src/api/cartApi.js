import API from "./axios";

export const getCart = async () => {
  try {
    const { data } = await API.get("/cart");
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch cart",
      }
    );
  }
};

export const addToCart = async (menuItemId, quantity = 1) => {
  try {
    const { data } = await API.post("/cart/add", {
      menuItemId,
      quantity,
    });

    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to add item",
      }
    );
  }
};

export const updateCartItem = async (menuItemId, quantity) => {
  try {
    const { data } = await API.put("/cart/update", {
      menuItemId,
      quantity,
    });

    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to update cart",
      }
    );
  }
};

export const removeCartItem = async (menuItemId) => {
  try {
    const { data } = await API.delete(`/cart/remove/${menuItemId}`);
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to remove item",
      }
    );
  }
};

export const clearCart = async () => {
  try {
    const { data } = await API.delete("/cart/clear");
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to clear cart",
      }
    );
  }
};