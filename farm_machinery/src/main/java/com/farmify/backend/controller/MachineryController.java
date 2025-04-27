package com.farmify.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.farmify.backend.dto.MachineryDTO;
import com.farmify.backend.dto.MachinerySearchResultDTO;
import com.farmify.backend.model.Machinery;
import com.farmify.backend.service.JwtService;
import com.farmify.backend.service.MachineryService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/machinery")
@RequiredArgsConstructor
public class MachineryController {
    private final MachineryService machineryService;
    private final JwtService jwtService;

    @PostMapping("/add")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Machinery> addMachinery(@RequestBody MachineryDTO machinery,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        // Check if Authorization header is valid
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authorizationHeader.substring("Bearer ".length()).trim();
        Long userId = jwtService.extractUserId(token);
        machinery.setOwnerId(userId);
        try {
            Machinery createdMachinery = machineryService.createMachinery(machinery);
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

        if(!jwtService.extractUserId(token).equals(machineryService.getMachineryById(id).getOwner().getId())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        machineryService.deleteMachinery(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Iterable<Machinery>> getAllMachineriesByOwner(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        // Check if Authorization header is valid
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authorizationHeader.substring("Bearer ".length()).trim();

        Long ownerId = jwtService.extractUserId(token);
        return ResponseEntity.ok(machineryService.getAllMachineryByOwnerId(ownerId));
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