import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, signupRequest } from "../services/AuthService.js";

const AuthContext = createContext();

const decodeTokenPayload = (token) => {
  const payload = token.split(".")[1];
  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  return JSON.parse(atob(base64 + padding));
};

const getStoredUser = () => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  if (!token || !username) {
    return null;
  }

  try {
    const payload = decodeTokenPayload(token);

    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      return null;
    }
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    return null;
  }

  return { username };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    const syncStoredUser = () => {
      setUser(getStoredUser());
    };

    window.addEventListener("auth:session-expired", syncStoredUser);
    window.addEventListener("storage", syncStoredUser);

    return () => {
      window.removeEventListener("auth:session-expired", syncStoredUser);
      window.removeEventListener("storage", syncStoredUser);
    };
  }, []);

  const persistSession = (username, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    setUser({ username });
  };

  const login = async (username, password) => {
    const res = await loginRequest(username, password);
    const token = res.data.access_token;
    persistSession(username, token);
    return res;
  };

  const signup = async (username, password) => {
    await signupRequest(username, password);
    return login(username, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
  };

  const isAuthenticated = !!user && !!localStorage.getItem("token");

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
