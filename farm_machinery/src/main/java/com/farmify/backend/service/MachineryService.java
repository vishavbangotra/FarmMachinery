package com.farmify.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.farmify.backend.dto.MachineryDTO;
import com.farmify.backend.dto.MachinerySearchResultDTO;
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
    public List<MachinerySearchResultDTO> getAllMachineryByDistanceAndType(@Param("type") String type, double lon,
            double lat, double distance) {
        Class<? extends Machinery> typeClass = getMachineryClass(type);

        List<Machinery> machineryList = machineryRepository.findWithinDistance(typeClass, lon, lat, distance);

        List<MachinerySearchResultDTO> resultList = machineryList.stream()
                .map(m -> {
                    MachinerySearchResultDTO result = new MachinerySearchResultDTO();
                    if (m.getFarmLocation() != null) {
                        result.setDistance(MachineryService.calculateDistance(lat, lon,
                                m.getFarmLocation().getLatitude(), m.getFarmLocation().getLongitude()));
                        result.setFarmDescription(m.getFarmLocation().getDescription());
                        result.setFarmLocation(m.getFarmLocation().toString());
                        result.setLatitude(m.getFarmLocation().getLatitude());
                        result.setLongitude(m.getFarmLocation().getLongitude());
                    }
                    if (m.getOwner() != null) {
                        result.setOwnerImage(m.getOwner().getImageUrl());
                        result.setOwnerName(m.getOwner().getName());
                        result.setOwnerPhone(m.getOwner().getPhoneNumber());
                    }
                    if (m.getRentPerDay() != null) {
                        result.setRentPerDay(m.getRentPerDay());
                    }
                    return result;
                })
                .collect(java.util.stream.Collectors.toList());

        return resultList;
    }

    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371; // Radius of the Earth in kilometers

        // Convert latitude and longitude from degrees to radians
        double lat1Rad = Math.toRadians(lat1);
        double lon1Rad = Math.toRadians(lon1);
        double lat2Rad = Math.toRadians(lat2);
        double lon2Rad = Math.toRadians(lon2);

        // Calculate the differences in coordinates
        double dLat = lat2Rad - lat1Rad;
        double dLon = lon2Rad - lon1Rad;

        // Haversine formula
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        double distance = R * c;
        return distance;
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

    public Iterable<Machinery> getAllMachineryByOwnerId(Long ownerId) {
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
        rotavator.setSize(dto.getSize());
        return rotavatorRepository.save(rotavator);
    }

    private void setCommonFields(Machinery machinery, MachineryDTO dto, User owner) {
        machinery.setOwner(owner);
        machinery.setRemarks(dto.getRemarks());
        machinery.setImageUrl(dto.getImageUrl());
        machinery.setStatus(dto.getStatus());
        machinery.setFarmLocation(farmRepository.findById(dto.getFarmId())
                .orElseThrow(() -> new EntityNotFoundException("Farm not found")));
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
        if (dto.getSize() == null || dto.getSize() <= 0) {
            throw new IllegalArgumentException("Invalid blade count");
        }
    }
}