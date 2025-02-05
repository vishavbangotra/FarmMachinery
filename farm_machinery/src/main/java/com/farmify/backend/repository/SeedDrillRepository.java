package com.farmify.backend.repository;

import com.farmify.backend.model.SeedDrill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeedDrillRepository extends JpaRepository<SeedDrill, Long> {

    // Find seed drills by number of rows
    List<SeedDrill> findByNumberOfRows(int numberOfRows);

    // Find seed drills with fertilizer attachment
    List<SeedDrill> findByFertilizerAttachment(boolean fertilizerAttachment);

    // Find nearby seed drills within a specific radius (in meters)
    @Query(value = "SELECT s FROM SeedDrill s WHERE " +
            "6371000 * acos(cos(radians(:lat)) * cos(radians(s.latitude)) * " +
            "cos(radians(s.longitude) - radians(:lng)) + " +
            "sin(radians(:lat)) * sin(radians(s.latitude))) < :radius")
    List<SeedDrill> findNearbySeedDrills(
            @Param("lat") double latitude,
            @Param("lng") double longitude,
            @Param("radius") double radiusInMeters);
}