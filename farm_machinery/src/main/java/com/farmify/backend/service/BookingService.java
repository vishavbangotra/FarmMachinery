package com.farmify.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.farmify.backend.dto.BookingRequest;
import com.farmify.backend.exception.ResourceNotFoundException;
import com.farmify.backend.model.Booking;
import com.farmify.backend.model.BookingStatus;
import com.farmify.backend.model.Machinery;
import com.farmify.backend.model.User;
import com.farmify.backend.repository.BookingRepository;
import com.farmify.backend.repository.MachineryRepository;
import com.farmify.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final MachineryRepository machineryRepository;

    public Booking createBooking(BookingRequest request) {
        User user = userRepository.findById(request.getRequesterId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getRequesterId()));
        Machinery machinery = machineryRepository.findById(request.getMachineryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Machinery not found with id: " + request.getMachineryId()));

        Booking booking = new Booking();
        booking.setRequester(user);
        booking.setMachinery(machinery);
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());
        booking.setStatus(BookingStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking updateBooking(BookingRequest request) {
        Long id = request.getBookingId();
        Booking existingBooking = getBookingById(id);
        if (request.getRequesterId() != null) {
            User user = userRepository.findById(request.getRequesterId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getRequesterId()));
            existingBooking.setRequester(user);
        }
        if (request.getMachineryId() != null) {
            Machinery machinery = machineryRepository.findById(request.getMachineryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Machinery not found with id: " + request.getMachineryId()));
            existingBooking.setMachinery(machinery);
        }
        if (request.getStartDate() != null) {
            existingBooking.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            existingBooking.setEndDate(request.getEndDate());
        }
        if (request.getStatus() != null) {
            existingBooking.setStatus(request.getStatus());
        }
        return bookingRepository.save(existingBooking);
    }

    public void deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Booking not found with id: " + id);
        }
        bookingRepository.deleteById(id);
    }

    public List<Booking> getBookingsByRequesterId(Long userId) {
        return bookingRepository.findByRequesterId(userId);
    }

    public List<Booking> getBookingsByMachineryId(Long machineryId) {
        return bookingRepository.findByMachineryId(machineryId);
    }

    public List<Booking> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }

    public List<Booking> getBookingsByDateRange(LocalDate start, LocalDate end) {
        return bookingRepository.findByStartDateBetween(start, end);
    }
}
