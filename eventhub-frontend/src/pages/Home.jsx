// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';
import eventService from '../services/eventService';
import SearchBar from '../components/SearchBar';
import { searchEventsAPI } from '../services/searchService';

const Home = () => {
  const [events, setEvents] = useState([]);

  const handleSearch = async (filters) => {
    const data = await searchEventsAPI(filters);
    setEvents(data);
  };

  useEffect(() => {
    
    const fetchEvents = async () => {
      try {
        
        const response = await eventService.getAllEvents();
        console.log("Fetched events:", response.data);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
  <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
    Upcoming Events
  </h1>

  <div className="mb-8">
    <SearchBar onSearch={handleSearch} />
  </div>

  {events.length === 0 ? (
    <p className="text-center text-gray-600 text-lg py-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 max-w-3xl mx-auto">
      No events found.
    </p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map(event => (
        <div key={event.id} className="transform transition-all duration-300 hover:scale-[1.02]">
          <EventCard event={event} />
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default Home;
