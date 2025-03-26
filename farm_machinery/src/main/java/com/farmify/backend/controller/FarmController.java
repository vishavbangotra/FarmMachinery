package com.farmify.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
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
    public ResponseEntity<Farm> addFarm(FarmDTO farmDTO) {
        Long farmId = farmDTO.getFarmId();
        if(farmService.findFarmById(farmId).isPresent()) {
            farmService.updateFarm(farmDTO);
        } else {
            farmService.createFarm(farmDTO);
        }
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }




}
