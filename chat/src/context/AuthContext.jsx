import { createContext, useContext, useState } from "react";
import { loginRequest, signupRequest } from "../services/AuthServices";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const username = localStorage.getItem("username");
    return username ? { username } : null;
  });

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

  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
