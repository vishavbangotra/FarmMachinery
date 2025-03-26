package com.farmify.backend.service;

import org.springframework.stereotype.Service;

import com.farmify.backend.dto.FarmDTO;
import com.farmify.backend.exception.ResourceNotFoundException;
import com.farmify.backend.model.Farm;
import com.farmify.backend.repository.FarmRepository;
import com.farmify.backend.repository.UserRepository;
import com.google.common.base.Optional;

@Service
public class FarmService {
    FarmRepository farmRepository;
    UserRepository userRepository;

    public Farm createFarm(FarmDTO farmDTO) {
        Farm newFarm = new Farm();
        newFarm.setLatitude(farmDTO.getLatitude());
        newFarm.setLongitude(farmDTO.getLongitude());
        newFarm.setDescription(farmDTO.getDescription());
        newFarm.setOwner(userRepository.findById(farmDTO.getOwnerId()).orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + farmDTO.getOwnerId())));
        return farmRepository.save(newFarm);
    }

    public Optional<Farm> findFarmById(Long id) { return farmRepository.findById(id); } // Optional<Farm>

    public Farm updateFarm(FarmDTO farmDTO) {
        Long id = farmDTO.getFarmId();
        Farm existingFarm = farmRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Farm not found with id: " + id));
        existingFarm.setLatitude(farmDTO.getLatitude());
        existingFarm.setLongitude(farmDTO.getLongitude());
        existingFarm.setDescription(farmDTO.getDescription());
        return farmRepository.save(existingFarm);
    }

    public void deleteFarm(Long id) {
        if (!farmRepository.existsById(id)) {
            throw new ResourceNotFoundException("Farm not found with id: " + id);
        }
        farmRepository.deleteById(id);
    }
}
