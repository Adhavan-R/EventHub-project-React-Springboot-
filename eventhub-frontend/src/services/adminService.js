import axios from "axios";

//const BASE_URL = "/api"; // adjust if needed

export const fetchAdminStats = async () => {
  const response = await axios.get(`http://localhost:8080/api/admin/stats`, {
    withCredentials: true,  // ✅ sends the session cookie
  });
  return response.data;
};


export const deleteEventAsAdmin = async (eventId) => {
  const response = await axios.delete(`http://localhost:8080/api/events/admin/delete/${eventId}`, {
    withCredentials: true,
  });
  return response.data;
};
 

