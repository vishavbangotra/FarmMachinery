import * as SecureStore from 'expo-secure-store';

export const API_BASE_URL = 'http://10.0.2.2:8080';

export class ApiError extends Error {
  constructor(status, message, data = null) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export const getAuthHeaders = async () => {
  const token = await SecureStore.getItemAsync('jwt');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

export const handleApiResponse = async (response) => {
  const data = await response.json();
  
  if (!data.success) {
    throw new ApiError(
      response.status,
      data.message || 'An error occurred',
      data.data
    );
  }
  
  return data.data;
};