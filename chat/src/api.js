import axios from "axios";

const DEPLOYED_BACKEND_URL = "https://chat-application-jade-nine.vercel.app";
const DEPLOYED_FRONTEND_URL = "https://chat-application-c5en.vercel.app";
const LOCAL_API_BASE_URL = "/api";

const stripTrailingSlash = (url) => url.replace(/\/+$/, "");

const getDefaultBaseURL = () => {
  if (typeof window === "undefined") {
    return LOCAL_API_BASE_URL;
  }

  const currentOrigin = window.location.origin;
  const deployedFrontendOrigin = stripTrailingSlash(DEPLOYED_FRONTEND_URL);
  const isVercelFrontend = window.location.hostname.endsWith(".vercel.app");

  if (currentOrigin === deployedFrontendOrigin || isVercelFrontend) {
    return DEPLOYED_BACKEND_URL;
  }

  return LOCAL_API_BASE_URL;
};

const API_BASE_URL = stripTrailingSlash(import.meta.env.VITE_API_BASE_URL || getDefaultBaseURL());

const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.dispatchEvent(new Event("auth:session-expired"));
    }

    return Promise.reject(error);
  },
);

export default API;
