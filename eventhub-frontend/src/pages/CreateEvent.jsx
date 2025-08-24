import React, { useState } from "react";
import eventService from "../services/eventService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    capacity: "",
    category: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value,
    });
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await eventService.createEvent(eventData);
      toast.success("Event created successfully!");
      navigate("/"); // redirect to homepage
    } catch (error) {
      toast.error(
        error.response?.data || "Failed to create event. Try again."
      );
    }
  };


  return (
   <div className="max-w-2xl mx-auto p-10 bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl mt-10 border border-white/20 relative overflow-hidden">
  {/* Decorative background elements */}
  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 blur-xl"></div>
  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-10 blur-xl"></div>
  
  <div className="relative z-10">
    <div className="text-center mb-10">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
      </div>
      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
        Create New Event
      </h2>
      <p className="text-gray-600">Bring people together with an amazing experience</p>
    </div>

    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
          Event Title
        </label>
        <input
          type="text"
          name="title"
          placeholder="Give your event a compelling name"
          value={eventData.title}
          onChange={handleChange}
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-700 placeholder-gray-400 bg-gray-50/50 hover:bg-white hover:border-gray-300"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
          Event Description
        </label>
        <textarea
          name="description"
          placeholder="Describe what makes your event special and what attendees can expect"
          value={eventData.description}
          onChange={handleChange}
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-700 placeholder-gray-400 bg-gray-50/50 hover:bg-white hover:border-gray-300 min-h-[120px] resize-y"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
            Location
          </label>
          <input
            type="text"
            name="location"
            placeholder="Where will it happen?"
            value={eventData.location}
            onChange={handleChange}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-700 placeholder-gray-400 bg-gray-50/50 hover:bg-white hover:border-gray-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
            Date & Time
          </label>
          <input
            type="datetime-local" 
            name="date"
            value={eventData.date}
            onChange={handleChange}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-700 bg-gray-50/50 hover:bg-white hover:border-gray-300"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
            Capacity
          </label>
          <input
            type="number"
            name="capacity"
            placeholder="Max attendees"
            value={eventData.capacity}
            onChange={handleChange}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-700 placeholder-gray-400 bg-gray-50/50 hover:bg-white hover:border-gray-300"
            required
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
            Category
          </label>
          <input
            type="text"
            name="category"
            placeholder="e.g. Conference, Workshop, Social"
            value={eventData.category}
            onChange={handleChange}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-700 placeholder-gray-400 bg-gray-50/50 hover:bg-white hover:border-gray-300"
            required
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:translate-y-[-1px] hover:shadow-xl shadow-lg active:translate-y-0"
        >
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Create Event
          </span>
        </button>
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          Your event will be published immediately and visible to all users
        </p>
      </div>
    </form>
  </div>
</div>
  );
};

export default CreateEvent;
