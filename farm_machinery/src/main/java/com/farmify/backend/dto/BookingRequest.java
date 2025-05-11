package com.farmify.backend.dto;
import java.time.LocalDate;
import com.farmify.backend.model.BookingStatus;
import javax.validation.constraints.FutureOrPresent;
import javax.validation.constraints.NotNull;

import lombok.Data;

@Data
public class BookingRequest {
    private Long bookingId;

    @NotNull(message = "Requester ID is required")
    private Long requesterId;

    @NotNull(message = "Machinery ID is required")
    private Long machineryId;

    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date must be today or in the future")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    @FutureOrPresent(message = "End date must be today or in the future")
    private LocalDate endDate;

    private BookingStatus status;
}