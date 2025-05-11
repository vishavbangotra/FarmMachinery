package com.farmify.backend.dto;

import java.util.List;
import com.farmify.backend.model.MachineryStatus;

import lombok.Data;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;

@Data
public class UpdateMachineryDTO {
    @Positive(message = "Rent per day must be positive")
    private Integer rentPerDay;
    private String remarks;
    private MachineryStatus status;
    @Positive(message = "Horsepower must be positive")
    private Integer horsepower;
    private Boolean is4x4;
    @Positive(message = "Working depth must be positive")
    private Double workingDepth;
    @Positive(message = "Blade count must be positive")
    private Integer bladeCount;
    @Size(max = 10, message = "Maximum 10 images allowed")
    private List<String> existingImageKeys;
}