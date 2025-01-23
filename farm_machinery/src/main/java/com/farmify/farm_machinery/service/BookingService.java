package com.farmify.farm_machinery.service;

import com.farmify.farm_machinery.repository.BookingRepository;
import com.farmify.farm_machinery.model.Booking;
import com.farmify.farm_machinery.model.Machinery;
import com.farmify.farm_machinery.model.User;
import java.sql.Date;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public List<Booking> getBookingsForCustomer(User customer) {
        return bookingRepository.findByCustomer(customer);
    }

    public List<Booking> getBookingsForOwner(User owner) {
        return bookingRepository.findByOwner(owner);
    }

    public boolean isMachineAvailable(Machinery machine, Date startDate, Date endDate) {
        List<Booking> overlappingBookings = bookingRepository
                .findByMachineAndStartDateLessThanEqualAndEndDateGreaterThanEqual(machine, endDate, startDate);
        return overlappingBookings.isEmpty();
    }

    public Booking createBooking(Booking booking) {
        // Business logic to create a booking
        return bookingRepository.save(booking);
    }
}
