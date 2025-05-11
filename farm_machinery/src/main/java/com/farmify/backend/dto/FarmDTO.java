package com.farmify.backend.dto;

import lombok.Data;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.NotBlank;

@Data
public class FarmDTO {
    @NotNull(message = "Owner ID is required")
    private Long ownerId;
    private Long farmId;
    @NotBlank(message = "Description is required")
    private String description;
    @NotNull(message = "Latitude is required")
    private Double latitude;
    @NotNull(message = "Longitude is required")
    private Double longitude;
}
