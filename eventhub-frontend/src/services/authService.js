// src/services/authService.js
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/auth";

// 🔐 Login
const login = (email, password) =>
  axios.post(`${BASE_URL}/login`, { email, password }, { withCredentials: true });

// // ✅ Register
// const register = (name, email, password) =>
//   axios.post(`${BASE_URL}/register`, { name, email, password }, { withCredentials: true });

// // 👤 Get current user (if needed for session check)
//  const getCurrentUser = () =>
//    axios.get(`${BASE_URL}/me`, { withCredentials: true }); 

// ✏️ Update user profile
const updateProfile = (updatedData) =>
  axios.put(`${BASE_URL}/profile`, updatedData, { withCredentials: true });

// 🚪 Logout
const logout = () =>
  axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });

const makeUserAdmin = (userId) =>
  axios.post(`${BASE_URL}/makeadmin/${userId}`, {}, { withCredentials: true });

const makeAdminUser = (userId) =>
  axios.post(`${BASE_URL}/removeadmin/${userId}`, {}, { withCredentials: true });

const deleteUser = () =>
  axios.delete(`${BASE_URL}/delete`, { withCredentials: true });

export const getCurrentUser = async () => {
  const res = await axios.get("http://localhost:8080/api/auth/me", {
    withCredentials: true,
  });
  return res.data;
};




const authService = {
  login,
  //register,
  //getCurrentUser,
  updateProfile,
  logout,
  makeUserAdmin,
  makeAdminUser,
  deleteUser
};

export default authService;
