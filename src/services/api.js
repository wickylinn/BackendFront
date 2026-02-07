import axios from "axios";

// В Vite env читается ТОЛЬКО через import.meta.env
// Если не задано — используем прокси "/api"
const baseURL = import.meta.env.VITE_API_URL || "/api";

const API = axios.create({ baseURL });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      // localStorage.removeItem("username");
    }
    return Promise.reject(err);
  }
);

export default API;
