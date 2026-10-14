import axios from "axios";
import BASE_URL from "./base_api";

const API_URL = `${BASE_URL}/api/events`;

const getAllEvents = () =>
  axios.get(API_URL, {
    withCredentials: true,
  });

const getEventById = (id) =>
  axios.get(`${API_URL}/${id}`, {
    withCredentials: true,
  });

const createEvent = (eventData) =>
  axios.post(`${API_URL}/create`, eventData, {
    withCredentials: true,
  });

const updateEvent = (eventId, updatedData) =>
  axios.put(`${API_URL}/${eventId}/edit`, updatedData, {
    withCredentials: true,
  });

const deleteEvent = (eventId) =>
  axios.delete(`${API_URL}/${eventId}/delete`, {
    withCredentials: true,
  });

const getMyEvents = async () => {
  const res = await axios.get(`${API_URL}/myevents`, {
    withCredentials: true,
  });
  return res.data;
};

const uploadBanner = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    `${API_URL}/upload-banner`,
    formData,
    {
      withCredentials: true,
    }
  );

  return res.data;
};

const updateBanner = async (eventId, bannerUrl) => {
  const res = await axios.put(
    `${API_URL}/${eventId}/banner`,
    { bannerUrl },
    { withCredentials: true }
  );
  return res.data;
};

export const exportRSVPsCSV = async (eventId) => {
  const response = await fetch(
    `${API_URL}/${eventId}/export-rsvps`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to export CSV");
  }

  return response.blob();
};

const eventService = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  uploadBanner,
  updateBanner,
};

export default eventService;