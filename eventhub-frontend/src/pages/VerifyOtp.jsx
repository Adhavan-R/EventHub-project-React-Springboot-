import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authService from "../services/authService";

const VerifyOtp = () => {

  const navigate = useNavigate();
  const location = useLocation();

  // Email passed from ForgotPassword page
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // If user directly opens /verify-otp without coming
  // from forgot-password
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Password reset session not found.
          </p>

          <button
            onClick={() => navigate("/forgot-password")}
            className="text-purple-600 font-semibold hover:underline"
          >
            Request a new OTP
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      toast.error("OTP must be 6 digits");
      return;
    }

    try {

      setLoading(true);

      const response = await authService.verifyOtp(
        email,
        otp
      );

      // Store reset token temporarily
      sessionStorage.setItem(
        "resetToken",
        response.data.resetToken
      );

      toast.success("OTP verified successfully");

      navigate("/reset-password");

    } catch (err) {

      console.error(err);

      toast.error(
        err?.response?.data ||
        "Invalid or expired OTP"
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
          Verify OTP
        </h2>

        <p className="text-center text-gray-600 mb-2">
          Enter the OTP sent to
        </p>

        <p className="text-center font-semibold text-gray-800 mb-8">
          {email}
        </p>

        <div className="mb-6">

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            OTP
          </label>

          <input
            type="text"
            inputMode="numeric"
            maxLength="6"
            value={otp}
            onChange={(e) => {
              const value = e.target.value;

              // Allow only numbers
              if (/^\d*$/.test(value)) {
                setOtp(value);
              }
            }}
            placeholder="Enter 6-digit OTP"
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-center text-xl tracking-[0.5em] focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-200 transition-all duration-300"
          />

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="w-full mt-4 text-sm text-gray-600 hover:text-purple-600"
        >
          Request a new OTP
        </button>

      </form>

    </div>
  );
};

export default VerifyOtp;