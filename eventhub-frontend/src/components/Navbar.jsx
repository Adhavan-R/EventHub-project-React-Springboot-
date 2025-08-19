// Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
   <nav className="bg-white/90 backdrop-blur-sm shadow-md sticky top-0 z-50 border-b border-gray-200">
  <div className="container mx-auto px-6 py-4 flex justify-between items-center">
    <Link
      to="/"
      className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent select-none"
    >
      EventHub
    </Link>
    <div className="flex items-center space-x-6 text-gray-700 font-medium">
      <Link
        to="/"
        className="hover:text-purple-600 transition-colors duration-300"
      >
        Home
      </Link>
      <Link
        to="/create-event"
        className="hover:text-purple-600 transition-colors duration-300"
      >
        Create Event
      </Link>
      <Link
        to="/my-events"
        className="hover:text-purple-600 transition-colors duration-300"
      >
        My Events
      </Link>
      <Link
        to="/myrsvps"
        className="hover:underline hover:text-purple-600 transition-colors duration-300"
      >
        My RSVPs
      </Link>

      {user?.role === "ADMIN" && (
        <Link
          to="/admin"
          className="text-red-600 font-semibold hover:text-red-700 transition-colors duration-300"
        >
          Admin Panel
        </Link>
      )}

      <Link
        to="/profile"
        className="hover:underline hover:text-purple-600 transition-colors duration-300"
      >
        Profile
      </Link>
      <Link
        to="/login"
        className="text-purple-600 border border-purple-600 px-4 py-1.5 rounded-xl hover:bg-purple-600 hover:text-white transition-all duration-300 select-none"
      >
        Login
      </Link>
    </div>
  </div>
</nav>

  );
}
