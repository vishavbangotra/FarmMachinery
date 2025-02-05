package com.farmify.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "land_levelers")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class LandLeveler extends Machinery {

    @NotNull(message = "Blade width is required")
    @Min(value = 2, message = "Minimum 2-meter blade width")
    private double bladeWidth; // meters

    @NotNull(message = "Hydraulic control specification is required")
    private boolean hydraulicControl;

    @NotNull(message = "Laser guidance specification is required")
    private boolean laserGuided;

    @NotNull(message = "Scraper capacity is required")
    @Min(value = 100, message = "Minimum 100kg capacity")
    private double scraperCapacity; // kg
}