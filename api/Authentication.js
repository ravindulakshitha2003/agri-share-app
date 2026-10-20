import axios from 'axios';
import { Platform } from 'react-native'; // ✅ Make sure Platform is imported here

// Configures base URL depending on environment
const DEV_API_URL =  'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: DEV_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default apiClient;