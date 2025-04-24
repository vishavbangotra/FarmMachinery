package com.farmify.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = Rotavator.class, name = "rotavator"),
        @JsonSubTypes.Type(value = Tractor.class, name = "tractor")
})
@Data
public abstract class Machinery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;
    
    private String imageUrl;

    private String modelInfo;
    
    @ManyToOne
    @JoinColumn(name = "farm_id")
    private Farm farmLocation;

    private String remarks;
    
    private MachineryStatus status;

    // Rent per day in rupees
    private Integer rentPerDay;

    @JsonProperty("type")
    public String getType() {
        if (this instanceof Tractor) {
            return "tractor";
        } else if (this instanceof Rotavator) {
            return "rotavator";
        }
        return null; 
    }

}