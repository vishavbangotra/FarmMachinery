package com.farmify.backend.repository;

import com.farmify.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by phone number
    Optional<User> findByPhone(String phone);

    // Find users by country code
    List<User> findByCountryCode(String countryCode);

    // Find users who own specific machinery
    @Query("SELECT u FROM User u JOIN u.machineryOwned m WHERE m.id = :machineryId")
    Optional<User> findOwnerByMachineryId(@Param("machineryId") Long machineryId);

    // Find nearby users within a specific radius (in meters)
    @Query(value = "SELECT u FROM User u WHERE " +
            "6371000 * acos(cos(radians(:lat)) * cos(radians(u.latitude)) * " +
            "cos(radians(u.longitude) - radians(:lng)) + " +
            "sin(radians(:lat)) * sin(radians(u.latitude))) < :radius")
    List<User> findNearbyUsers(
            @Param("lat") double latitude,
            @Param("lng") double longitude,
            @Param("radius") double radiusInMeters);

    // Find users who own available machinery
    @Query("SELECT DISTINCT u FROM User u JOIN u.machineryOwned m WHERE m.available = true")
    List<User> findUsersWithAvailableMachinery();

    // Find users by name (case-insensitive search)
    List<User> findByNameContainingIgnoreCase(String name);

    // Check if a user exists by phone number
    boolean existsByPhone(String phone);
}