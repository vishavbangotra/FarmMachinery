package com.farmify.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.farmify.backend.dto.BookingOwnerDTO;
import com.farmify.backend.dto.BookingRequest;
import com.farmify.backend.dto.BookingStatusDTO;
import com.farmify.backend.exception.ResourceNotFoundException;
import com.farmify.backend.model.Booking;
import com.farmify.backend.model.BookingStatus;
import com.farmify.backend.service.BookingService;
import com.farmify.backend.service.JwtService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final JwtService jwtService;

    @PostMapping("/create")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequest request, 
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        
        // Check if Authorization header is valid
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authorizationHeader.substring("Bearer ".length()).trim();
        Long requesterId = jwtService.extractUserId(token);
        Booking booking = bookingService.createBooking(request, requesterId);

        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<BookingOwnerDTO>> getAllBookingsByOwner() {
        List<BookingOwnerDTO> bookings = bookingService.getAllBookingsByOwner((long)1);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Void> updateBooking(@Valid @RequestBody BookingStatusDTO dto, @PathVariable Long id) {
        bookingService.updateBookingStatus(id, dto.getStatus());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<Booking>> getBookingsByRequesterId(@PathVariable Long userId) {
        List<Booking> bookings = bookingService.getBookingsByRequesterId(userId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/machinery/{machineryId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<Booking>> getBookingsByMachineryId(@PathVariable Long machineryId) {
        List<Booking> bookings = bookingService.getBookingsByMachineryId(machineryId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/status")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<Booking>> getBookingsByStatus(@RequestParam BookingStatus status) {
        List<Booking> bookings = bookingService.getBookingsByStatus(status);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/date-range")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<Booking>> getBookingsByDateRange(
            @RequestParam LocalDate start,
            @RequestParam LocalDate end) {
        List<Booking> bookings = bookingService.getBookingsByDateRange(start, end);
        return ResponseEntity.ok(bookings);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFoundException(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}