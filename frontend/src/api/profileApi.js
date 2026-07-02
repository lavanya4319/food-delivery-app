import API from "./axios";

export const getProfile = async () => {
  try {
    const { data } = await API.get("/auth/profile");
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to fetch profile",
      }
    );
  }
};