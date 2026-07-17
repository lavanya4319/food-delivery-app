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
