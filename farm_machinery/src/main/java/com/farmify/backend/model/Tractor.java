package com.farmify.backend.model;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@EqualsAndHashCode(callSuper = true)
@Data
public class Tractor extends Machinery {
    private Integer horsepower;
    private Boolean is4x4;
}