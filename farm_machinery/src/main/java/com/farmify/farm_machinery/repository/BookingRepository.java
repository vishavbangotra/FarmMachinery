package com.farmify.farm_machinery.repository;

import com.farmify.farm_machinery.model.Booking;
import com.farmify.farm_machinery.model.User;
import com.farmify.farm_machinery.model.Machinery;
import com.farmify.farm_machinery.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find bookings by customer
    List<Booking> findByCustomer(User customer);

    // Find bookings by owner
    List<Booking> findByOwner(User owner);

    // Find bookings by machine
    List<Booking> findByMachine(Machinery machinery);

    // Find bookings by status
    List<Booking> findByStatus(BookingStatus status);

    // Find bookings between two dates
    List<Booking> findByMachineAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Machinery machine, Date endDate, Date startDate);

    // Find active bookings for a specific machine
    List<Booking> findByMachineAndStatusAndEndDateGreaterThan(
            Machinery machine, BookingStatus status, Date currentDate);
}
