import axios from "axios";
import BASE_URL from "./base_api";

const API_URL = `${BASE_URL}/api`;

const categoryService = {
  getCategories: () => {
    return axios.get(`${API_URL}/categories`);
  },
};

export default categoryService;