package com.farmify.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bookings")
public class BookingController {

    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);
    private final BookingService bookingService;
    private final JwtService jwtService;

    @PostMapping("/create")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<Booking>> createBooking(@Valid @RequestBody BookingRequest request,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        logger.info("Creating booking for machineryId={}, requesterId={}", request.getMachineryId(), request.getRequesterId());
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            logger.warn("Unauthorized booking creation attempt");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Unauthorized", null));
        }
        String token = authorizationHeader.substring("Bearer ".length()).trim();
        Long requesterId = jwtService.extractUserId(token);
        Booking booking = bookingService.createBooking(request, requesterId);
        logger.info("Booking created with id={}", booking.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Booking created successfully", booking));
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<Booking>> getBookingById(@PathVariable Long id) {
        logger.info("Fetching booking with id={}", id);
        Booking booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Booking fetched successfully", booking));
    }

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<List<BookingOwnerDTO>>> getAllBookingsByOwner() {
        logger.info("Fetching all bookings for owner");
        List<BookingOwnerDTO> bookings = bookingService.getAllBookingsByOwner(1L);
        return ResponseEntity.ok(new ApiResponse<>(true, "Bookings fetched successfully", bookings));
    }

    @PutMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<Void>> updateBooking(@Valid @RequestBody BookingStatusDTO dto, @PathVariable Long id) {
        logger.info("Updating booking status for id={} to {}", id, dto.getStatus());
        bookingService.updateBookingStatus(id, dto.getStatus());
        return ResponseEntity.ok(new ApiResponse<>(true, "Booking status updated", null));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<Void>> deleteBooking(@PathVariable Long id) {
        logger.info("Deleting booking with id={}", id);
        bookingService.deleteBooking(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Booking deleted", null));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByRequesterId(@PathVariable Long userId) {
        logger.info("Fetching bookings for requesterId={}", userId);
        List<Booking> bookings = bookingService.getBookingsByRequesterId(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Bookings fetched successfully", bookings));
    }

    @GetMapping("/machinery/{machineryId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByMachineryId(@PathVariable Long machineryId) {
        logger.info("Fetching bookings for machineryId={}", machineryId);
        List<Booking> bookings = bookingService.getBookingsByMachineryId(machineryId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Bookings fetched successfully", bookings));
    }

    @GetMapping("/status")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByStatus(@RequestParam BookingStatus status) {
        logger.info("Fetching bookings with status={}", status);
        List<Booking> bookings = bookingService.getBookingsByStatus(status);
        return ResponseEntity.ok(new ApiResponse<>(true, "Bookings fetched successfully", bookings));
    }

    @GetMapping("/date-range")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByDateRange(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end) {
        logger.info("Fetching bookings from {} to {}", start, end);
        List<Booking> bookings = bookingService.getBookingsByDateRange(start, end);
        return ResponseEntity.ok(new ApiResponse<>(true, "Bookings fetched successfully", bookings));
    }
}