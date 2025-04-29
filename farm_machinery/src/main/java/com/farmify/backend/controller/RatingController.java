package com.farmify.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.farmify.backend.model.Rating;
import com.farmify.backend.service.RatingService;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public ResponseEntity<Rating> createOrUpdate(@RequestBody Rating rating) {
        Rating saved = ratingService.createOrUpdateRating(rating);
        return ResponseEntity.status(201).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rating> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ratingService.getRatingById(id));
    }

    @GetMapping
    public ResponseEntity<List<Rating>> getAll() {
        return ResponseEntity.ok(ratingService.getAllRatings());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ratingService.deleteRating(id);
        return ResponseEntity.noContent().build();
    }

    /** New: endpoint to get average rating for a machinery */
    @GetMapping("/machinery/{machineryId}/average")
    public ResponseEntity<Double> getAverageForMachinery(@PathVariable Long machineryId) {
        Double avg = ratingService.getAverageRatingByMachineryId(machineryId);
        return ResponseEntity.ok(avg);
    }
}
