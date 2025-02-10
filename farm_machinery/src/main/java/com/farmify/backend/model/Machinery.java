package com.farmify.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDate;

// Base Machinery Class (Abstract)
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "machinery")
@Data
public abstract class Machinery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be less than 100 characters")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Image URL is required")
    @Column(nullable = false)
    private String imageUrl; // Changed to imageUrl for clarity

    @NotNull(message = "List date is required")
    @PastOrPresent(message = "List date must be in the past or present")
    @Column(nullable = false)
    private LocalDate listDate; // Use modern date type

    @NotNull(message = "Availability status is required")
    @Column(nullable = false)
    private boolean available;

    @NotNull(message = "Hourly rate is required")
    @PositiveOrZero(message = "Hourly rate must be positive or zero")
    @Column(nullable = false)
    private BigDecimal hourlyRate; // Added hourlyRate as a common field

    @NotNull(message = "Owner is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude // Avoid circular reference in toString
    @EqualsAndHashCode.Exclude // Avoid circular reference in equals/hashCode
    private User owner;

    // Add a convenience method to set the owner
    public void setOwner(User owner) {
        this.owner = owner;
        if (owner != null && !owner.getMachineryOwned().contains(this)) {
            owner.getMachineryOwned().add(this);
        }
    }
}