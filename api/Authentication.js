
import axios from 'axios';

const DEV_API_URL_AUTH = 'http://192.168.8.159:8080/api/v1';
const DEV_API_URL_PRODUCT = 'http://192.168.8.159:8082/api/v1';

export const apiClient = axios.create({
  baseURL: DEV_API_URL_AUTH,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const apiClientProduct = axios.create({
  baseURL: DEV_API_URL_PRODUCT,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
