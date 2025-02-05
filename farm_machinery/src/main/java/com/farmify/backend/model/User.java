package com.farmify.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Use a generated ID as the primary key

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be less than 100 characters")
    private String name;

    @NotBlank(message = "Phone number is required")
    @Size(max = 15, message = "Phone number must be less than 15 characters")
    @Column(unique = true) // Ensure phone numbers are unique
    private String phone;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude // Avoid circular reference in toString
    @EqualsAndHashCode.Exclude // Avoid circular reference in equals/hashCode
    private List<Machinery> machineryOwned = new ArrayList<>(); // Initialize the list

    // Add a convenience method to add machinery
    public void addMachinery(Machinery machinery) {
        machineryOwned.add(machinery);
        machinery.setOwner(this);
    }

    // Add a convenience method to remove machinery
    public void removeMachinery(Machinery machinery) {
        machineryOwned.remove(machinery);
        machinery.setOwner(null);
    }
}