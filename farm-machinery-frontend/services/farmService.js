import { apiService } from './api';

class FarmService {
  async getUserFarms() {
    return apiService.get('/api/farms/user');
  }

  async getFarmById(id) {
    return apiService.get(`/api/farms/${id}`);
  }

  async addFarm(farmData) {
    return apiService.post('/api/farms/add', farmData);
  }

  async updateFarm(id, updateData) {
    return apiService.put(`/api/farms/${id}`, updateData);
  }

  async deleteFarm(id) {
    return apiService.delete(`/api/farms/delete/${id}`);
  }
}

export const farmService = new FarmService();