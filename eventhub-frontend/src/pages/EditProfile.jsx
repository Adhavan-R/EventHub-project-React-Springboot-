// src/pages/EditProfile.jsx
import React, { useState, useEffect } from "react";
import authService from "../services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

const EditProfile = () => {
  const [data, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Optional: Pre-fill existing data from session/localStorage if maintained on frontend
 useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      const data = await getCurrentUser(); // fetch from backend
      setFormData((prev) => ({
        ...prev,
        name: data.name,
        email: data.email,
      }));
    } catch (err) {
      toast.error("Failed to fetch user profile");
    }
  };

  fetchUserProfile();
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

   const handleDeleteUser = async () => {

    try {
       
       const response = await authService.deleteUser();
       toast.success(response.data);
       navigate("/login");
    }
    catch(error){

          console.error("Delete error", error);
          toast.error(error.response?.data || "Failed to delete the event.");
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.updateProfile(data);
      toast.success("Profile updated successfully");

      // Optional: Update localStorage or frontend state
      const updatedUser = {
        name: data.name,
        email: data.email,
        password:data.password,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      navigate("/"); // or /profile
    } catch (error) {
      const msg = error?.response?.data || "Update failed";
      toast.error(msg);
    }
  };

 

  return (
    
     <div className="max-w-md mx-auto mt-10 p-10 border border-white/20 rounded-3xl shadow-2xl bg-white/90 backdrop-blur-sm relative overflow-hidden">
  {/* Decorative background elements */}
  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 blur-xl"></div>
  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full opacity-10 blur-xl"></div>

  <div className="relative z-10">
    <h2 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent select-none">
      Edit Profile
    </h2>

    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={data.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white/80 text-gray-800 placeholder-gray-400 transition-all duration-300 hover:bg-white focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-200"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={data.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white/80 text-gray-800 placeholder-gray-400 transition-all duration-300 hover:bg-white focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-200"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
          New Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="Leave blank to keep current password"
          value={data.password}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white/80 text-gray-800 placeholder-gray-400 transition-all duration-300 hover:bg-white focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-200"
        />
        <p className="text-xs text-gray-500 mt-1 italic">Optional - only fill if you want to change your password</p>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-xl active:translate-y-0 mt-8 select-none"
      >
        <span className="flex items-center justify-center">
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Changes
        </span>
      </button>
    </form>
    
    {/* Delete User Button */}
    <button
      onClick={() => setShowDeleteModal(true)}
      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-xl active:translate-y-0 mt-4 select-none"
    >
      <span className="flex items-center justify-center">
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete User
      </span>
    </button>
    
  </div>

  {/* Delete Confirmation Modal */}
  {showDeleteModal && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20 max-w-md w-full relative overflow-hidden">
        {/* Modal decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-red-400 to-pink-500 rounded-full opacity-10 blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-10 blur-xl"></div>
        
        <div className="relative z-10">
          {/* Warning Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
            Delete Account
          </h3>
          
          <p className="text-gray-700 text-center mb-8 leading-relaxed">
            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
          </p>

          <div className="flex space-x-4">
            {/* Cancel Button */}
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-xl active:translate-y-0 select-none"
            >
              <span className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </span>
            </button>

            {/* Confirm Delete Button */}
            <button
              onClick={handleDeleteUser}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-xl active:translate-y-0 select-none"
            >
              <span className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
</div>

  );
};

export default EditProfile;
