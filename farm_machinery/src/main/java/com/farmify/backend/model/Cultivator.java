package com.farmify.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "cultivators")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Cultivator extends Machinery {

    @NotNull(message = "Working width is required")
    @Min(value = 1, message = "Minimum 1-meter working width")
    private double workingWidth; // meters

    @NotNull(message = "Number of tines is required")
    @Min(value = 9, message = "Minimum 9 tines")
    private int numberOfTines;

    @NotNull(message = "Tine type specification is required")
    private String tineType; // e.g., "Spring-loaded", "Rigid"

    @NotNull(message = "Depth control specification is required")
    private boolean depthControlWheels;
}