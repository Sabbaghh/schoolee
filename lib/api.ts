import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URI,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const storedCountry = localStorage.getItem('country');
      if (storedCountry) {
        const url = new URL(config.url, config.baseURL);
        url.searchParams.set('country', storedCountry.toUpperCase());
        config.url = url.pathname + url.search;
        console.log('API Request URL:', config.url); // Log the URL with country parameter
      } else {
        console.log('API Request URL (no country):', config.url); // Log when no country is set
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
