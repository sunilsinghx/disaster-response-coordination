// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/api";

const users = [
  { username: "netrunnerX", role: "admin", user_id: "user_1005" },
  { username: "reliefAdmin", role: "contributor", user_id: "user_1002" },
  { username: "fieldAgent", role: "contributor", user_id: "user_1004" },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [selectedDisaster, setSelectedDisaster] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const interceptor = axiosClient.interceptors.request.use((config) => {
      config.headers["x-user"] = JSON.stringify(currentUser);
      return config;
    });

    return () => {
      axiosClient.interceptors.request.eject(interceptor);
    };
  }, [currentUser]);

  const login = (username) => {
    const user = users.find((u) => u.username === username);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    setSelectedDisaster(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        selectedDisaster,
        setSelectedDisaster,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
