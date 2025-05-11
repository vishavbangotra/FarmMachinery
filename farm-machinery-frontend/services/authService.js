import { apiService } from './api';
import * as SecureStore from 'expo-secure-store';

class AuthService {
  async sendOtp(phoneNumber) {
    return apiService.post('/auth/send-otp', { phoneNumber });
  }

  async verifyOtp(phoneNumber, otp) {
    const response = await apiService.post('/auth/verify-otp', { phoneNumber, otp });
    if (response.token) {
      await SecureStore.setItemAsync('jwt', response.token);
    }
    return response;
  }

  async logout() {
    await SecureStore.deleteItemAsync('jwt');
  }
}

export const authService = new AuthService();