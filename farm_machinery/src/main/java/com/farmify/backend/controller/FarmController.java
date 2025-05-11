package com.farmify.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.farmify.backend.dto.ApiResponse;
import com.farmify.backend.dto.FarmDTO;
import com.farmify.backend.model.Farm;
import com.farmify.backend.service.FarmService;
import com.farmify.backend.service.JwtService;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/farms")
@RequiredArgsConstructor
public class FarmController {
    private static final Logger logger = LoggerFactory.getLogger(FarmController.class);
    private final FarmService farmService;
    private final JwtService jwtService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Long>> addFarm(
            @Valid @RequestBody FarmDTO farmDTO,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        logger.info("Attempting to add farm for ownerId={}", farmDTO.getOwnerId());
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            logger.warn("Unauthorized farm creation attempt");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Unauthorized", null));
        }
        String token = authorizationHeader.substring("Bearer ".length()).trim();
        try {
            Long userId = jwtService.extractUserId(token);
            farmDTO.setOwnerId(userId);
            Farm createdFarm = farmService.createFarm(farmDTO);
            logger.info("Farm created with id={}", createdFarm.getId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Farm created successfully", createdFarm.getId()));
        } catch (Exception e) {
            logger.error("Error creating farm: {}", e.getMessage(), e);
            throw e; // Let global exception handler manage this
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Iterable<Farm>>> getAllFarms() {
        logger.info("Fetching all farms");
        Iterable<Farm> farms = farmService.getAllFarms();
        return ResponseEntity.ok(new ApiResponse<>(true, "Farms fetched successfully", farms));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<ApiResponse<Iterable<Farm>>> getFarmsByUserId(@PathVariable Long id) {
        logger.info("Fetching farms for userId={}", id);
        Iterable<Farm> farms = farmService.getFarmsByUserId(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Farms fetched successfully", farms));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Farm>> getFarmById(@PathVariable Long id) {
        logger.info("Fetching farm with id={}", id);
        return farmService.findFarmById(id)
                .map(farm -> ResponseEntity.ok(new ApiResponse<>(true, "Farm fetched successfully", farm)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Farm not found", null)));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFarm(@PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        logger.info("Attempting to delete farm with id={}", id);
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            logger.warn("Unauthorized farm deletion attempt");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Unauthorized", null));
        }
        String token = authorizationHeader.substring("Bearer ".length()).trim();
        farmService.deleteFarm(id);
        logger.info("Farm deleted with id={}", id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Farm deleted", null));
    }
}