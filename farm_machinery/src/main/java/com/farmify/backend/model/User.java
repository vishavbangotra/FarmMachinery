package com.farmify.backend.model;

import jakarta.persistence.Entity;
import java.util.List;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class User {
    @Id
    private String phone;
    private String name;

    private Double latitude;
    private Double longitude;

    @OneToMany(mappedBy = "owner")
    private List<Machinery> machineryOwned;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }   

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
