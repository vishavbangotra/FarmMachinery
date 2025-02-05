package com.farmify.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "rotavators")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Rotavator extends Machinery {

    @NotNull(message = "Tilling width is required")
    @Min(value = 1, message = "Tilling width must be at least 1 meter")
    private double tillingWidth; // in meters

    @NotNull(message = "Number of blades is required")
    @Min(value = 4, message = "Minimum 4 blades required")
    private int numberOfBlades;

    @NotNull(message = "PTO drive specification is required")
    private boolean ptoDriven; // Power Take-Off driven

    @NotNull(message = "Depth adjustment specification is required")
    private boolean depthAdjustment;
}