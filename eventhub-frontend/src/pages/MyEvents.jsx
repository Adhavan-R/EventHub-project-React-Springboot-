import React, { useEffect, useState } from "react";
import eventService from "../services/eventService";
import EventCard from "../components/EventCard";
import { toast } from "react-toastify";

const MyEvents = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const events = await eventService.getMyEvents();

        console.log("📦 MyEvents response:", events, Array.isArray(events)); // optional debug
        setMyEvents(Array.isArray(events) ? events : []); // prevent `.map()` crash
      } catch (error) {
        toast.error(error.response?.data || "Failed to fetch your events");
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  return (
   <div className="p-8 max-w-7xl mx-auto">
  <div className="mb-12">
    <div className="flex items-center mb-4">
      <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mr-4">
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
      <div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          My Created Events
        </h2>
        <p className="text-gray-600 text-lg mt-2">Events you've organized and published</p>
      </div>
    </div>
  </div>

  {loading ? (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="inline-flex items-center px-8 py-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          <svg className="animate-spin -ml-1 mr-4 h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg font-semibold text-gray-700">Loading your events...</span>
        </div>
      </div>
    </div>
  ) : myEvents.length === 0 ? (
    <div className="text-center py-20">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 max-w-lg mx-auto relative overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-10 blur-xl"></div>
        
        <div className="relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">No Events Created Yet</h3>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Ready to bring people together? Create your first event and start building amazing experiences for your community.
          </p>
          <a 
            href="/create-event" 
            className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:translate-y-[-1px] hover:shadow-xl shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Create Your First Event
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
              {myEvents.length} Event{myEvents.length !== 1 ? 's' : ''} Created
            </span>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span>Active Events</span>
          </div>
          
          <a 
            href="/create-event"
            className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 transform hover:translate-y-[-1px] hover:shadow-lg text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            New Event
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {myEvents.map((event) => (
          <div key={event.id} className="transform transition-all duration-300 hover:scale-[1.02]">
            <EventCard event={event} />
          </div>
        ))}
      </div>
      
      {/* Quick stats footer */}
      <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Keep creating amazing events! Your community appreciates the experiences you organize.
          </p>
        </div>
      </div>
    </div>
  )}
</div>
  );
};

export default MyEvents;
