package com.farmify.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.farmify.backend.model.Rating;
import com.farmify.backend.service.RatingService;
import com.farmify.backend.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private static final Logger logger = LoggerFactory.getLogger(RatingController.class);
    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Rating>> createOrUpdate(@RequestBody Rating rating, @AuthenticationPrincipal UserDetails userDetails) {
        logger.info("Creating or updating rating for machineryId={}, userId={}", rating.getMachinery().getId(), userDetails.getUsername());
        try {
            Rating saved = ratingService.createOrUpdateRating(rating);
            logger.info("Rating saved with id={}", saved.getId());
            return ResponseEntity.status(201).body(new ApiResponse<>(true, "Rating saved successfully", saved));
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid rating request: {}", e.getMessage());
            return ResponseEntity.status(400).body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Rating>> getById(@PathVariable Long id) {
        logger.info("Fetching rating with id={}", id);
        try {
            Rating rating = ratingService.getRatingById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Rating fetched successfully", rating));
        } catch (IllegalArgumentException e) {
            logger.warn("Rating not found with id={}: {}", id, e.getMessage());
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Rating not found", null));
        }
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<Rating>>> getAll() {
        logger.info("Fetching all ratings");
        List<Rating> ratings = ratingService.getAllRatings();
        return ResponseEntity.ok(new ApiResponse<>(true, "Ratings fetched successfully", ratings));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        logger.info("Deleting rating with id={}", id);
        try {
            ratingService.deleteRating(id);
            logger.info("Rating deleted with id={}", id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Rating deleted", null));
        } catch (IllegalArgumentException e) {
            logger.warn("Rating not found or could not be deleted with id={}: {}", id, e.getMessage());
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Rating not found or could not be deleted", null));
        }
    }

    @GetMapping("/machinery/{machineryId}/average")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<Double>> getAverageForMachinery(@PathVariable Long machineryId) {
        logger.info("Fetching average rating for machineryId={}", machineryId);
        Double avg = ratingService.getAverageRatingByMachineryId(machineryId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Average rating fetched", avg));
    }
}
