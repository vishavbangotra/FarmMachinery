package com.farmify.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "tractors")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Tractor extends Machinery {

    @NotNull(message = "Horsepower is required")
    @Min(value = 20, message = "Horsepower must be at least 20")
    private int horsePower;

    @NotNull(message = "Four-wheel drive status is required")
    private boolean fourWheelDrive;

    @NotNull(message = "Plowing depth is required")
    @Min(value = 0, message = "Plowing depth must be positive")
    private int plowingDepth; // cm

    @NotNull(message = "GPS status is required")
    private boolean hasGPS;
}