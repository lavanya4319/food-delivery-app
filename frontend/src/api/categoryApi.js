import API from "./axios";

export const getCategoriesByRestaurant = async (restaurantId) => {
  try {
    const { data } = await API.get(
      `/categories/restaurant/${restaurantId}`
    );
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

export const createCategory = async (payload) => {
  try {
    const { data } = await API.post("/categories", payload);
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

export const updateCategory = async (categoryId, payload) => {
  try {
    const { data } = await API.put(`/categories/${categoryId}`, payload);
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const { data } = await API.delete(`/categories/${categoryId}`);
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  }
};
