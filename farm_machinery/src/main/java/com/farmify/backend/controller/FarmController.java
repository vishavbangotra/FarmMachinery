package com.farmify.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.farmify.backend.dto.FarmDTO;
import com.farmify.backend.model.Farm;
import com.farmify.backend.service.FarmService;
import com.farmify.backend.service.JwtService;

import lombok.Data;
import javax.validation.Valid;

@Data
@RestController
@RequestMapping("/api/farms")
public class FarmController {
    private final FarmService farmService;
    private final JwtService jwtService;

    @PostMapping("/add")
    public ResponseEntity<Long> addFarm(
            @Valid @RequestBody FarmDTO farmDTO,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        // Check if Authorization header is valid
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authorizationHeader.substring("Bearer ".length()).trim();
        try {
            Long userId = jwtService.extractUserId(token);
            farmDTO.setOwnerId(userId);
            Farm createdFarm = farmService.createFarm(farmDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdFarm.getId());
        } catch (Exception e) { // Ideally, replace with specific exception (e.g., JwtException)
            System.out.println("Error creating farm: " + e.getMessage()); // Replace with logger in production
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<Iterable<Farm>> getAllFarms() {
        return ResponseEntity.ok(farmService.getAllFarms());
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<Iterable<Farm>> getFarmsByUserId(@PathVariable Long id) {
        return ResponseEntity.ok(farmService.getFarmsByUserId(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Farm> getFarmById(@PathVariable Long id) {
        return farmService.findFarmById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}