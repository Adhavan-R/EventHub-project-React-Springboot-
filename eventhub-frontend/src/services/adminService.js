import axios from "axios";
import BASE_URL from "./base_api";

export const fetchAdminStats = async () => {
  const response = await axios.get(`${BASE_URL}/api/admin/stats`, {
    withCredentials: true,
  });
  return response.data;
};

export const deleteEventAsAdmin = async (eventId) => {
  const response = await axios.delete(
    `${BASE_URL}/api/events/admin/delete/${eventId}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};