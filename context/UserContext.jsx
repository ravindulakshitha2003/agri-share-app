import React, { createContext, useState } from "react";
import apiClient from "../api/Authentication"; // ✅ NO CURLY BRACES around apiClient

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  async function login(username, password) {
    try {
      // Safely ensure apiClient is defined before calling .post
      if (!apiClient) {
        throw new Error("apiClient is not initialized.");
      }

      const response = await apiClient.post('/auth/login', {
        username,
        password,
      });

      const data = response?.data;
      console.log('Login successful:', data);

      if (data?.accesstoken) {
        console.log('JWT received');
      }

      setUser(data?.user || { username });
      return data;
    } catch (error) {
      // Safely access error response properties using optional chaining
      if (error?.response) {
        console.log('Login failed status:', error.response.status);
        console.log('Server message:', error.response?.data);
      } else if (error?.request) {
        console.log('No response received from server. Verify host IP and port.');
      } else {
        console.log('Request setup error:', error?.message);
      }
      throw error;
    }
  }

  async function register(email, password) {}
  async function logout() { setUser(null); }

  return (
    <UserContext.Provider value={{ user, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}