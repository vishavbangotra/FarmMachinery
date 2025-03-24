package com.farmify.backend.dto;
import java.time.LocalDate;
import com.farmify.backend.model.BookingStatus;

import lombok.Data;

@Data
public class BookingRequest {
    private Long bookingId;
    private Long requesterId;
    private Long machineryId;
    private LocalDate startDate;
    private LocalDate endDate;
    private BookingStatus status;
}