import { API_BASE_URL, getAuthHeaders, handleApiResponse } from './apiConfig';

class ApiService {
  async request(endpoint, options = {}) {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          ...headers,
          ...options.headers,
        },
        ...options,
      });
      
      return handleApiResponse(response);
    } catch (error) {
      if (error.status === 401) {
        // Handle unauthorized access
        // You might want to redirect to login or refresh token
      }
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  async postFormData(endpoint, formData) {
    const headers = await getAuthHeaders();
    // Let the browser set the Content-Type with boundary for multipart/form-data
    delete headers['Content-Type'];
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload');
      }

      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async putFormData(endpoint, formData) {
    const headers = await getAuthHeaders();
    // Let the browser set the Content-Type with boundary for multipart/form-data
    delete headers['Content-Type'];
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update');
      }

      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();