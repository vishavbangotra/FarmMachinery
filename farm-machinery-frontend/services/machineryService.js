import { apiService } from './api';

class MachineryService {
  async getAllMachinery() {
    return apiService.get('/api/machinery');
  }

  async getMachineryById(id) {
    return apiService.get(`/api/machinery/${id}`);
  }

  async searchMachinery(type, lon, lat, distance) {
    return apiService.get(`/api/machinery/search?type=${type}&lon=${lon}&lat=${lat}&distance=${distance}`);
  }

  async addMachinery(machineryData, imageUris = [], authToken ) {
    const formData = new FormData();

    // Add machinery data
    Object.keys(machineryData).forEach(key => {
      if (machineryData[key] != null) {
      formData.append(key, String(machineryData[key]));
            }
          });

          // Add files if any
      imageUris.forEach((uri, idx) => {
        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename ?? '');
        const mimeType = match ? `image/${match[1]}` : 'image';
          formData.append('files', {
            uri,
            name: filename,
            type: mimeType,
          });
      });

 return apiService.postFormData('/api/machinery/add', formData, authToken);
  }

  async updateMachinery(id, updateData) {
    return apiService.put(`/api/machinery/update/${id}`, updateData);
  }

  async deleteMachinery(id) {
    return apiService.delete(`/api/machinery/delete/${id}`);
  }
}

export const machineryService = new MachineryService();