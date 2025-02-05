package com.farmify.backend.repository;

import com.farmify.backend.model.Machinery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MachineryRepository extends JpaRepository<Machinery, Long> {

    // Find all machinery owned by a specific user
    List<Machinery> findByOwnerId(String ownerId);

    // Find nearby machinery within a specific radius (in meters)
    @Query(value = "SELECT m FROM Machinery m WHERE " +
            "6371000 * acos(cos(radians(:lat)) * cos(radians(m.latitude)) * " +
            "cos(radians(m.longitude) - radians(:lng)) + " +
            "sin(radians(:lat)) * sin(radians(m.latitude))) < :radius")
    List<Machinery> findNearbyMachinery(
            @Param("lat") double latitude,
            @Param("lng") double longitude,
            @Param("radius") double radiusInMeters);

    // Find available machinery
    List<Machinery> findByAvailable(boolean available);
}