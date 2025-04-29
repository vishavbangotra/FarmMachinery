package com.farmify.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Entity
@Table(name = "machinery_image", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "machinery_id", "image_number" })
})
@Data
public class MachineryImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "machinery_id")
    @JsonIgnore
    private Machinery machinery;

    /** S3 key, e.g. "machinery/42/2025-04-24T12-00Z-uuid.png" */
    @Column(nullable = false)
    private String key;

    /**
     * Image slot number: 1 through 5.
     * By convention, `imageNumber == 1` is the “main” image.
     */
    @Column(name = "image_number", nullable = false)
    @Min(1)
    @Max(5)
    private Integer imageNumber;

    // getters + setters...
}
