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

export const updateProfile = async (payload) => {
  try {
    const { data } = await API.put("/auth/profile", payload);
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to update profile",
      }
    );
  }
};

export const changePassword = async (payload) => {
  try {
    const { data } = await API.patch("/auth/change-password", payload);
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: "Failed to change password",
      }
    );
  }
};