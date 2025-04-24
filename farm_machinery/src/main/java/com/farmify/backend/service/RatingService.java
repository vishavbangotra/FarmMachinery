package com.farmify.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.farmify.backend.model.Rating;
import com.farmify.backend.repository.RatingRepository;

@Service
@Transactional
public class RatingService {

    private final RatingRepository ratingRepository;

    public RatingService(RatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
    }

    /** Create new or update existing (one per user+machinery) */
    public Rating createOrUpdateRating(Rating rating) {
        Optional<Rating> existing = ratingRepository
                .findByUserAndMachinery(rating.getUser(), rating.getMachinery());

        if (existing.isPresent()) {
            Rating r = existing.get();
            r.setRating(rating.getRating());
            return ratingRepository.save(r);
        }
        return ratingRepository.save(rating);
    }

    public Rating getRatingById(Long id) {
        return ratingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rating not found for id " + id));
    }

    public List<Rating> getAllRatings() {
        return ratingRepository.findAll();
    }

    public void deleteRating(Long id) {
        if (!ratingRepository.existsById(id)) {
            throw new RuntimeException("Rating not found for id " + id);
        }
        ratingRepository.deleteById(id);
    }

    /** New: fetch the average rating for a given machinery */
    @Transactional(readOnly = true)
    public Double getAverageRatingByMachineryId(Long machineryId) {
        Double avg = ratingRepository.findAverageRatingByMachineryId(machineryId);
        return avg != null ? avg : 0.0;
    }
}
