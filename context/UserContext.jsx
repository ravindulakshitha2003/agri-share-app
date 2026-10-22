import React, { createContext, useState } from "react";
import { apiClient } from "../api/Authentication";
import { saveToken } from "../services/tokenStorage";
import { useRoute } from "expo-router";

export const UserContext = createContext();


export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  async function login(username, password) {
    try {
      if (!apiClient) {
        throw new Error("apiClient is not initialized.");
      }

      const response = await apiClient.post('/auth/login', {
        username,
        password,
      });

      const token = response.data?.accesstoken;

      if (token!= null) {
        console.log('JWT received');
        await saveToken(token);
         // ✅ Added await
      } else {
        console.log("incorrect")
      }

      setUser(response.data?.user || { username });
      return response.data;
    } catch (error) {
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

  async function register(userData) {
    try {
      const payload = {
        username: userData.username.trim(),
        password: userData.password,
        province: userData.province.trim(),
        whatsapp_number: userData.whatsapp_number.trim(),
        age: Number(userData.age),
        role: userData.role || 'USER',
      };

      // ✅ Fixed double slash in endpoint path: '/auth/register'
      const response = await apiClient.post('/auth/register', payload);

      const token = response.data?.accesstoken;

      if (token != null) {
        console.log(token)
        await saveToken(token); // ✅ Added await

      } else {
        console.log("null")
      }

      setUser({ username: payload.username });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Registration failed';

      throw new Error(message);
    }
  }

  async function logout() { 
    setUser(null); 
  }

  return (
    <UserContext.Provider value={{ user, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}