package com.farmify.backend.service;

import com.farmify.backend.model.Booking;
import com.farmify.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    // Create a new booking
    public Booking createBooking(Booking booking) {
        // Check for overlapping bookings
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(
                booking.getMachinery().getId(),
                booking.getStartTime(),
                booking.getEndTime());

        if (!overlappingBookings.isEmpty()) {
            throw new RuntimeException("Machinery is already booked for the selected time period");
        }

        // Calculate total cost
        booking.calculateTotalCost(booking.getMachinery().getHourlyRate());

        // Set initial status
        booking.setStatus("PENDING");

        return bookingRepository.save(booking);
    }

    // Find bookings for a renter
    public List<Booking> findBookingsByRenter(Long renterId) {
        return bookingRepository.findByRenterId(renterId);
    }

    // Find bookings for an owner
    public List<Booking> findBookingsByOwner(Long ownerId) {
        return bookingRepository.findByOwnerId(ownerId);
    }

    // Update booking status
    public Booking updateBookingStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    // Delete a booking
    public void deleteBooking(Long bookingId) {
        bookingRepository.deleteById(bookingId);
    }
}