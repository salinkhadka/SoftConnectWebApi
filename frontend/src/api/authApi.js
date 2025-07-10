import axios from "./api";

// Register user (no token needed)
export const registerUserApi = (data) =>
  axios.post("user/register", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });


// Request password reset link (no token needed)
export const requestPasswordResetApi = (email) => {
  return axios.post("user/request-reset", { email });
};

export const resetPasswordApi = (token, password) => {
  return axios.post(`user/reset-password/${token}`, { password });
};



// Login user (no token needed)
export const loginUserApi = (data) =>
  axios.post("user/login", data);

// Get all users (admin only, token required)
export const getAllUsersApi = (params) => {
  return axios.get("user/getAll", { params });
};

export const getUserByIdApi = (id) => {
  return axios.get(`http://localhost:2000/user/${id}`);
};

// Update user (token required)
export const updateUserApi = (id, data) => {
  const token = localStorage.getItem("token");
  return axios.put(`user/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

// Delete user (admin only, token required)
export const deleteUserApi = (id) => {
  const token = localStorage.getItem("token");
  return axios.delete(`user/${id}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};
