package com.farmify.farm_machinery.controller;

import com.farmify.farm_machinery.model.Booking;
import com.farmify.farm_machinery.model.BookingStatus;
import com.farmify.farm_machinery.model.User;
import com.farmify.farm_machinery.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.sql.Date;

import java.util.List;

@RestController
@RequestMapping("/api/booking")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Customer creates a booking request
    @PostMapping("/create")
    public ResponseEntity<String> createBooking(
            @RequestParam String customerPhone,
            @RequestParam String machineryType,
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam Date startDate,
            @RequestParam Date endDate,
            @RequestParam Double radius) {
        bookingService.createBookingRequest(
                customerPhone, machineryType, latitude, longitude, startDate, endDate, radius);
        return ResponseEntity.ok("Booking request sent to nearby owners.");
    }

    // Owner accepts or rejects the booking
    @PostMapping("/respond")
    public ResponseEntity<String> respondToBooking(
            @RequestParam Long bookingId,
            @RequestParam String ownerPhone,
            @RequestParam boolean accept) {
        bookingService.respondToBooking(bookingId, ownerPhone, accept);
        return ResponseEntity.ok("Response recorded.");
    }
}
