package com.farmify.backend.dto;

import lombok.Data;

@Data
public class FarmDTO {
    private Long ownerId;
    private Long farmId;
    private String description;
    private Double latitude;
    private Double longitude;
}
