import axios from "axios";
import BASE_URL from "./base_api";

const API_URL = `${BASE_URL}/api/events`;

// RSVP to an event
const rsvpToEvent = (eventId) =>
  axios.post(
    `${API_URL}/rsvp/${eventId}`,
    {},
    { withCredentials: true }
  );

// Un-RSVP from an event
const unrsvpFromEvent = (eventId) =>
  axios.delete(`${API_URL}/unrsvp/${eventId}`, {
    withCredentials: true,
  });

// Get the current user's RSVPs
export const getMyRSVPsAPI = async () => {
  const res = await axios.get(`${API_URL}/myrsvps`, {
    withCredentials: true,
  });
  return res.data;
};

// Check whether the user RSVP'd to an event
const checkIfRSVPed = (eventId) =>
  axios
    .get(`${API_URL}/${eventId}/isRSVPed`, {
      withCredentials: true,
    })
    .then((res) => res.data);

// Get users who RSVP'd to an event
export const getRSVPedUsersForEvent = async (eventId) => {
  try {
    const response = await axios.get(
      `${API_URL}/rsvps/${eventId}`,
      { withCredentials: true }
    );
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