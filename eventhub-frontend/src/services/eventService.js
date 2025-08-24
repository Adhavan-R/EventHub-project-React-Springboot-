import axios from "axios";

const BASE_URL = "http://localhost:8080/api/events";

const getAllEvents = () => axios.get(`${BASE_URL}`);

const getEventById = (id) => axios.get(`${BASE_URL}/${id}`);

const createEvent = (eventData) => axios.post(`${BASE_URL}/create`, eventData, { withCredentials: true });

const updateEvent = (eventId, updatedData) => axios.put(`${BASE_URL}/${eventId}/edit`, updatedData, { withCredentials: true });

const deleteEvent = (eventId) => axios.delete(`${BASE_URL}/${eventId}/delete`, {withCredentials: true,});

const getMyEvents = async () => {
  const res = await axios.get("http://localhost:8080/api/events/myevents", { withCredentials: true });
  return res.data;
};

const uploadBanner = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.post("http://localhost:8080/api/events/upload-banner", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
  return res.data; // image URL
};

const updateBanner = async (eventId, bannerUrl) => {

   const res = await axios.put(
    `http://localhost:8080/api/events/${eventId}/banner`,
    { bannerUrl },
    { withCredentials: true }
  );
  return res.data;
};

export const exportRSVPsCSV = async (eventId) => {
    
  const response = await fetch(`http://localhost:8080/api/events/${eventId}/export-rsvps`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to export CSV');
  }

  const blob = await response.blob();
  return blob;
};





const eventService = {

  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  uploadBanner,
  updateBanner
};

export default eventService;
