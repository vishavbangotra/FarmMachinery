package com.farmify.backend.dto;

import java.util.List;

import com.farmify.backend.model.MachineryStatus;
import com.farmify.backend.model.MachineryType;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MachineryRequestDTO {
    @NotNull
    private MachineryType type; // Enum: TRACTOR, ROTAVATOR

    @NotNull
    private Long ownerId;

    private String remarks;
    private Long farmId;
    private MachineryStatus status = MachineryStatus.AVAILABLE; // Enum: AVAILABLE, ENGAGED, UNAVAILABLE,

    private List<String> imageUrls;

    // Tractor-specific
    private Integer horsepower;
    private Boolean is4x4;

    // Rotavator-specific
    private Integer size;
}