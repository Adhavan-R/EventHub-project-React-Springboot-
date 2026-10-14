import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authService from "../services/authService";

const ResetPassword = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const resetToken = sessionStorage.getItem("resetToken");

  // User should not be able to access this page
  // without successfully verifying the OTP
  if (!resetToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">

          <p className="text-gray-600 mb-4">
            Password reset session not found or expired.
          </p>

          <button
            onClick={() => navigate("/forgot-password")}
            className="text-purple-600 font-semibold hover:underline"
          >
            Start Again
          </button>

        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { password, confirmPassword } = formData;

    if (!password || !confirmPassword) {
      toast.error("Please fill in both password fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {

      setLoading(true);

      await authService.resetPassword(
        resetToken,
        password
      );

      // Token should not be usable again
      sessionStorage.removeItem("resetToken");

      toast.success("Password reset successfully!");

      navigate("/login");

    } catch (err) {

      console.error(err);

      toast.error(
        err?.response?.data ||
        "Failed to reset password"
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
          Reset Password
        </h2>

        <p className="text-center text-gray-600 mb-8">
          Enter your new password below.
        </p>

        {/* New Password */}
        <div className="mb-6">

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            New Password
          </label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password"
            autoComplete="new-password"
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-200 transition-all duration-300"
          />

        </div>

        {/* Confirm Password */}
        <div className="mb-8">

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm New Password
          </label>

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            autoComplete="new-password"
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-200 transition-all duration-300"
          />

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Resetting Password..." : "Reset Password"}
        </button>

      </form>

    </div>
  );
};

export default ResetPassword;