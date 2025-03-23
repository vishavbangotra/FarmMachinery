package com.farmify.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.farmify.backend.model.Machinery;

import java.util.List;

public interface MachineryRepository extends JpaRepository<Machinery, Long> {
        @Query("""
                         SELECT m FROM Machinery m
                         WHERE (:type IS NULL OR TYPE(m) = :type)
                         AND (6371 * ACOS(
                               COS(RADIANS(:lat)) * COS(RADIANS(m.latitude))
                               * COS(RADIANS(m.longitude) - RADIANS(:lon))
                               + SIN(RADIANS(:lat)) * SIN(RADIANS(m.latitude))
                             )) <= :distance
                        """)
        List<Machinery> findWithinDistance(
                        @Param("type") Class<? extends Machinery> type,
                        @Param("lon") double lon,
                        @Param("lat") double lat,
                        @Param("distance") double distance);
        
        @Query("SELECT m FROM Machinery m WHERE TYPE(m) = :type AND m.available = true")
        List<Machinery> findAvailableByType(@Param("type") Class<? extends Machinery> type);
}