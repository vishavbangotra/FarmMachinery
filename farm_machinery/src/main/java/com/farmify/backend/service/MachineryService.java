package com.farmify.backend.service;

import java.io.IOException;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.farmify.backend.dto.MachineryDTO;
import com.farmify.backend.dto.MachineryRequestDTO;
import com.farmify.backend.dto.MachinerySearchResultDTO;
import com.farmify.backend.dto.UpdateMachineryDTO;
import com.farmify.backend.model.Machinery;
import com.farmify.backend.model.MachineryImage;
import com.farmify.backend.model.MachineryStatus;
import com.farmify.backend.model.MachineryType;
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
    private final MachineryImageService machineryImageService;
    private final FarmRepository farmRepository;
    private final S3Service s3Service;

    // Main Functions

    /**
     * Retrieves machinery of a specific type within a given distance from a
     * location.
     */
    public List<MachinerySearchResultDTO> getAllMachineryByDistanceAndType(@Param("type") String type, double lon,
            double lat, double distance) {
        Class<? extends Machinery> typeClass = getMachineryClass(type);

        List<Machinery> machineryList = machineryRepository.findWithinDistance(typeClass, lon, lat, distance);

        return machineryList.stream()
                .map(m -> {
                    MachinerySearchResultDTO result = new MachinerySearchResultDTO();
                    if (m.getFarmLocation() != null) {
                        result.setDistance(calculateDistance(lat, lon,
                                m.getFarmLocation().getLatitude(), m.getFarmLocation().getLongitude()));
                        result.setFarmDescription(m.getFarmLocation().getDescription());
                        result.setLatitude(m.getFarmLocation().getLatitude());
                        result.setLongitude(m.getFarmLocation().getLongitude());
                    }
                    if (m.getOwner() != null) {
                        // result.setOwnerImage(m.getOwner().getImageUrl());
                        // result.setOwnerName(m.getOwner().getName());
                        result.setOwnerPhone(m.getOwner().getPhoneNumber());
                    }
                    if (m.getRentPerDay() != null) {
                        result.setRentPerDay(m.getRentPerDay());
                    }
                    result.setType(m.getType() != null ? MachineryType.valueOf(m.getType().toUpperCase()) : null);
                    result.setModel(m.getModelInfo() != null ? m.getModelInfo() : "");
                    result.setRemarks(m.getRemarks());
                    result.setImageUrls(machineryImageService.listImageUrls(m.getId()));
                    return result;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public Machinery updateMachinery(Long id, UpdateMachineryDTO dto) {
        Machinery machinery = machineryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Machinery not found"));

        System.out.println(dto.toString());

        if (dto.getRentPerDay() != null) {
            machinery.setRentPerDay(dto.getRentPerDay());
        }
        if (dto.getRemarks() != null) {
            machinery.setRemarks(dto.getRemarks());
        }
        if (dto.getStatus() != null) {
            machinery.setStatus(dto.getStatus());
        }

        if (machinery instanceof Tractor tractor) {
            if (dto.getHorsepower() != null) {
                tractor.setHorsepower(dto.getHorsepower());
            }
            if (dto.getIs4x4() != null) {
                tractor.setIs4x4(dto.getIs4x4());
            }
        } else if (machinery instanceof Rotavator rotavator) {
            if (dto.getWorkingDepth() != null) {
                rotavator.setWorkingDepth(dto.getWorkingDepth());
            }
            if (dto.getBladeCount() != null) {
                rotavator.setBladeCount(dto.getBladeCount());
            }
        }

        return machineryRepository.save(machinery);
    }

    /**
     * Deletes a machinery item and its associated images from S3 and the database.
     */
    @Transactional
    public void deleteMachinery(Long machineryId) {
        Machinery machinery = machineryRepository.findById(machineryId)
                .orElseThrow(() -> new EntityNotFoundException("Machinery not found"));
        List<MachineryImage> images = machinery.getImages();
        for (MachineryImage image : images) {
            s3Service.deleteFile(image.getKey());
        }
        machineryRepository.delete(machinery);
    }

    /**
     * Calculates the distance between two points on Earth using the Haversine
     * formula.
     * Returns distance in kilometers.
     */
    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371; // Radius of the Earth in kilometers

        double lat1Rad = Math.toRadians(lat1);
        double lon1Rad = Math.toRadians(lon1);
        double lat2Rad = Math.toRadians(lat2);
        double lon2Rad = Math.toRadians(lon2);

        double dLat = lat2Rad - lat1Rad;
        double dLon = lon2Rad - lon1Rad;

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    /**
     * Creates a new machinery item and uploads its images, ensuring the operation
     * is atomic.
     */
    @Transactional
    public Machinery createMachinery(MachineryRequestDTO dto, List<MultipartFile> files) {
        User owner = userRepository.findById(dto.getOwnerId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Machinery machinery;
        switch (dto.getType()) {
            case TRACTOR:
                machinery = createTractor(dto, owner);
                break;
            case ROTAVATOR:
                machinery = createRotavator(dto, owner);
                break;
            default:
                throw new IllegalArgumentException("Invalid machinery type: " + dto.getType());
        }

        if (files != null && !files.isEmpty()) {
            setImages(machinery, files);
            System.out.println("Images size after setImages: " + machinery.getImages().size());
        }

        return machinery;
    }

    /**
     * Retrieves a machinery item by its ID.
     */
    public Machinery getMachineryById(Long id) {
        return machineryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Machinery not found"));
    }

    /**
     * Retrieves all machinery owned by a specific user.
     */
    public ArrayList<MachineryDTO> getAllMachineryByOwnerId(Long ownerId) {
        User user = userRepository.findById(ownerId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        ArrayList<MachineryDTO> machineryDTOs = new ArrayList<>();
        machineryRepository.findByOwner(user).forEach(m -> {
            MachineryDTO machineryDTO = new MachineryDTO();
            machineryDTO.setId(m.getId());
            machineryDTO.setImageUrls(machineryImageService.listImageUrls(m.getId()));
            machineryDTO.setType(m.getType() != null ? MachineryType.valueOf(m.getType().toUpperCase()) : null);
            machineryDTO.setRentPerDay(m.getRentPerDay() != null ? m.getRentPerDay() : 0.0);
            machineryDTO.setLatitude(m.getFarmLocation() != null ? m.getFarmLocation().getLatitude() : 0.0);
            machineryDTO.setLongitude(m.getFarmLocation() != null ? m.getFarmLocation().getLongitude() : 0.0);
            machineryDTO.setRemarks(m.getRemarks() != null ? m.getRemarks() : "");
            machineryDTO.setModel(m.getModelInfo() != null ? m.getModelInfo() : "");
            machineryDTO.setStatus(m.getStatus() != null ? m.getStatus() : MachineryStatus.AVAILABLE);
            machineryDTOs.add(machineryDTO);
        });
        return machineryDTOs;
    }

    // Helper Functions

    /**
     * Maps a machinery type string to its corresponding class.
     */
    private Class<? extends Machinery> getMachineryClass(String type) {
        if (type == null || type.isEmpty()) {
            return null;
        }
        return switch (type.toLowerCase()) {
            case "tractor" -> Tractor.class;
            case "rotavator" -> Rotavator.class;
            default -> throw new IllegalArgumentException("Invalid machinery type: " + type);
        };
    }

    /**
     * Uploads images for a machinery item after it has been saved.
     */
    private void setImages(Machinery machinery, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return;
        }

        List<Integer> imageNumbers = IntStream.range(1, files.size() + 1)
                .boxed()
                .collect(Collectors.toList());

        try {
            machineryImageService.uploadImages(machinery.getId(), files, imageNumbers);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload images for machinery ID " + machinery.getId(), e);
        }
    }

    /**
     * Creates and saves a tractor entity.
     */
    private Tractor createTractor(MachineryRequestDTO dto, User owner) {
        validateTractor(dto);

        Tractor tractor = new Tractor();
        setCommonFields(tractor, dto, owner);
        tractor.setHorsepower(dto.getHorsepower() == null ? 0 : dto.getHorsepower());
        tractor.setIs4x4(dto.getIs4x4());
        return tractorRepository.save(tractor);
    }

    /**
     * Creates and saves a rotavator entity.
     */
    private Rotavator createRotavator(MachineryRequestDTO dto, User owner) {
        validateRotavator(dto);

        Rotavator rotavator = new Rotavator();
        setCommonFields(rotavator, dto, owner);
        rotavator.setWorkingDepth(dto.getWorkingDepth());
        rotavator.setBladeCount(dto.getBladeCount());
        return rotavatorRepository.save(rotavator);
    }

    /**
     * Sets common fields for a machinery entity.
     */
    private void setCommonFields(Machinery machinery, MachineryRequestDTO dto, User owner) {
        machinery.setRentPerDay(dto.getRentPerDay());
        machinery.setOwner(owner);
        machinery.setRemarks(dto.getRemarks());
        machinery.setStatus(dto.getStatus());
        machinery.setFarmLocation(farmRepository.findById(dto.getFarmId())
                .orElseThrow(() -> new EntityNotFoundException("Farm not found")));
    }

    /**
     * Validates tractor-specific fields in the DTO.
     */
    private void validateTractor(MachineryRequestDTO dto) {
        if (dto.getHorsepower() == null || dto.getHorsepower() <= 0) {
            throw new IllegalArgumentException("Invalid horsepower");
        }
        if (dto.getIs4x4() == null) {
            throw new IllegalArgumentException("4x4 specification required");
        }
    }

    /**
     * Validates rotavator-specific fields in the DTO.
     */
    private void validateRotavator(MachineryRequestDTO dto) {
        if (dto.getWorkingDepth() == null || dto.getWorkingDepth() <= 0) {
            throw new IllegalArgumentException("Invalid working Depth");
        }
        if (dto.getBladeCount() == null || dto.getBladeCount() <= 0) {
            throw new IllegalArgumentException("Invalid blade Count");
        }
    }
}