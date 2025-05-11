package com.farmify.backend.dto;

import java.util.List;
import com.farmify.backend.model.MachineryStatus;

import lombok.Data;

@Data
public class UpdateMachineryDTO {
    private Integer rentPerDay;
    private String remarks;
    private MachineryStatus status;
    private Integer horsepower;
    private Boolean is4x4;
    private Double workingDepth;
    private Integer bladeCount;
    private List<String> existingImageKeys;
}