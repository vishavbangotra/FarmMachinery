package com.farmify.backend.repository;

import com.farmify.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

        // Find all bookings for a specific renter
        List<Booking> findByRenterId(Long renterId);

        // Find all bookings for a specific owner
        List<Booking> findByOwnerId(Long ownerId);

        // Find all bookings for a specific machinery
        List<Booking> findByMachineryId(Long machineryId);

        // Find bookings by status
        List<Booking> findByStatus(String status);

        // Find overlapping bookings for a machinery
        @Query("SELECT b FROM Booking b WHERE b.machinery.id = :machineryId AND " +
                        "((b.startTime BETWEEN :startTime AND :endTime) OR " +
                        "(b.endTime BETWEEN :startTime AND :endTime) OR " +
                        "(b.startTime <= :startTime AND b.endTime >= :endTime))")
        List<Booking> findOverlappingBookings(
                        @Param("machineryId") Long machineryId,
                        @Param("startTime") LocalDateTime startTime,
                        @Param("endTime") LocalDateTime endTime);

        // Find bookings within a date range
        List<Booking> findByStartTimeBetween(LocalDateTime startTime, LocalDateTime endTime);

        // Find bookings by renter and status
        List<Booking> findByRenterIdAndStatus(Long renterId, String status);

        // Find bookings by owner and status
        List<Booking> findByOwnerIdAndStatus(Long ownerId, String status);
}