package com.farmify.backend.repository;

import com.farmify.backend.model.Tractor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TractorRepository extends JpaRepository<Tractor, Long> {

    // Find tractors by horsepower range
    List<Tractor> findByHorsePowerBetween(int minHorsePower, int maxHorsePower);

    // Find tractors with four-wheel drive
    List<Tractor> findByFourWheelDrive(boolean fourWheelDrive);

    // Find nearby tractors within a specific radius (in meters)
    @Query(value = "SELECT t FROM Tractor t WHERE " +
            "6371000 * acos(cos(radians(:lat)) * cos(radians(t.latitude)) * " +
            "cos(radians(t.longitude) - radians(:lng)) + " +
            "sin(radians(:lat)) * sin(radians(t.latitude))) < :radius")
    List<Tractor> findNearbyTractors(
            @Param("lat") double latitude,
            @Param("lng") double longitude,
            @Param("radius") double radiusInMeters);
}