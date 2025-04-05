package com.farmify.backend.service;

import java.util.List;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.farmify.backend.dto.MachineryDTO;
import com.farmify.backend.model.Machinery;
import com.farmify.backend.model.Rotavator;
import com.farmify.backend.model.Tractor;
import com.farmify.backend.model.User;
import com.farmify.backend.repository.FarmRepository;
import com.farmify.backend.repository.MachineryRepository;
import com.farmify.backend.repository.RotavatorRepository;
import com.farmify.backend.repository.TractorRepository;
import com.farmify.backend.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MachineryService {

    private final TractorRepository tractorRepository;
    private final RotavatorRepository rotavatorRepository;
    private final UserRepository userRepository;
    private final MachineryRepository machineryRepository;
    private final FarmRepository farmRepository;

    // Main Functions
    public List<Machinery> getMachineryByDistanceAndType(@Param("type") String type, double lon, double lat, double distance) {
        Class<? extends Machinery> typeClass = getMachineryClass(type);
        return machineryRepository.findWithinDistance(typeClass, lon, lat, distance);
    }
    @Transactional
    public Machinery createMachinery(MachineryDTO dto) {
        User owner = userRepository.findById(dto.getOwnerId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        return switch (dto.getType()) {
            case TRACTOR -> createTractor(dto, owner);
            case ROTAVATOR -> createRotavator(dto, owner);
            // Add other types as needed
        };
    }

    public Machinery getMachineryById(Long id) {
        return machineryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Machinery not found"));
    }

    public Iterable<Machinery> getMachineryByOwnerId(Long ownerId) {
        User user = userRepository.findById(ownerId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return machineryRepository.findByOwner(user);
    }

    // Helper Functions
    private Class<? extends Machinery> getMachineryClass(String type) {
        if (type == null || type.isEmpty())
            return null;
        return switch (type.toLowerCase()) {
            case "tractor" -> Tractor.class;
            case "rotavator" -> Rotavator.class;
            default -> throw new IllegalArgumentException("Invalid machinery type: " + type);
        };
    }

    private Tractor createTractor(MachineryDTO dto, User owner) {
        validateTractor(dto);

        Tractor tractor = new Tractor();
        setCommonFields(tractor, dto, owner);
        tractor.setHorsepower(dto.getHorsepower());
        tractor.setIs4x4(dto.getIs4x4());
        return tractorRepository.save(tractor);
    }

    private Rotavator createRotavator(MachineryDTO dto, User owner) {
        validateRotavator(dto);

        Rotavator rotavator = new Rotavator();
        setCommonFields(rotavator, dto, owner);
        rotavator.setBladeCount(dto.getBladeCount());
        rotavator.setWorkingDepth(dto.getWorkingDepth());
        return rotavatorRepository.save(rotavator);
    }

    private void setCommonFields(Machinery machinery, MachineryDTO dto, User owner) {
        machinery.setOwner(owner);
        machinery.setRemarks(dto.getRemarks());
        machinery.setImageUrl(dto.getImageUrl());
        machinery.setStatus(dto.getStatus());
        machinery.setFarmLocation(farmRepository.findById(dto.getFarmId()).orElseThrow(() -> new EntityNotFoundException("Farm not found")));
    }

    private void validateTractor(MachineryDTO dto) {
        if (dto.getHorsepower() == null || dto.getHorsepower() <= 0) {
            throw new IllegalArgumentException("Invalid horsepower");
        }
        if (dto.getIs4x4() == null) {
            throw new IllegalArgumentException("4x4 specification required");
        }
    }

    private void validateRotavator(MachineryDTO dto) {
        if (dto.getBladeCount() == null || dto.getBladeCount() <= 0) {
            throw new IllegalArgumentException("Invalid blade count");
        }
        if (dto.getWorkingDepth() == null || dto.getWorkingDepth() <= 0) {
            throw new IllegalArgumentException("Invalid working depth");
        }
    }
}