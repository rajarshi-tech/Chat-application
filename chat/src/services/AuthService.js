import API from "../api.js";

export const loginRequest = async (username, password) => {
  return API.post("/login", { username, password });
};

export const signupRequest = async (username, password) => {
  return API.post("/signup", { username, password });
};