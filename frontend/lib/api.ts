// API configuration for the frontend
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://api.carvane.localhost' 
  : 'http://api.carvane.localhost';

export const api = {
  baseURL: API_BASE_URL,
  
  // Helper function to make API calls
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  // API endpoints
  endpoints: {
    health: '/health',
    restaurants: '/SuperAdmin/restaurants',
    admins: '/SuperAdmin/admins',
    notifications: '/SuperAdmin/notifications',
  },
};

export default api;
