import { apiService } from './api';

class UserService {
  async updateUserProfile(userData) {
    const formData = new FormData();

    if (userData.name != null) {
      formData.append('name', userData.name);
    }

    if (userData.imageUri) {
      const filename = userData.imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename ?? '');
      const mimeType = match ? `image/${match[1]}` : 'image';
      formData.append('file', {
        uri: userData.imageUri,
        name: filename,
        type: mimeType,
      });
    }

    return apiService.putFormData('/api/user/profile', formData);
  }
}

export const userService = new UserService();