import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import eventService from "../services/eventService";
import rsvpService, { getRSVPedUsersForEvent } from "../services/rsvpService";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";
import RSVPListModal from "../components/RSVPListModal";
import  { deleteEventAsAdmin } from "../services/adminService";

import { useAuth } from "../context/AuthContext";

const EventDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasRSVPed, setHasRSVPed] = useState(false);
  const [sessionUserId, setSessionUserId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [rsvpedUsers, setRsvpedUsers] = useState([]);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  

  const fileInputRef = useRef(null);

  const { user } = useAuth();

  const fetchEvent = useCallback(async () => {
    try {
      const res = await eventService.getEventById(id);
      setEvent(res.data);
    } catch (err) {
      toast.error("Failed to load event.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchSessionUser = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/me", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setSessionUserId(data.id);
      }
    } catch (err) {
      console.error("Failed to fetch session user");
    }
  }, []);

  const checkRSVPStatus = useCallback(async () => {
    try {
      const isRSVPed = await rsvpService.checkIfRSVPed(id);
      setHasRSVPed(isRSVPed);
    } catch (err) {
      console.error("Failed to check RSVP status", err);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
    fetchSessionUser();
    checkRSVPStatus();
  }, [fetchEvent, fetchSessionUser, checkRSVPStatus]);

  const handleRSVP = async () => {
    try {
      await rsvpService.rsvpToEvent(id);
      toast.success("RSVP successful!");
      setHasRSVPed(true);
      setEvent((prev) => ({
        ...prev,
        remainingSlots: prev.remainingSlots - 1,
      }));
    } catch (err) {
      toast.error("RSVP failed.");
    }
  };

  const handleUnRSVP = async () => {
    try {
      await rsvpService.unrsvpFromEvent(id);
      toast.success("RSVP removed.");
      setHasRSVPed(false);
      setEvent((prev) => ({
        ...prev,
        remainingSlots: prev.remainingSlots + 1,
      }));
    } catch (err) {
      toast.error("Un-RSVP failed.");
    }
  };

  const handleViewRSVPs = async () => {
    try {
      const users = await getRSVPedUsersForEvent(id);
      setRsvpedUsers(users);
      setShowRSVPModal(true);
    } catch (error) {
      toast.error("Failed to load RSVPs");
      console.error(error);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-event/${id}`);
  };

  const handleDelete = async () => {

    try {
      if (isAdmin) {
        await deleteEventAsAdmin(id);  // /admin/delete/{eventId}
      } 
      else {
        await eventService.deleteEvent(id);         // /events/{eventId}
      }
      toast.success("Event deleted successfully. Attendees notified.");
      navigate("/");
    } catch (error) {
      console.error("Delete error", error);
      toast.error(error.response?.data || "Failed to delete the event.");
    }
  };

  const handleUploadBanner = async () => {
    const file = fileInputRef.current.files[0]; //  Get the selected file
    if (!file) {
      toast.error("Please select an image first.");
      return;
    }

    try {
      const imageUrl = await eventService.uploadBanner(file);
      await eventService.updateBanner(event.id, imageUrl);
      console.log("DEBUG - Banner URL:", event.bannerUrl);

      toast.success("Banner uploaded!");
      setEvent((prev) => ({ ...prev, bannerUrl: imageUrl }));
    } catch (error) {
      console.error("Banner upload failed", error);
      toast.error("Failed to upload banner.");
    }
  };

  const handleAddToCalendar = () => {
    const calendarUrl = generateGoogleCalendarLink(
      event.title,
      event.description,
      event.location,
      event.date  // ISO format  "2024-02-10T18:00:00"
      
    );
    window.open(calendarUrl, '_blank');
  };

  const generateGoogleCalendarLink = (title, description, location, startDateString) => {
    const start = new Date(startDateString); // convert string to Date object
    const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour

    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]|\.\d{3}/g, '');
    };

    const details = {
      text: title,
      dates: `${formatDate(start)}/${formatDate(end)}`,
      details: description,
      location: location,
    };

    const queryString = new URLSearchParams(details).toString();
    return `https://www.google.com/calendar/render?action=TEMPLATE&${queryString}`;
  };




  if (loading) return <div className="text-center mt-10">Loading event...</div>;
  if (!event) return <div className="text-center mt-10">Event not found.</div>;

  const isCreator = sessionUserId && event?.creatorId === sessionUserId;
  const isAdmin = user?.role === "ADMIN";

  return (
  <div className="max-w-3xl mx-auto mt-10 bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200">
  {event.bannerUrl ? (
    <img
      src={`http://localhost:8080${event.bannerUrl}`}
      alt="Event Banner"
      className="w-full h-72 object-cover rounded-2xl mb-6 shadow-md"
    />
  ) : (
    <div className="w-full h-72 flex items-center justify-center bg-gray-100 rounded-2xl mb-6 text-gray-400 font-semibold shadow-inner">
      No banner uploaded
    </div>
  )}

      <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        {event.title}
      </h2>
    <p className="text-gray-700 mb-6 leading-relaxed text-lg">
      {event.description}
    </p>

    <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-6 mb-6 max-w-md space-y-4 shadow-sm">
      <p className="flex items-center text-gray-700 text-base">
        <span className="mr-2 text-purple-600 text-xl">📅</span>
        <span>
          <span className="font-semibold mr-1">Date:</span> {event.date}
        </span>
      </p>
      <p className="flex items-center text-gray-700 text-base">
        <span className="mr-2 text-purple-600 text-xl">📍</span>
        <span>
          <span className="font-semibold mr-1">Location:</span> {event.location}
        </span>
      </p>
      <p className="flex items-center text-gray-700 text-base">
        <span className="mr-2 text-purple-600 text-xl">🏷️</span>
        <span>
          <span className="font-semibold mr-1">Category:</span> {event.category}
        </span>
      </p>
      <p className="flex items-center text-gray-700 text-base">
        <span className="mr-2 text-purple-600 text-xl">👥</span>
        <span>
          <span className="font-semibold mr-1">Remaining Slots:</span> {event.remainingSlots}
        </span>
      </p>
    </div>

    <p className="text-sm text-gray-500 italic border-l-4 border-purple-500 pl-4 max-w-md select-none">
      Created by: {event?.creatorName}
    </p>


  <div className="mt-8 flex flex-wrap gap-4">
    {hasRSVPed ? (
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl shadow-md transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-400"
        onClick={handleUnRSVP}
      >
        Cancel RSVP
      </button>
    ) : (
      <button
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-5 py-2 rounded-xl shadow-md transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-pink-400"
        onClick={handleRSVP}
      >
        RSVP Now
      </button>
    )}

    {hasRSVPed && (
      <button
        onClick={handleAddToCalendar}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl shadow-md transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        Add to Google Calendar
      </button>
    )}

    {(isCreator || isAdmin) && (
      <div className="flex flex-col gap-4 w-full mt-6">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleEdit}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-xl shadow-md transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            ✏️ Edit Event
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl shadow-md transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            🗑️ Delete Event
          </button>
          <button
            onClick={handleViewRSVPs}
            className="bg-indigo-700 hover:bg-indigo-800 text-white px-5 py-2 rounded-xl shadow-md transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            👥 View RSVPs
          </button>
        </div>

        <div className="flex gap-3 items-center">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="text-sm file:rounded-lg file:px-3 file:py-2 file:bg-gradient-to-r file:from-purple-600 file:to-pink-600 file:text-white file:font-semibold file:border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            onClick={handleUploadBanner}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow-md transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            📤 Upload Banner
          </button>
        </div>
      </div>
    )}
  </div>

  <ConfirmModal
    isOpen={isModalOpen}
    onClose={() => setModalOpen(false)}
    onConfirm={handleDelete}
    title="Delete Event?"
    message="Are you sure you want to delete this event? Attendees will be notified."
  />

  {showRSVPModal && (
    <RSVPListModal
      users={rsvpedUsers}
      onClose={() => setShowRSVPModal(false)}
      eventId={event.id}
      attendees={event.attendees}
      isCreator={isCreator}
      isAdmin={isAdmin}
    />
  )}
</div>

  );
};

export default EventDetails;
