
import React, { useEffect, useState } from "react";
import eventService from "../services/eventService";
import categoryService from "../services/categoryService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    capacity: "",
    category: "",
  });

  const [categories, setCategories] = useState([]);
  const [categoryMode, setCategoryMode] = useState("existing");
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch existing categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to load categories:", error);
        toast.error("Failed to load existing categories");
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Switch between existing and new category
  const handleCategoryModeChange = (e) => {
    const mode = e.target.value;

    setCategoryMode(mode);

    setEventData((prevData) => ({
      ...prevData,
      category: "",
    }));
  };

  // Submit event
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!eventData.category.trim()) {
      toast.error("Please select or enter a category");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...eventData,
        title: eventData.title.trim(),
        description: eventData.description.trim(),
        location: eventData.location.trim(),
        category: eventData.category.trim(),
        capacity: Number(eventData.capacity),
      };

      await eventService.createEvent(payload);

      toast.success("Event created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Create event error:", error);
      console.error("Response:", error.response?.data);

      const responseData = error.response?.data;

      const errorMessage =
        typeof responseData === "string"
          ? responseData
          : responseData?.message ||
            responseData?.error ||
            "Failed to create event. Please try again.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-700 placeholder-gray-400 bg-gray-50/50 hover:bg-white hover:border-gray-300";

  const labelClass =
    "block text-sm font-semibold text-gray-700 mb-2 tracking-wide";

  return (
    <div className="max-w-2xl mx-auto p-10 bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl mt-10 border border-white/20 relative overflow-hidden">

      {/* Decorative background elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 blur-xl"></div>

      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-10 blur-xl"></div>

      <div className="relative z-10">

        {/* Page heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Create New Event
          </h2>

          <p className="text-gray-600">
            Bring people together with an amazing experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Event title */}
          <div>
            <label htmlFor="title" className={labelClass}>
              Event Title
            </label>

            <input
              id="title"
              type="text"
              name="title"
              placeholder="Give your event a compelling name"
              value={eventData.title}
              onChange={handleChange}
              className={inputClass}
              required
              maxLength={150}
              disabled={loading}
            />
          </div>

          {/* Event description */}
          <div>
            <label htmlFor="description" className={labelClass}>
              Event Description
            </label>

            <textarea
              id="description"
              name="description"
              placeholder="Describe what makes your event special and what attendees can expect"
              value={eventData.description}
              onChange={handleChange}
              className={`${inputClass} min-h-[120px] resize-y`}
              required
              maxLength={5000}
              disabled={loading}
            />
          </div>

          {/* Location and date */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label htmlFor="location" className={labelClass}>
                Location
              </label>

              <input
                id="location"
                type="text"
                name="location"
                placeholder="Where will it happen?"
                value={eventData.location}
                onChange={handleChange}
                className={inputClass}
                required
                maxLength={255}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="date" className={labelClass}>
                Date &amp; Time
              </label>

              <input
                id="date"
                type="datetime-local"
                name="date"
                value={eventData.date}
                onChange={handleChange}
                className={inputClass}
                required
                disabled={loading}
              />
            </div>

          </div>

          {/* Capacity and category */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Capacity */}
            <div>
              <label htmlFor="capacity" className={labelClass}>
                Capacity
              </label>

              <input
                id="capacity"
                type="number"
                name="capacity"
                placeholder="Max attendees"
                value={eventData.capacity}
                onChange={handleChange}
                className={inputClass}
                required
                min="1"
                step="1"
                disabled={loading}
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="categoryMode" className={labelClass}>
                Category
              </label>

              <select
                id="categoryMode"
                value={categoryMode}
                onChange={handleCategoryModeChange}
                className={`${inputClass} mb-3`}
                disabled={loading}
              >
                <option value="existing">
                  Select Existing Category
                </option>

                <option value="new">
                  Create New Category
                </option>
              </select>

              {categoryMode === "existing" ? (
                <>
                  <select
                    id="category"
                    name="category"
                    value={eventData.category}
                    onChange={handleChange}
                    className={inputClass}
                    required
                    disabled={loading || categoriesLoading}
                  >
                    <option value="">
                      {categoriesLoading
                        ? "Loading categories..."
                        : "Choose a category"}
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.name}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {!categoriesLoading &&
                    categories.length === 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        No categories found. Select "Create New Category".
                      </p>
                    )}
                </>
              ) : (
                <input
                  id="category"
                  type="text"
                  name="category"
                  placeholder="Enter category (e.g. Art)"
                  value={eventData.category}
                  onChange={handleChange}
                  className={inputClass}
                  required
                  maxLength={100}
                  disabled={loading}
                />
              )}

              <p className="text-xs text-gray-500 mt-2">
                {categoryMode === "existing"
                  ? "Choose a category from the existing list."
                  : "Enter a category name. Existing names will be reused."}
              </p>
            </div>

          </div>

          {/* Submit button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || (categoriesLoading && categoryMode === "existing")}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:translate-y-[-1px] hover:shadow-xl shadow-lg active:translate-y-0"
            >
              <span className="flex items-center justify-center">
                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Creating Event...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Create Event
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Your event will be published immediately and visible to all users.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
