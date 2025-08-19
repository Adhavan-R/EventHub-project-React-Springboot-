import React, { useEffect, useState } from "react";
import { getMyRSVPsAPI } from "../services/rsvpService";
import EventCard from "../components/EventCard";

const MyRSVPs = () => {
  const [rsvpEvents, setRsvpEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRSVPs = async () => {
      try {
        const data = await getMyRSVPsAPI();
        setRsvpEvents(data);
      } catch (error) {
        console.error("Failed to fetch RSVP events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRSVPs();
  }, []);

  return (
  <div className="max-w-7xl mx-auto px-8 py-12">
  <div className="mb-12">
    <div className="flex items-center mb-4">
      <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl mr-4 shadow-lg">
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      </div>
      <div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent select-none">
          My RSVP'd Events
        </h1>
        <p className="text-gray-600 text-lg mt-2">
          Events you've confirmed attendance for
        </p>
      </div>
    </div>
  </div>

  {loading ? (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="inline-flex items-center px-8 py-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          <svg
            className="animate-spin -ml-1 mr-4 h-8 w-8 text-pink-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-lg font-semibold text-gray-700">Loading your events...</span>
        </div>
      </div>
    </div>
  ) : rsvpEvents.length === 0 ? (
    <div className="text-center py-20">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 max-w-lg mx-auto relative overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-purple-300 to-indigo-500 rounded-full opacity-10 blur-xl"></div>

        <div className="relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4l6 6m0-6l-6 6"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">No Events Found</h3>
          <p className="text-gray-600 text-lg mb-8">
            You haven't RSVP'd to any events yet. Start exploring and join some exciting events!
          </p>
          <a
            href="/"
            className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl shadow-lg"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            Browse Events
          </a>
        </div>
      </div>
    </div>
  ) : (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 rounded-xl">
            <span className="text-purple-800 font-semibold text-lg">
              {rsvpEvents.length} Event{rsvpEvents.length !== 1 ? 's' : ''} Confirmed
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span>Confirmed attendance</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {rsvpEvents.map((event) => (
          <div key={event.id} className="transform transition-all duration-300 hover:scale-[1.02]">
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  )}
</div>


  );
};

export default MyRSVPs;
