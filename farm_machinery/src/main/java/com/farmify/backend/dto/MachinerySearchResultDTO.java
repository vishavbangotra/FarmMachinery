package com.farmify.backend.dto;

import com.farmify.backend.model.MachineryType;

import lombok.Data;

@Data
public class MachinerySearchResultDTO {
    private String farmLocation;
    private String farmDescription;
    private MachineryType type;
    private double rentPerDay;
    private String ownerPhone;
    private double latitude;
    private double longitude;
    private String ownerName;
    private double distance;
    private String vehicleImage;
    private String ownerImage;
    private String remarks;
    private String model;
}
