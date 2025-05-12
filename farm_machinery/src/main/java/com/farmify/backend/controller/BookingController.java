package com.farmify.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.farmify.backend.dto.ApiResponse;
import com.farmify.backend.dto.BookingOwnerDTO;
import com.farmify.backend.dto.BookingRequest;
import com.farmify.backend.dto.BookingStatusDTO;
import com.farmify.backend.model.Booking;
import com.farmify.backend.model.BookingStatus;
import com.farmify.backend.service.BookingService;
import com.farmify.backend.service.JwtService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;

/**
 * Controller for managing bookings, including creation, update, deletion, and queries.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bookings")
public class BookingController {

    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);
    private final BookingService bookingService;
    private final JwtService jwtService;

    /**
     * Creates a new booking for the authenticated user.
     */
    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Booking>> createBooking(@Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.info("Creating booking for machineryId={}", request.getMachineryId());
        Long requesterId = jwtService.extractUserIdFromPrincipal(userDetails);
        Booking booking = bookingService.createBooking(request, requesterId);
        logger.info("Booking created with id={}", booking.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Booking created successfully", booking));
    }

    /**
     * Fetches a booking by its ID.
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Booking>> getBookingById(@PathVariable Long id) {
        logger.info("Fetching booking with id={}", id);
        Booking booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Booking fetched successfully", booking));
    }

    /**
     * Fetches all bookings for the authenticated owner.
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<BookingOwnerDTO>>> getAllBookingsByOwner(
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.info("Fetching all bookings for owner");
        Long ownerId = jwtService.extractUserIdFromPrincipal(userDetails);
        List<BookingOwnerDTO> bookings = bookingService.getAllBookingsByOwner(ownerId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Bookings fetched successfully", bookings));
    }

    /**
     * Updates the status of a booking.
     */
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> updateBooking(@Valid @RequestBody BookingStatusDTO dto, @PathVariable Long id) {
        logger.info("Updating booking status for id={}", id);
        bookingService.updateBookingStatus(id, dto.getStatus());
        return ResponseEntity.ok(new ApiResponse<>(true, "Booking status updated", null));
    }

    /**
     * Deletes a booking by its ID.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteBooking(@PathVariable Long id) {
        logger.info("Deleting booking with id={}", id);
        bookingService.deleteBooking(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Booking deleted", null));
    }

    /**
     * Fetches bookings by requester ID.
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByRequesterId(@PathVariable Long userId) {
        logger.info("Fetching bookings for requesterId={}", userId);
        List<Booking> bookings = bookingService.getBookingsByRequesterId(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Bookings fetched successfully", bookings));
    }

    /**
     * Fetches bookings by machinery ID.
     */
    @GetMapping("/machinery/{machineryId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByMachineryId(@PathVariable Long machineryId) {
        logger.info("Fetching bookings for machineryId={}", machineryId);
        List<Booking> bookings = bookingService.getBookingsByMachineryId(machineryId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Bookings fetched successfully", bookings));
    }

    /**
     * Fetches bookings by status.
     */
    @GetMapping("/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByStatus(@RequestParam BookingStatus status) {
        logger.info("Fetching bookings with status={}", status);
        List<Booking> bookings = bookingService.getBookingsByStatus(status);
        return ResponseEntity.ok(new ApiResponse<>(true, "Bookings fetched successfully", bookings));
    }

    /**
     * Fetches bookings within a date range.
     */
    @GetMapping("/date-range")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByDateRange(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end) {
        logger.info("Fetching bookings from {} to {}", start, end);
        List<Booking> bookings = bookingService.getBookingsByDateRange(start, end);
        return ResponseEntity.ok(new ApiResponse<>(true, "Bookings fetched successfully", bookings));
    }
}