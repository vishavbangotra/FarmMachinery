package com.farmify.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "seed_drills")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class SeedDrill extends Machinery {

    @NotNull(message = "Number of rows is required")
    @Min(value = 4, message = "Minimum 4 rows")
    private int numberOfRows;

    @NotNull(message = "Seed hopper capacity is required")
    @Min(value = 50, message = "Minimum 50kg capacity")
    private double seedHopperCapacity; // kg

    @NotNull(message = "Row spacing is required")
    @Min(value = 15, message = "Minimum 15cm spacing")
    private double rowSpacing; // cm

    @NotNull(message = "Fertilizer attachment specification is required")
    private boolean fertilizerAttachment;
}