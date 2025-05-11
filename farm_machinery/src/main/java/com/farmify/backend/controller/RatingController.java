package com.farmify.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.farmify.backend.model.Rating;
import com.farmify.backend.service.RatingService;
import com.farmify.backend.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private static final Logger logger = LoggerFactory.getLogger(RatingController.class);
    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Rating>> createOrUpdate(@RequestBody Rating rating) {
        logger.info("Creating or updating rating for machineryId={}, userId={}", rating.getMachineryId(), rating.getUserId());
        Rating saved = ratingService.createOrUpdateRating(rating);
        logger.info("Rating saved with id={}", saved.getId());
        return ResponseEntity.status(201).body(new ApiResponse<>(true, "Rating saved successfully", saved));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Rating>> getById(@PathVariable Long id) {
        logger.info("Fetching rating with id={}", id);
        Rating rating = ratingService.getRatingById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Rating fetched successfully", rating));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Rating>>> getAll() {
        logger.info("Fetching all ratings");
        List<Rating> ratings = ratingService.getAllRatings();
        return ResponseEntity.ok(new ApiResponse<>(true, "Ratings fetched successfully", ratings));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        logger.info("Deleting rating with id={}", id);
        ratingService.deleteRating(id);
        logger.info("Rating deleted with id={}", id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Rating deleted", null));
    }

    /** New: endpoint to get average rating for a machinery */
    @GetMapping("/machinery/{machineryId}/average")
    public ResponseEntity<ApiResponse<Double>> getAverageForMachinery(@PathVariable Long machineryId) {
        logger.info("Fetching average rating for machineryId={}", machineryId);
        Double avg = ratingService.getAverageRatingByMachineryId(machineryId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Average rating fetched", avg));
    }
}
