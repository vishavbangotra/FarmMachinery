package com.farmify.backend.repository;

import com.farmify.backend.dto.BookingOwnerDTO;
import com.farmify.backend.model.Booking;
import com.farmify.backend.model.Machinery;
import com.farmify.backend.model.User;
import com.farmify.backend.model.BookingStatus;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

        List<Booking> findByRequester(User requester);

        List<Booking> findByStartDateBetween(LocalDate start, LocalDate end);

        Optional<Booking> findById(Long id);

        List<Booking> findByMachinery(Machinery machinery);

        List<Booking> findByRequesterId(Long userId);

        List<Booking> findByMachineryId(Long machineryId);

        List<Booking> findByStatus(BookingStatus status);

        List<Booking> findByRequesterAndStatus(User requester, BookingStatus status);

        @Query("""
                            SELECT new com.farmify.backend.dto.BookingOwnerDTO(
                                b.id,
                                b.machinery.id,
                                b.requester.id,
                                b.status,
                                b.createdAt,
                                b.startDate,
                                b.endDate,
                                m.modelInfo,
                                m.remarks,
                                m.rentPerDay,
                                m.farmLocation.id,
                                m.owner.id,
                                f.description,
                                f.latitude,
                                f.longitude
                            )
                            FROM Booking b
                            JOIN b.machinery m
                            LEFT JOIN m.farmLocation f
                            WHERE m.status = 0 AND m.owner.id = :ownerId
                        """)
        List<BookingOwnerDTO> findBookingsByOwnerId(@Param("ownerId") Long ownerId);

        // Find bookings overlapping with a given period for a specific machinery
        // @Query("SELECT b FROM Booking b WHERE b.machinery = :machinery AND b.start_date < :end AND b.end_date > :start")
        // List<Booking> findOverlappingBookings(
        //                 @Param("machinery") Machinery machinery,
        //                 @Param("start") LocalDate start,
        //                 @Param("end") LocalDate end);
}