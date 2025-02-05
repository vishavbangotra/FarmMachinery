package com.farmify.backend.repository;

import com.farmify.backend.model.Cultivator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CultivatorRepository extends JpaRepository<Cultivator, Long> {

    // Find cultivators by working width range
    List<Cultivator> findByWorkingWidthBetween(double minWidth, double maxWidth);

    // Find cultivators by tine type
    List<Cultivator> findByTineType(String tineType);

    // Find nearby cultivators within a specific radius (in meters)
    @Query(value = "SELECT c FROM Cultivator c WHERE " +
            "6371000 * acos(cos(radians(:lat)) * cos(radians(c.latitude)) * " +
            "cos(radians(c.longitude) - radians(:lng)) + " +
            "sin(radians(:lat)) * sin(radians(c.latitude))) < :radius")
    List<Cultivator> findNearbyCultivators(
            @Param("lat") double latitude,
            @Param("lng") double longitude,
            @Param("radius") double radiusInMeters);
}