import axios from "axios";

const BASE_URL = "http://localhost:8080/api/events";

// ✅ RSVP to an event
const rsvpToEvent = (eventId) =>
  axios.post(`${BASE_URL}/rsvp/${eventId}`, {}, { withCredentials: true });

// ✅ Un-RSVP from an event
const unrsvpFromEvent = (eventId) =>
  axios.delete(`${BASE_URL}/unrsvp/${eventId}`, { withCredentials: true });

export const getMyRSVPsAPI = async () => {
  const res = await axios.get("http://localhost:8080/api/events/myrsvps", {
    withCredentials: true,  // 🔥 this is crucial for session-based auth
  });
  return res.data;
};

const checkIfRSVPed = (eventId) =>
  axios
    .get(`http://localhost:8080/api/events/${eventId}/isRSVPed`, {
      withCredentials: true,
    })
    .then((res) => res.data);


export const getRSVPedUsersForEvent = async (eventId) => {
  try {
    const response = await axios.get(`${BASE_URL}/rsvps/${eventId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch RSVPs";
  }
};


const rsvpService = {
  rsvpToEvent,
  unrsvpFromEvent,
  checkIfRSVPed,
};

export default rsvpService;
