import React, { useEffect, useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const InterestSelection = () => {

  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    const loadCategories = async () => {

      try {

        const response =
          await authService.getCategories();

        setCategories(response.data);

      } catch (err) {

        toast.error("Failed to load categories");
      }
    };

    loadCategories();

  }, []);

  const toggleCategory = (id) => {

    if (selected.includes(id)) {

      setSelected(
        selected.filter(categoryId =>
          categoryId !== id
        )
      );

    } else {

      setSelected([...selected, id]);
    }
  };

  const handleSubmit = async () => {

    if (selected.length < 3) {

      toast.error(
        "Please select at least 3 interests"
      );

      return;
    }

    try {

      await authService.saveInterests(selected);

      toast.success(
        "Interests saved successfully!"
      );

      setTimeout(() => {
        navigate("/");
        }, 1000);

    } catch (err) {

      toast.error(
        "Failed to save interests"
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">

      <h1 className="text-3xl font-bold mb-6">
        Choose Your Interests
      </h1>

      <p className="mb-6 text-gray-600">
        Select at least 3 categories
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        {categories.map(category => (

          <label
            key={category.id}
            className={`
              border rounded-lg p-4 cursor-pointer
              ${
                selected.includes(category.id)
                  ? "bg-purple-100 border-purple-500"
                  : "bg-white"
              }
            `}
          >

            <input
              type="checkbox"
              className="mr-2"
              checked={
                selected.includes(category.id)
              }
              onChange={() =>
                toggleCategory(category.id)
              }
            />

            {category.name}

          </label>
        ))}

      </div>

      <button
        onClick={handleSubmit}
        className="
          mt-8
          px-6
          py-3
          bg-purple-600
          text-white
          rounded-lg
          hover:bg-purple-700
        "
      >
        Save Interests
      </button>

    </div>
  );
};

export default InterestSelection;