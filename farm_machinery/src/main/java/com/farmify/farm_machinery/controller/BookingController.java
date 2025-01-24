package com.farmify.farm_machinery.controller;

import com.farmify.farm_machinery.model.Booking;
import com.farmify.farm_machinery.model.BookingStatus;
import com.farmify.farm_machinery.model.User;
import com.farmify.farm_machinery.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Endpoint to create a new booking
    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        try {
            Booking createdBooking = bookingService.createBooking(booking);
            return new ResponseEntity<>(createdBooking, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // Endpoint to get all bookings
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookingsForOwner(User owner) {
        List<Booking> bookings = bookingService.getBookingsForOwner(owner);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    // Endpoint to get a booking by ID
    // @GetMapping("/{id}")
    // public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
    //     Booking booking = bookingService.getBookingById(id);
    //     if (booking != null) {
    //         return new ResponseEntity<>(booking, HttpStatus.OK);
    //     } else {
    //         return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    //     }
    // }

    // Endpoint to cancel a booking
    // @PutMapping("/{id}/cancel")
    // public ResponseEntity<Booking> cancelBooking(@PathVariable Long id) {
    //     try {
    //         Booking cancelledBooking = bookingService.updateBookingStatus(id, BookingStatus.CANCELLED);
    //         return new ResponseEntity<>(cancelledBooking, HttpStatus.OK);
    //     } catch (Exception e) {
    //         return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    //     }
    // }

    // Endpoint to confirm a booking
    // @PutMapping("/{id}/confirm")
    // public ResponseEntity<Booking> confirmBooking(@PathVariable Long id) {
    //     try {
    //         Booking confirmedBooking = bookingService.updateBookingStatus(id, BookingStatus.CONFIRMED);
    //         return new ResponseEntity<>(confirmedBooking, HttpStatus.OK);
    //     } catch (Exception e) {
    //         return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    //     }
    // }
}