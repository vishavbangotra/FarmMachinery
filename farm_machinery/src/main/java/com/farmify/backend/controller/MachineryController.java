package com.farmify.backend.controller;

import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.farmify.backend.dto.MachineryDTO;
import com.farmify.backend.dto.MachineryRequestDTO;
import com.farmify.backend.dto.MachinerySearchResultDTO;
import com.farmify.backend.dto.UpdateMachineryDTO;
import com.farmify.backend.model.Machinery;
import com.farmify.backend.service.JwtService;
import com.farmify.backend.service.MachineryService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/machinery")
@RequiredArgsConstructor
public class MachineryController {
    private final MachineryService machineryService;
    private final JwtService jwtService;

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("permitAll()")
    public ResponseEntity<Machinery> addMachinery(
            // <-- bind all simple form fields (type, farmId, model, year…) into this DTO:
            @ModelAttribute MachineryRequestDTO machineryDto,

            // <-- pick up zero-or-more file-parts called "files":
            @RequestPart(value = "files", required = false) List<MultipartFile> files,

            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        // Check if Authorization header is valid
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authorizationHeader.substring("Bearer ".length()).trim();
        Long userId = jwtService.extractUserId(token);
        machineryDto.setOwnerId(userId);
        try {
            Machinery createdMachinery = machineryService.createMachinery(machineryDto, files);
            return ResponseEntity.ok(createdMachinery);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (IllegalArgumentException e) {
            System.out.println("Error creating machinery: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            System.out.println("Error creating machinery: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteMachinery(@PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        // Check if Authorization header is valid
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authorizationHeader.substring("Bearer ".length()).trim();

        if (!jwtService.extractUserId(token).equals(machineryService.getMachineryById(id).getOwner().getId())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        machineryService.deleteMachinery(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<ArrayList<MachineryDTO>> getAllMachineriesByOwner(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        // Check if Authorization header is valid
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authorizationHeader.substring("Bearer ".length()).trim();

        Long ownerId = jwtService.extractUserId(token);
        return ResponseEntity.ok(machineryService.getAllMachineryByOwnerId(ownerId));
    }

    @PutMapping(value = "/update/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Machinery> updateMachinery(
            @PathVariable Long id,
            @RequestBody UpdateMachineryDTO dto,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authorizationHeader.substring("Bearer ".length()).trim();
        Long userId = jwtService.extractUserId(token);

        try {
            Machinery machinery = machineryService.getMachineryById(id);
            if (!userId.equals(machinery.getOwner().getId())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Machinery updatedMachinery = machineryService.updateMachinery(id, dto);
            return ResponseEntity.ok(updatedMachinery);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            System.out.println("Error updating machinery: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<MachinerySearchResultDTO>> findMachinery(@RequestParam String type,
            @RequestParam double lon,
            @RequestParam double lat,
            @RequestParam double distance) {
        List<MachinerySearchResultDTO> machineryList = machineryService.getAllMachineryByDistanceAndType(type, lon, lat,
                distance);
        return ResponseEntity.ok(machineryList);
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Machinery> getMachineryById(@PathVariable Long id) {
        return ResponseEntity.ok().body(machineryService.getMachineryById(id));
    }
}