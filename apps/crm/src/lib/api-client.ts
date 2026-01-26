import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  withCredentials: true, // Send HTTPs-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add CSRF token
apiClient.interceptors.request.use((config) => {
  // Get CSRF token from cookie
  const csrfToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  if (csrfToken && config.method !== 'get') {
    config.headers['X-CSRF-Token'] = csrfToken;
  }

  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
