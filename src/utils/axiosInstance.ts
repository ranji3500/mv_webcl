import axios from "axios";
import { LocalStorageKeys } from "../enums/common.enums";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

// Add JWT token to Authorization header
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login if unauthorized
axios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axios;
