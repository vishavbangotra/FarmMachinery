package com.farmify.backend.dto;

import com.farmify.backend.model.BookingStatus;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class BookingStatusDTO {
    @NotEmpty(message = "Status cannot be empty")
    private BookingStatus status;
}