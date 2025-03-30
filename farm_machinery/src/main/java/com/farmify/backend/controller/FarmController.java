package com.farmify.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.farmify.backend.dto.FarmDTO;
import com.farmify.backend.model.Farm;
import com.farmify.backend.service.FarmService;

@RestController
@RequestMapping("/api/farms")
public class FarmController {
    private final FarmService farmService;

    public FarmController(FarmService farmService) {
        this.farmService = farmService;
    }

    @PostMapping("/add")
    public ResponseEntity<Long> addFarm(@RequestBody FarmDTO farmDTO) {
        Long farmId = farmDTO.getFarmId();

        if (farmId != null && farmService.findFarmById(farmId).isPresent()) {
            return ResponseEntity.badRequest().body(null);
        }

        Long id = farmService.createFarm(farmDTO).getId();
        return ResponseEntity.status(HttpStatus.CREATED).body(id);
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
        Farm farm = farmService.findFarmById(id).orElse(null);
        return ResponseEntity.ok(farm);
    }




}
