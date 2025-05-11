import { apiService } from './api';

class BookingService {
  async getAllBookings() {
    return apiService.get('/api/bookings');
  }

  async getBookingById(id) {
    return apiService.get(`/api/bookings/${id}`);
  }

  async createBooking(bookingData) {
    return apiService.post('/api/bookings/create', bookingData);
  }

  async updateBookingStatus(id, status) {
    return apiService.put(`/api/bookings/${id}`, { status });
  }

  async deleteBooking(id) {
    return apiService.delete(`/api/bookings/${id}`);
  }

  async getBookingsByMachineryId(machineryId) {
    return apiService.get(`/api/bookings/machinery/${machineryId}`);
  }

  async getBookingsByStatus(status) {
    return apiService.get(`/api/bookings/status/${status}`);
  }

  async getUserBookings() {
    return apiService.get('/api/bookings/user');
  }
}

export const bookingService = new BookingService();