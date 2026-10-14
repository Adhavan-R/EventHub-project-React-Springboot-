import axios from 'axios';
import BASE_URL from './base_api';

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/auth/register`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed';
  }
};