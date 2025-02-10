package com.farmify.backend.repository;

import com.farmify.backend.model.Harvester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HarvesterRepository extends JpaRepository<Harvester, Long> {

    // Find harvesters by cutting width range
    List<Harvester> findByCuttingWidthBetween(double minWidth, double maxWidth);

    // Find harvesters with straw chopper
    List<Harvester> findByStrawChopper(boolean strawChopper);

    // Find nearby harvesters within a specific radius (in meters)
    @Query(value = "SELECT h FROM Harvester h WHERE " +
            "6371000 * acos(cos(radians(:lat)) * cos(radians(h.latitude)) * " +
            "cos(radians(h.longitude) - radians(:lng)) + " +
            "sin(radians(:lat)) * sin(radians(h.latitude))) < :radius")
    List<Harvester> findNearbyHarvesters(
            @Param("lat") double latitude,
            @Param("lng") double longitude,
            @Param("radius") double radiusInMeters);
}