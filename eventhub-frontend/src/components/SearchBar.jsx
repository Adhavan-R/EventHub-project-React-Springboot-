// src/components/SearchBar.jsx
import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ keyword, category, location, startDate, endDate });
  };

  return (
   <form className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg mb-8 flex flex-wrap gap-6 max-w-5xl mx-auto border border-gray-300"
   onSubmit={handleSubmit}>
  <input
    type="text"
    placeholder="Search..."
    value={keyword}
    onChange={(e) => setKeyword(e.target.value)}
    className="border border-gray-300 rounded-xl px-4 py-3 w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
  />
  <input
    type="text"
    placeholder="Category"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="border border-gray-300 rounded-xl px-4 py-3 w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
  />
  <input
    type="text"
    placeholder="Location"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    className="border border-gray-300 rounded-xl px-4 py-3 w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
  />
  <input
    type="datetime-local"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    className="border border-gray-300 rounded-xl px-4 py-3 w-full sm:w-52 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
  />
  <input
    type="datetime-local"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    className="border border-gray-300 rounded-xl px-4 py-3 w-full sm:w-52 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
  />
  <button
    type="submit"
    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-pink-400"
  >
    Search
  </button>
</form>

  );
};

export default SearchBar;
