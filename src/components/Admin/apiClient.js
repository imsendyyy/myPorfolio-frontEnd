import axios from 'axios';
import Cookies from 'js-cookie';
import config from '../config';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: `${config.API_URL}`, // Replace with your API base URL
  timeout: 5000,
});

// Add a request interceptor to attach the token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('authToken'); // Replace 'authToken' with your cookie name
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
