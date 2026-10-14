import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authService from "../services/authService";

const ForgotPassword = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {

      setLoading(true);

      await authService.forgotPassword(email);

      toast.success("OTP sent to your email");

      navigate("/verify-otp", {
        state: { email }
      });

    } catch (err) {

      console.error(err);

      toast.error(
        err?.response?.data || "Failed to send OTP"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-10"
      >

        <h2 className="text-3xl font-extrabold text-center mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Forgot Password?
        </h2>

        <p className="text-center text-gray-600 mb-8">
          Enter your registered email and we'll send you an OTP.
        </p>

        <div className="mb-6">

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-200 transition-all duration-300"
          />

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full mt-4 text-sm text-gray-600 hover:text-purple-600"
        >
          Back to Login
        </button>

      </form>

    </div>
  );
};

export default ForgotPassword;