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

  async addMachinery(machineryData, imageUris = [], authToken) {
    try {
      const formData = new FormData();

      // Add machinery data
      Object.keys(machineryData).forEach(key => {
        if (machineryData[key] != null) {
          formData.append(key, String(machineryData[key]));
        }
      });

      // Validate images before upload
      if (imageUris.length > 5) {
        throw new Error('Maximum 5 images allowed');
      }

      // Add and validate files
      for (const uri of imageUris) {
        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename ?? '');
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        // Create a blob from the URI to check file size
        const response = await fetch(uri);
        const blob = await response.blob();
        if (blob.size > 5 * 1024 * 1024) { // 5MB limit
          throw new Error('Image file size must be less than 5MB');
        }
        
        formData.append('files', {
          uri,
          name: filename,
          type,
        });
      }

      const result = await apiService.postFormData('/api/machinery/add', formData);
      return result.data;
    } catch (error) {
      console.error('Error in addMachinery:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async updateMachinery(id, updateData) {
    try {
      if (updateData.imageUrls) {
        const formData = new FormData();
        
        // Add non-image data
        const { imageUrls, ...otherData } = updateData;
        Object.keys(otherData).forEach(key => {
          if (otherData[key] != null) {
            formData.append(key, String(otherData[key]));
          }
        });

        // Validate images
        if (updateData.imageUrls.length > 5) {
          throw new Error('Maximum 5 images allowed');
        }

        // Add and validate image files
        for (const uri of updateData.imageUrls) {
          if (uri.startsWith('file://') || uri.startsWith('content://')) {
            const filename = uri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename ?? '');
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            // Check file size
            const response = await fetch(uri);
            const blob = await response.blob();
            if (blob.size > 5 * 1024 * 1024) {
              throw new Error('Image file size must be less than 5MB');
            }
            
            formData.append('files', {
              uri,
              name: filename,
              type,
            });
          }
        }

        const result = await apiService.putFormData(`/api/machinery/update/${id}`, formData);
        return result.data;
      }
      
      const result = await apiService.put(`/api/machinery/update/${id}`, updateData);
      return result.data;
    } catch (error) {
      console.error('Error in updateMachinery:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async deleteMachinery(id) {
    return apiService.delete(`/api/machinery/delete/${id}`);
  }
}

export const machineryService = new MachineryService();