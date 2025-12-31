// API base URL - Hardcoded for reliability
const API_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Helper function to handle API responses
const handleResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }

    return data;
};

// API Service
const api = {
    // === AUTH ENDPOINTS ===
    auth: {
        login: async (email, password) => {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await handleResponse(response);

            // Store token
            if (data.data.token) {
                localStorage.setItem('authToken', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
            }

            return data;
        },

        register: async (userData) => {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            return handleResponse(response);
        },

        logout: () => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            localStorage.removeItem('isAdminAuthenticated');
        },

        getCurrentUser: async () => {
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            return handleResponse(response);
        }
    },

    // === PROPERTY ENDPOINTS ===
    properties: {
        getAll: async (filters = {}) => {
            const params = new URLSearchParams(filters);
            const response = await fetch(`${API_URL}/properties?${params}`);
            return handleResponse(response);
        },

        getById: async (id) => {
            const response = await fetch(`${API_URL}/properties/${id}`);
            return handleResponse(response);
        },

        create: async (formData) => {
            const response = await fetch(`${API_URL}/properties`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: formData // FormData for multipart/form-data
            });
            return handleResponse(response);
        },

        update: async (id, formData) => {
            const response = await fetch(`${API_URL}/properties/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: formData
            });
            return handleResponse(response);
        },

        delete: async (id) => {
            const response = await fetch(`${API_URL}/properties/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            return handleResponse(response);
        },

        recordInquiry: async (id) => {
            const response = await fetch(`${API_URL}/properties/${id}/inquire`, {
                method: 'POST'
            });
            return handleResponse(response);
        }
    },

    // === LOCATION ENDPOINTS ===
    locations: {
        getAll: async () => {
            const response = await fetch(`${API_URL}/locations`);
            return handleResponse(response);
        },

        getBySlug: async (slug) => {
            const response = await fetch(`${API_URL}/locations/${slug}`);
            return handleResponse(response);
        },

        create: async (locationData) => {
            const response = await fetch(`${API_URL}/locations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify(locationData)
            });
            return handleResponse(response);
        },

        update: async (id, locationData) => {
            const response = await fetch(`${API_URL}/locations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify(locationData)
            });
            return handleResponse(response);
        },

        delete: async (id) => {
            const response = await fetch(`${API_URL}/locations/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            return handleResponse(response);
        }
    },

    // === ANALYTICS ENDPOINTS ===
    analytics: {
        getOverview: async () => {
            const response = await fetch(`${API_URL}/analytics/overview`, {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            return handleResponse(response);
        },

        getPropertyAnalytics: async (id) => {
            const response = await fetch(`${API_URL}/analytics/property/${id}`, {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            return handleResponse(response);
        }
    },

    // === SETTINGS ENDPOINTS ===
    settings: {
        get: async () => {
            const response = await fetch(`${API_URL}/settings`);
            return handleResponse(response);
        },

        update: async (settingsData) => {
            const response = await fetch(`${API_URL}/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify(settingsData)
            });
            return handleResponse(response);
        },

        addPropertyType: async (type) => {
            const response = await fetch(`${API_URL}/settings/property-types`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify({ type })
            });
            return handleResponse(response);
        },

        removePropertyType: async (type) => {
            const response = await fetch(`${API_URL}/settings/property-types/${encodeURIComponent(type)}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            return handleResponse(response);
        },

        addService: async (service) => {
            const response = await fetch(`${API_URL}/settings/services`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify({ service })
            });
            return handleResponse(response);
        },

        removeService: async (service) => {
            const response = await fetch(`${API_URL}/settings/services/${encodeURIComponent(service)}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            return handleResponse(response);
        }
    }
};

export default api;
