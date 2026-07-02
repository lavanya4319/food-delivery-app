import API from "./axios";

// Get menu items of a restaurant
export const getMenuByRestaurant = async (restaurantId) => {
  const res = await API.get(`/menu-items/restaurant/${restaurantId}`);
  return res.data;
};