// src/pages/EditEvent.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import eventService from '../services/eventService';
import { toast } from "react-toastify";

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
    bannerUrl: ""
  });

  useEffect(() => {

    console.log("Editing Event ID:", eventId);

    const fetchEvent = async () => {
      try {
        const res = await eventService.getEventById(eventId);
        const data = res.data;
        setEvent({
          title: data.title,
          description: data.description,
          date: data.date,
          location: data.location,
          capacity: data.capacity,
          bannerUrl: data.bannerUrl
        });
      } catch (err) {
        toast.error("Failed to fetch event details");
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Clone event to avoid modifying state directly
    const eventToUpdate = { ...event };

    // Ensure date string has no seconds: keep only 'yyyy-MM-ddTHH:mm'
    if (eventToUpdate.date) {
      // Trim seconds and beyond (if included)
      eventToUpdate.date = eventToUpdate.date.slice(0, 16);
    }

    console.log("Submitting updated event:", eventToUpdate);

    await eventService.updateEvent(eventId, eventToUpdate);
    toast.success("Event updated successfully");
    navigate(`/events/${eventId}`);
  } catch (err) {
    toast.error(err.response?.data || "Failed to update event");
  }
};


  return (
   <div className="max-w-xl mx-auto p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl mt-8 border border-gray-200">
  <h2 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
    Edit Event
  </h2>
  <form onSubmit={handleSubmit} className="space-y-6">
    <input
      type="text"
      name="title"
      placeholder="Title"
      value={event.title}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
    />
    <textarea
      name="description"
      placeholder="Description"
      value={event.description}
      onChange={handleChange}
      rows={4}
      className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
    />
    <input
      type="datetime-local"
      name="date"
      value={event.date}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
    />
    <input
      type="text"
      name="location"
      placeholder="Location"
      value={event.location}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
    />
    <input
      type="number"
      name="capacity"
      placeholder="Capacity"
      value={event.capacity}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
    />
    <input
      type="text"
      name="bannerUrl"
      placeholder="Banner URL"
      value={event.bannerUrl}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
    />
    <button
      type="submit"
      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-pink-400"
    >
      Update Event
    </button>
  </form>
</div>

  );
};

export default EditEvent;
