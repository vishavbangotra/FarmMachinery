package com.farmify.backend.service;

import java.sql.Date;
import java.util.List;
import org.springframework.stereotype.Service;

import com.farmify.backend.model.Booking;
import com.farmify.backend.model.BookingStatus;
import com.farmify.backend.model.Machinery;
import com.farmify.backend.model.User;
import com.farmify.backend.repository.BookingRepository;
import com.farmify.backend.repository.UserRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    public void createBookingRequest(String customerPhone, String machineryType, Double latitude,
            Double longitude, Date startDate, Date endDate, Double radius) {
        User customer = userRepository.findByPhone(customerPhone);
        if (customer == null) {
            throw new RuntimeException("Customer not found");
        }

        // Find nearby owners
        List<User> nearbyOwners = userRepository.findNearbyOwners(machineryType, latitude, longitude, radius);

        // Create booking
        Booking booking = new Booking();
        booking.setCustomer(customer);

        // booking.setMachine(machineryType);
        booking.setStartDate(startDate);
        booking.setEndDate(endDate);
        booking.setRequestedOwners(nearbyOwners);
        booking.setStatus(BookingStatus.PENDING);

        bookingRepository.save(booking);

        // Notify owners
        nearbyOwners.forEach(owner -> sendNotification(owner, booking));
    }

    public void respondToBooking(Long bookingId, String ownerPhone, boolean accept) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        User owner = userRepository.findByPhone(ownerPhone);
        if (!booking.getRequestedOwners().contains(owner)) {
            throw new RuntimeException("Owner not eligible to respond");
        }

        if (accept) {
            booking.setOwner(owner);
            booking.setStatus(BookingStatus.CONFIRMED);
        } else {
            booking.getRequestedOwners().remove(owner);
            if (booking.getRequestedOwners().isEmpty()) {
                booking.setStatus(BookingStatus.CANCELLED);
            }
        }

        bookingRepository.save(booking);
        sendResponseNotification(owner, booking, accept);
    }

    private void sendNotification(User owner, Booking booking) {
        // Logic to notify the owner
    }

    private void sendResponseNotification(User owner, Booking booking, boolean accept) {
        // Logic to notify the customer about the owner's response
    }
}
