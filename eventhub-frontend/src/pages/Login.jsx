// src/pages/Login.jsx

import React, { useState } from "react";
import authService from '../services/authService';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const { reloadUser } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

      try {
        setLoading(true);
        await authService.login(email, password);

        await reloadUser();
        navigate("/"); 
        toast.success("Login successful!");

      // Optional: Save session info if backend returns it
      // localStorage.setItem("user", JSON.stringify(res.data));

      // Go to home or dashboard
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
 <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
  <form
    onSubmit={handleSubmit}
    className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-10 relative overflow-hidden"
  >
    {/* Decorative background elements */}
    <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 blur-xl"></div>
    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full opacity-10 blur-xl"></div>

    <div className="relative z-10">
      <h2 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent select-none">
        Welcome Back
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-200 transition-all duration-300 text-gray-800 placeholder-gray-400 bg-white/80 hover:bg-white hover:border-pink-400"
          placeholder="Enter your email address"
          autoComplete="username"
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-200 transition-all duration-300 text-gray-800 placeholder-gray-400 bg-white/80 hover:bg-white hover:border-pink-400"
          placeholder="Enter your password"
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            Signing in...
          </span>
        ) : (
          "Sign In"
        )}
      </button>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-purple-600 hover:text-pink-600 font-semibold transition-colors duration-200 hover:underline decoration-2 underline-offset-2"
          >
            Create account
          </a>
        </p>
      </div>
    </div>
  </form>
</div>

  );
};

export default Login;
