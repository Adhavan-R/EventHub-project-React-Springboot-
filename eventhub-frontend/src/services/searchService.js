// src/services/searchService.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api/events',
  withCredentials: true,
});

export const searchEventsAPI = async (filters) => {
  const params = {};

  if (filters.keyword) params.keyword = filters.keyword;
  if (filters.category) params.category = filters.category;
  if (filters.location) params.location = filters.location;
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;

  const res = await API.get('/search', { params });
  return res.data;
};
