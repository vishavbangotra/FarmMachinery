package com.farmify.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.farmify.backend.model.Rating;
import com.farmify.backend.model.User;
import com.farmify.backend.model.Machinery;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUserAndMachinery(User user, Machinery machinery);

    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.machinery.id = :machineryId")
    Double findAverageRatingByMachineryId(@Param("machineryId") Long machineryId);
}
