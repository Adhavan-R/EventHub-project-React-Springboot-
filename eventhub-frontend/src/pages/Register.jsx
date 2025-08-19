import React, { useState } from 'react';
import { registerUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await registerUser(formData);
      //alert('Registration successful!');
      navigate('/login'); 
      toast.success('Registration successful!');
      // redirect to login
    } catch (err) {
      setError(err);
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
  <form
    onSubmit={handleSubmit}
    className="w-full max-w-md bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-white/30 relative overflow-hidden"
  >
    {/* Decorative background elements */}
    <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 blur-xl"></div>
    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full opacity-10 blur-xl"></div>

    <div className="relative z-10">
      <h2 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent select-none">
        Create Account
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white/80 text-gray-800 placeholder-gray-400 transition-all duration-300 hover:bg-white focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-200"
        />
      </div>

      <div className="mb-6">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          required
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white/80 text-gray-800 placeholder-gray-400 transition-all duration-300 hover:bg-white focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-200"
        />
      </div>

      <div className="mb-8">
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white/80 text-gray-800 placeholder-gray-400 transition-all duration-300 hover:bg-white focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-200"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-xl active:translate-y-0 select-none"
      >
        Create Account
      </button>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-purple-600 hover:text-pink-600 font-semibold transition-colors duration-200 hover:underline decoration-2 underline-offset-2"
          >
            Sign in here
          </a>
        </p>
      </div>
    </div>
  </form>
</div>

  );
};

export default Register;
