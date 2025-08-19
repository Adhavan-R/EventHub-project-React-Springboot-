import React, { useEffect, useState } from "react";
import { fetchAdminStats } from "../services/adminService";
import { toast } from "react-toastify";
import authService from '../services/authService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [userId, setUserId] = useState("");
  const [adminId, setAdminId] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchAdminStats();
        setStats(data);
      } catch (error) {
        toast.error("Failed to load admin stats");
      }
    };
    loadStats();
  }, []);

  const handleMakeAdmin = async () => {
    if (!userId.trim()) {
      toast.error("Please enter a user ID");
      return;
    }
    try {
      await authService.makeUserAdmin(userId.trim());
      toast.success("User promoted to admin successfully!");
      setUserId(""); // reset input field
    } catch (error) {
      toast.error("Failed to promote user");
    }
  };

  const handleMakeuser = async () => {
    if (!adminId.trim()) {
      toast.error("Please enter a Admin ID");
      return;
    }
    try {
      await authService.makeAdminUser(adminId.trim());
      toast.success("Admin demoted to user successfully!");
      setAdminId(""); // reset input field
    } catch (error) {
      toast.error("Failed to demote admin");
    }
  };

  if (!stats) {
    return (
      <div className="text-center mt-10 text-gray-600">Loading stats...</div>
    );
  }

  return (
   <div className="max-w-6xl mx-auto mt-10 px-6">
  <div className="mb-12">
    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
      Admin Dashboard
    </h1>
    <p className="text-gray-600 text-lg">Manage your platform with comprehensive insights and controls</p>
  </div>

  {/* Enhanced Stat cards */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-2xl text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <span className="text-blue-200 text-sm font-medium">+12% this month</span>
        </div>
        <h2 className="text-lg font-semibold mb-2">Total Users</h2>
        <p className="text-3xl font-bold">{stats.totalUsers}</p>
      </div>
    </div>

    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 rounded-2xl text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
          </div>
          <span className="text-emerald-200 text-sm font-medium">+8% this month</span>
        </div>
        <h2 className="text-lg font-semibold mb-2">Total Events</h2>
        <p className="text-3xl font-bold">{stats.totalEvents}</p>
      </div>
    </div>

    <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-8 rounded-2xl text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <span className="text-orange-200 text-sm font-medium">+25% this month</span>
        </div>
        <h2 className="text-lg font-semibold mb-2">Total RSVPs</h2>
        <p className="text-3xl font-bold">{stats.totalRSVPs}</p>
      </div>
    </div>
  </div>

  {/* Enhanced Top events */}
  <div className="mb-12">
    <div className="flex items-center mb-6">
      <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl mr-4">
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Top 5 Events by RSVPs</h2>
    </div>
    
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <ul className="divide-y divide-gray-100">
        {stats.topEvents.map((event, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-6 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full font-bold text-sm">
                #{index + 1}
              </div>
              <span className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-200">
                {event.title}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 font-medium">{event.rsvpCount} RSVPs</span>
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>

  {/* Enhanced Make Admin Form */}
  <div className="bg-white/80 backdrop-blur-sm mb-8 p-8 rounded-2xl shadow-xl border border-white/20 relative overflow-hidden">
    <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 blur-xl"></div>
    
    <div className="relative z-10">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mr-4">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L9 9l-8 3 8 3 3 8 3-8 8-3-8-3z"/>
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Promote User to Admin</h3>
          <p className="text-gray-600 text-sm">Grant administrative privileges to a user</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-end gap-6">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">User ID</label>
          <input
            type="text"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-700 placeholder-gray-400 bg-gray-50/50 hover:bg-white hover:border-gray-300"
          />
        </div>
        <button
          onClick={handleMakeAdmin}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:translate-y-[-1px] hover:shadow-xl shadow-lg active:translate-y-0 whitespace-nowrap"
        >
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L9 9l-8 3 8 3 3 8 3-8 8-3-8-3z"/>
            </svg>
            Promote to Admin
          </span>
        </button>
      </div>
    </div>
  </div>
  {/* Enhanced Make Admin to User Form */}
  <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 relative overflow-hidden">
    <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 blur-xl"></div>
    
    <div className="relative z-10">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mr-4">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L9 9l-8 3 8 3 3 8 3-8 8-3-8-3z"/>
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Demote Admin to user</h3>
          <p className="text-gray-600 text-sm">Remove administrative privileges to a admin</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-end gap-6">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Admin ID</label>
          <input
            type="text"
            placeholder="Enter Admin ID"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-700 placeholder-gray-400 bg-gray-50/50 hover:bg-white hover:border-gray-300"
          />
        </div>
        <button
          onClick={handleMakeuser}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:translate-y-[-1px] hover:shadow-xl shadow-lg active:translate-y-0 whitespace-nowrap"
        >
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L9 9l-8 3 8 3 3 8 3-8 8-3-8-3z"/>
            </svg>
            Demote to User
          </span>
        </button>
      </div>
    </div>
  </div>
</div>
  );
};

export default AdminDashboard;
