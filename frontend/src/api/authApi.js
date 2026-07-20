import API from "./axios";

export const registerUser = async (userData) => {
  try {
    const { data } = await API.post("/auth/register", userData);
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

export const loginUser = async (userData) => {
  try {
    const { data } = await API.post("/auth/login", userData);

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

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

export const forgotPasswordRequest = async (email) => {
  try {
    const { data } = await API.post("/auth/forgot-password", { email });
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

export const resetPasswordRequest = async (payload) => {
  try {
    const { data } = await API.post("/auth/reset-password", payload);
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

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getLoggedInUser = () => {
  const user = localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  return localStorage.getItem("token");
};