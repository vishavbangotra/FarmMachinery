package com.farmify.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.farmify.backend.exception.ResourceNotFoundException;
import com.farmify.backend.model.Rating;
import com.farmify.backend.repository.RatingRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
public class RatingService {
    private final RatingRepository ratingRepository;

    public RatingService(RatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
    }

    /**
     * Create new or update existing rating (one per user+machinery).
     * @param rating Rating entity
     * @return Saved Rating
     */
    public Rating createOrUpdateRating(Rating rating) {
        Optional<Rating> existing = ratingRepository
                .findByUserAndMachinery(rating.getUser(), rating.getMachinery());
        if (existing.isPresent()) {
            Rating r = existing.get();
            r.setRating(rating.getRating());
            log.info("Updated rating for user {} and machinery {}", r.getUser().getId(), r.getMachinery().getId());
            return ratingRepository.save(r);
        }
        Rating saved = ratingRepository.save(rating);
        log.info("Created new rating for user {} and machinery {}", rating.getUser().getId(), rating.getMachinery().getId());
        return saved;
    }

    /**
     * Get a rating by its ID.
     * @param id Rating ID
     * @return Rating
     */
    public Rating getRatingById(Long id) {
        return ratingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found for id " + id));
    }

    /**
     * Get all ratings.
     * @return List of Rating
     */
    public List<Rating> getAllRatings() {
        return ratingRepository.findAll();
    }

    /**
     * Delete a rating by its ID.
     * @param id Rating ID
     */
    public void deleteRating(Long id) {
        if (!ratingRepository.existsById(id)) {
            log.warn("Attempted to delete non-existent rating with id {}", id);
            throw new ResourceNotFoundException("Rating not found for id " + id);
        }
        ratingRepository.deleteById(id);
        log.info("Deleted rating with id {}", id);
    }

    /**
     * Fetch the average rating for a given machinery.
     * @param machineryId Machinery ID
     * @return Average rating (0.0 if none)
     */
    @Transactional(readOnly = true)
    public Double getAverageRatingByMachineryId(Long machineryId) {
        Double avg = ratingRepository.findAverageRatingByMachineryId(machineryId);
        return avg != null ? avg : 0.0;
    }
}
