import API from "./axios";

// Get all restaurants
export const getRestaurants = async () => {
  const res = await API.get("/restaurants");
  return res.data;
};