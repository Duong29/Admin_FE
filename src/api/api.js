import axios from "axios";
export const USER_API = axios.create({
  baseURL: import.meta.env.VITE_USER_API_BASE_URL
});

export const COUNTRY_API = axios.create({
  baseURL: import.meta.env.VITE_COUNTRY_API_BASE_URL
});
