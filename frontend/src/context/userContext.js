import React, { createContext, useState, useContext } from "react";
import axios from "axios";

// Create User Context
const UserContext = createContext();

// Provider for User Context
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/login",
        credentials
      );
      const { user, token } = response.data;
      localStorage.setItem("token", token); // Save token locally
      setUser(user); // Update state
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data.user);
      } catch {
        logout(); // Clear token if fetching user fails
      }
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook for accessing user context
export const useUser = () => useContext(UserContext);
