package com.farmify.backend.repository;

import com.farmify.backend.model.Rotavator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RotavatorRepository extends JpaRepository<Rotavator, Long> {

    // Find rotavators by tilling width range
    List<Rotavator> findByTillingWidthBetween(double minWidth, double maxWidth);

    // Find rotavators with PTO drive
    List<Rotavator> findByPtoDriven(boolean ptoDriven);

    // Find nearby rotavators within a specific radius (in meters)
    @Query(value = "SELECT r FROM Rotavator r WHERE " +
            "6371000 * acos(cos(radians(:lat)) * cos(radians(r.latitude)) * " +
            "cos(radians(r.longitude) - radians(:lng)) + " +
            "sin(radians(:lat)) * sin(radians(r.latitude))) < :radius")
    List<Rotavator> findNearbyRotavators(
            @Param("lat") double latitude,
            @Param("lng") double longitude,
            @Param("radius") double radiusInMeters);
}