package com.farmify.backend.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.farmify.backend.dto.FarmDTO;
import com.farmify.backend.exception.ResourceNotFoundException;
import com.farmify.backend.model.Farm;
import com.farmify.backend.repository.FarmRepository;
import com.farmify.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class FarmService {
    private final FarmRepository farmRepository;
    private final UserRepository userRepository;

    /**
     * Creates a new farm from the given DTO.
     * @param farmDTO FarmDTO
     * @return Created Farm
     */
    public Farm createFarm(FarmDTO farmDTO) {
        Farm newFarm = new Farm();
        newFarm.setLatitude(farmDTO.getLatitude());
        newFarm.setLongitude(farmDTO.getLongitude());
        newFarm.setDescription(farmDTO.getDescription());
        newFarm.setOwner(userRepository.findById(farmDTO.getOwnerId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + farmDTO.getOwnerId())));
        Farm saved = farmRepository.save(newFarm);
        log.info("Created new farm with id {} for owner {}", saved.getId(), farmDTO.getOwnerId());
        return saved;
    }

    /**
     * Finds a farm by its ID.
     * @param id Farm ID
     * @return Optional of Farm
     */
    public Optional<Farm> findFarmById(Long id) { 
        return farmRepository.findById(id); 
    }

    /**
     * Gets all farms for a user by user ID.
     * @param id User ID
     * @return Iterable of Farm
     */
    public Iterable<Farm> getFarmsByUserId(Long id){
        return farmRepository.findByOwner(userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id)));
    }

    /**
     * Gets all farms in the system.
     * @return Iterable of Farm
     */
    public Iterable<Farm> getAllFarms() {
        return farmRepository.findAll();
    }

    /**
     * Updates an existing farm with new values from the DTO.
     * @param farmDTO FarmDTO
     * @return Updated Farm
     */
    @Transactional
    public Farm updateFarm(FarmDTO farmDTO) {
        Long id = farmDTO.getFarmId();
        Farm existingFarm = farmRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Farm not found with id: " + id));
        existingFarm.setLatitude(farmDTO.getLatitude());
        existingFarm.setLongitude(farmDTO.getLongitude());
        existingFarm.setDescription(farmDTO.getDescription());
        Farm updated = farmRepository.save(existingFarm);
        log.info("Updated farm with id {}", id);
        return updated;
    }

    /**
     * Deletes a farm by its ID.
     * @param id Farm ID
     */
    public void deleteFarm(Long id) {
        if (!farmRepository.existsById(id)) {
            log.warn("Attempted to delete non-existent farm with id {}", id);
            throw new ResourceNotFoundException("Farm not found with id: " + id);
        }
        farmRepository.deleteById(id);
        log.info("Deleted farm with id {}", id);
    }
}
