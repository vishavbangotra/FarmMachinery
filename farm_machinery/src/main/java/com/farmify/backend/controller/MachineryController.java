package com.farmify.backend.controller;

import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.farmify.backend.dto.ApiResponse;
import com.farmify.backend.dto.MachineryDTO;
import com.farmify.backend.dto.MachineryRequestDTO;
import com.farmify.backend.dto.MachinerySearchResultDTO;
import com.farmify.backend.dto.UpdateMachineryDTO;
import com.farmify.backend.model.Machinery;
import com.farmify.backend.service.JwtService;
import com.farmify.backend.service.MachineryService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/machinery")
@RequiredArgsConstructor
public class MachineryController {
    private static final Logger logger = LoggerFactory.getLogger(MachineryController.class);
    private final MachineryService machineryService;
    private final JwtService jwtService;

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Machinery>> addMachinery(
            @ModelAttribute MachineryRequestDTO machineryDto,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.info("Attempting to add machinery for authenticated user");
        Long userId = jwtService.extractUserIdFromPrincipal(userDetails);
        machineryDto.setOwnerId(userId);
        try {
            Machinery createdMachinery = machineryService.createMachinery(machineryDto, files);
            logger.info("Machinery created with id={}", createdMachinery.getId());
            return ResponseEntity.ok(new ApiResponse<>(true, "Machinery created successfully", createdMachinery));
        } catch (EntityNotFoundException e) {
            logger.warn("Entity not found during machinery creation: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Entity not found", null));
        } catch (IllegalArgumentException e) {
            logger.error("Error creating machinery: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Error creating machinery: {}", e.getMessage(), e);
            throw e;
        }
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteMachinery(@PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.info("Attempting to delete machinery with id={}", id);
        Long userId = jwtService.extractUserIdFromPrincipal(userDetails);
        if (!userId.equals(machineryService.getMachineryById(id).getOwner().getId())) {
            logger.warn("User not authorized to delete machinery with id={}", id);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Unauthorized", null));
        }
        machineryService.deleteMachinery(id);
        logger.info("Machinery deleted with id={}", id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Machinery deleted", null));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ArrayList<MachineryDTO>>> getAllMachineriesByOwner(
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.info("Fetching all machineries for authenticated user");
        Long ownerId = jwtService.extractUserIdFromPrincipal(userDetails);
        ArrayList<MachineryDTO> machineryList = machineryService.getAllMachineryByOwnerId(ownerId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Machineries fetched successfully", machineryList));
    }

    @PutMapping(value = "/update/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Machinery>> updateMachinery(
            @PathVariable Long id,
            @RequestBody UpdateMachineryDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.info("Attempting to update machinery with id={}", id);
        Long userId = jwtService.extractUserIdFromPrincipal(userDetails);
        try {
            Machinery machinery = machineryService.getMachineryById(id);
            if (!userId.equals(machinery.getOwner().getId())) {
                logger.warn("User not authorized to update machinery with id={}", id);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse<>(false, "Unauthorized", null));
            }
            Machinery updatedMachinery = machineryService.updateMachinery(id, dto);
            logger.info("Machinery updated with id={}", id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Machinery updated successfully", updatedMachinery));
        } catch (EntityNotFoundException e) {
            logger.warn("Machinery not found for update: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Machinery not found", null));
        } catch (Exception e) {
            logger.error("Error updating machinery: {}", e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/search")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<List<MachinerySearchResultDTO>>> findMachinery(@RequestParam String type,
            @RequestParam double lon,
            @RequestParam double lat,
            @RequestParam double distance) {
        logger.info("Searching machinery by type={}, lon={}, lat={}, distance={}", type, lon, lat, distance);
        List<MachinerySearchResultDTO> machineryList = machineryService.getAllMachineryByDistanceAndType(type, lon, lat, distance);
        return ResponseEntity.ok(new ApiResponse<>(true, "Machinery search results fetched", machineryList));
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<Machinery>> getMachineryById(@PathVariable Long id) {
        logger.info("Fetching machinery with id={}", id);
        Machinery machinery = machineryService.getMachineryById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Machinery fetched successfully", machinery));
    }
}