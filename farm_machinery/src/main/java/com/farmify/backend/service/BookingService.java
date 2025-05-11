package com.farmify.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.farmify.backend.dto.BookingOwnerDTO;
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
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final MachineryRepository machineryRepository;

    /**
     * Create a new booking for a requester and machinery.
     * @param request BookingRequest DTO
     * @param requesterId User ID of requester
     * @return Created Booking
     */
    public Booking createBooking(BookingRequest request, Long requesterId) {
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + requesterId));
        Machinery machinery = machineryRepository.findById(request.getMachineryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Machinery not found with id: " + request.getMachineryId()));
        Booking booking = new Booking();
        booking.setRequester(requester);
        booking.setMachinery(machinery);
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());
        booking.setStatus(BookingStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());
        Booking saved = bookingRepository.save(booking);
        log.info("Created booking {} for requester {} and machinery {}", saved.getId(), requesterId, machinery.getId());
        return saved;
    }

    /**
     * Get a booking by its ID.
     * @param id Booking ID
     * @return Booking
     */
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    /**
     * Get all bookings.
     * @return List of Booking
     */
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    /**
     * Get all bookings for a machinery owner.
     * @param ownerId Owner user ID
     * @return List of BookingOwnerDTO
     */
    public List<BookingOwnerDTO> getAllBookingsByOwner(Long ownerId) {
        try {
            List<BookingOwnerDTO> bookings = bookingRepository.findBookingsByOwnerId(ownerId);
            log.info("Fetched {} bookings for owner {}", bookings != null ? bookings.size() : 0, ownerId);
            return bookings;
        } catch (Exception e) {
            log.error("Error fetching bookings for owner {}: {}", ownerId, e.getMessage(), e);
            return null;
        }
    }

    /**
     * Update the status of a booking.
     * @param id Booking ID
     * @param status New status
     * @return Updated Booking
     */
    public Booking updateBookingStatus(Long id, BookingStatus status ) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        booking.setStatus(status);
        Booking updated = bookingRepository.save(booking);
        log.info("Updated booking {} to status {}", id, status);
        return updated;
    }

    /**
     * Delete a booking by its ID.
     * @param id Booking ID
     */
    public void deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            log.warn("Attempted to delete non-existent booking with id {}", id);
            throw new ResourceNotFoundException("Booking not found with id: " + id);
        }
        bookingRepository.deleteById(id);
        log.info("Deleted booking with id {}", id);
    }

    /**
     * Get all bookings for a requester.
     * @param userId Requester user ID
     * @return List of Booking
     */
    public List<Booking> getBookingsByRequesterId(Long userId) {
        return bookingRepository.findByRequesterId(userId);
    }

    /**
     * Get all bookings for a machinery item.
     * @param machineryId Machinery ID
     * @return List of Booking
     */
    public List<Booking> getBookingsByMachineryId(Long machineryId) {
        return bookingRepository.findByMachineryId(machineryId);
    }

    /**
     * Get all bookings by status.
     * @param status BookingStatus
     * @return List of Booking
     */
    public List<Booking> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }

    /**
     * Get all bookings in a date range.
     * @param start Start date
     * @param end End date
     * @return List of Booking
     */
    public List<Booking> getBookingsByDateRange(LocalDate start, LocalDate end) {
        return bookingRepository.findByStartDateBetween(start, end);
    }
}
