package com.farmify.backend.dto;

import java.util.List;

import com.farmify.backend.model.MachineryType;

import lombok.Data;

@Data
public class MachinerySearchResultDTO {
    private String farmDescription;
    private List<String> imageUrls;
    private MachineryType type;
    private double rentPerDay;
    private String ownerPhone;
    private double latitude;
    private double longitude;
    private double distance;
    private String remarks;
    private String model;
}
