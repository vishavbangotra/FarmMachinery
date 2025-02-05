package com.farmify.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "harvesters")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Harvester extends Machinery {

    @NotNull(message = "Cutting width is required")
    @Min(value = 2, message = "Minimum 2-meter cutting width")
    private double cuttingWidth; // meters

    @NotNull(message = "Grain tank capacity is required")
    @Min(value = 1000, message = "Minimum 1000kg capacity")
    private double grainTankCapacity; // kg

    @NotNull(message = "Straw chopper specification is required")
    private boolean strawChopper;

    @NotNull(message = "Track type specification is required")
    private boolean crawlerTracks; // vs wheels
}