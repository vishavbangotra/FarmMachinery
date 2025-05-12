package com.farmify.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Long>> addFarm(
            @Valid @RequestBody FarmDTO farmDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.info("Attempting to add farm for authenticated user");
        Long userId = jwtService.extractUserIdFromPrincipal(userDetails);
        farmDTO.setOwnerId(userId);
        try {
            Farm createdFarm = farmService.createFarm(farmDTO);
            logger.info("Farm created with id={}", createdFarm.getId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Farm created successfully", createdFarm.getId()));
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid farm creation request: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Iterable<Farm>>> getAllFarms() {
        logger.info("Fetching all farms");
        Iterable<Farm> farms = farmService.getAllFarms();
        return ResponseEntity.ok(new ApiResponse<>(true, "Farms fetched successfully", farms));
    }

    @GetMapping("/user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Iterable<Farm>>> getFarmsByUserId(
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.info("Fetching farms for authenticated user");
        Long userId = jwtService.extractUserIdFromPrincipal(userDetails);
        Iterable<Farm> farms = farmService.getFarmsByUserId(userId);
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
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteFarm(@PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.info("Attempting to delete farm with id={}", id);
        try {
            // Optionally, check if the user owns the farm before deleting
            farmService.deleteFarm(id);
            logger.info("Farm deleted with id={}", id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Farm deleted", null));
        } catch (IllegalArgumentException e) {
            logger.warn("Farm not found or could not be deleted with id={}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Farm not found or could not be deleted", null));
        }
    }
}