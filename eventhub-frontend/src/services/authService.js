import axios from "axios";
import BASE_URL from "./base_api";

const AUTH_URL = `${BASE_URL}/api/auth`;

// Login
const login = (email, password) =>
  axios.post(
    `${AUTH_URL}/login`,
    { email, password },
    { withCredentials: true }
  );

// Register (currently commented out)
// const register = (name, email, password) =>
//   axios.post(
//     `${AUTH_URL}/register`,
//     { name, email, password },
//     { withCredentials: true }
//   );

// Get current user
export const getCurrentUser = async () => {
  const res = await axios.get(`${AUTH_URL}/me`, {
    withCredentials: true,
  });
  return res.data;
};

// Update user profile
const updateProfile = (updatedData) =>
  axios.put(`${AUTH_URL}/profile`, updatedData, {
    withCredentials: true,
  });

// Logout
const logout = () =>
  axios.post(`${AUTH_URL}/logout`, {}, {
    withCredentials: true,
  });

// Make user an admin
const makeUserAdmin = (userId) =>
  axios.post(`${AUTH_URL}/makeadmin/${userId}`, {}, {
    withCredentials: true,
  });

// Remove admin role
const makeAdminUser = (userId) =>
  axios.post(`${AUTH_URL}/removeadmin/${userId}`, {}, {
    withCredentials: true,
  });

// Delete user
const deleteUser = () =>
  axios.delete(`${AUTH_URL}/delete`, {
    withCredentials: true,
  });

// Get user interests
const getMyInterests = () =>
  axios.get(`${AUTH_URL}/interests`, {
    withCredentials: true,
  });

// Save user interests
const saveInterests = (categoryIds) =>
  axios.post(
    `${AUTH_URL}/interests`,
    { categoryIds },
    { withCredentials: true }
  );

// Get categories
const getCategories = () =>
  axios.get(`${BASE_URL}/api/categories`, {
    withCredentials: true,
  });

// Forgot password - send OTP
const forgotPassword = (email) =>
  axios.post(`${AUTH_URL}/forgot-password`, { email });

// Verify OTP
const verifyOtp = (email, otp) =>
  axios.post(`${AUTH_URL}/verify-otp`, { email, otp });

// Reset password
const resetPassword = (resetToken, newPassword) =>
  axios.post(`${AUTH_URL}/reset-password`, {
    resetToken,
    newPassword,
  });

const authService = {
  login,
  // register,
  updateProfile,
  logout,
  makeUserAdmin,
  makeAdminUser,
  deleteUser,
  getMyInterests,
  saveInterests,
  getCategories,
  forgotPassword,
  verifyOtp,
  resetPassword,
};

export default authService;