package com.farmify.backend.model;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@EqualsAndHashCode(callSuper = true)
@Data
public class Rotavator extends Machinery {
    private Double workingDepth;
    private Integer bladeCount;
}