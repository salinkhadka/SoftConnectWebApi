import {
  loginUserApi,
  registerUserApi,
  getAllUsersApi,
  getUserByIdApi,
  updateUserApi,
  deleteUserApi,
} from "../api/authApi";

// Register
export const registerUserService = async (formData) => {
  try {
    const response = await registerUserApi(formData);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Registration failed" };
  }
};

// Login
export const loginUserService = async (formData) => {
  try {
    const response = await loginUserApi(formData);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Login failed" };
  }
};

export const getAllUsersService = async (params) => {
  try {
    const response = await getAllUsersApi(params);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "User fetch failed" };
  }
};


export const getUserByIdService = async (id) => {
  try {
    const response = await getUserByIdApi(id);
    // your router returns data in res.data.data (from earlier example)
    return response.data.data;  // <-- return user data directly
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to fetch user" };
  }
};

// Update user
export const updateUserService = async (id, formData) => {
  try {
    const response = await updateUserApi(id, formData);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to update user" };
  }
};

// Delete user
export const deleteUserService = async (id) => {
  try {
    const response = await deleteUserApi(id);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to delete user" };
  }
};
