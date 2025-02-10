package com.farmify.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Start time is required")
    @Column(nullable = false)
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    @Column(nullable = false)
    private LocalDateTime endTime;

    @NotNull(message = "Total cost is required")
    @Column(nullable = false)
    private Double totalCost;

    @NotNull(message = "Booking status is required")
    @Column(nullable = false)
    private String status; // e.g., PENDING, CONFIRMED, COMPLETED, CANCELLED

    @NotNull(message = "Machinery is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "machinery_id", nullable = false)
    private Machinery machinery;

    @NotNull(message = "Renter is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "renter_id", nullable = false)
    private User renter;

    @NotNull(message = "Owner is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    // Additional fields (optional)
    private String paymentTransactionId; // For payment integration
    private String notes; // Additional notes from renter or owner

    // Convenience method to calculate total cost
    public void calculateTotalCost(double hourlyRate) {
        long hours = java.time.Duration.between(startTime, endTime).toHours();
        this.totalCost = hourlyRate * hours;
    }
}