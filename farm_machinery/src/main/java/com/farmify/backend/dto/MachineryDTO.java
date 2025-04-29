package com.farmify.backend.dto;

import java.util.List;
import com.farmify.backend.model.MachineryStatus;
import com.farmify.backend.model.MachineryType;

import lombok.Data;

@Data
public class MachineryDTO {
    Long id;
    List<String> imageUrls;
    MachineryType type;
    double rentPerDay;
    double latitude;
    double longitude;
    String remarks;
    String model;
    MachineryStatus status;
}
