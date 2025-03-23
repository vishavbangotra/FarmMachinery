package com.farmify.backend.dto;

import com.farmify.backend.model.MachineryType;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MachineryDTO {
    @NotNull
    private MachineryType type; // Enum: TRACTOR, ROTAVATOR

    @NotNull
    private Long ownerId;

    private String remarks;
    private double latitude;
    private double longitude;
    private boolean available = true;

    // Tractor-specific
    private Integer horsepower;
    private Boolean is4x4;

    // Rotavator-specific
    private Integer bladeCount;
    private Double workingDepth;
}