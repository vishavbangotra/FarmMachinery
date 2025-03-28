package com.farmify.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.farmify.backend.dto.MachineryDTO;
import com.farmify.backend.model.Machinery;
import com.farmify.backend.service.MachineryService;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/machinery")
public class MachineryController {
    private final MachineryService machineryService;

    public MachineryController(MachineryService machineryService) {
        this.machineryService = machineryService;
    }

    @PostMapping("/add")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Machinery> addMachinery(@RequestBody MachineryDTO machinery) {
        System.out.println(machinery.toString());
        try {
            Machinery createdMachinery = machineryService.createMachinery(machinery);
            return ResponseEntity.ok(createdMachinery);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<Machinery>> findMachinery(@RequestParam String type, 
                                                         @RequestParam double lon, 
                                                         @RequestParam double lat, 
                                                         @RequestParam double distance) {
        List<Machinery> machineryList = machineryService.getMachineryByDistanceAndType(type, lon, lat, distance);
        return ResponseEntity.ok(machineryList);
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Machinery> getMachineryById(@PathVariable Long id) {
        return ResponseEntity.ok().body(machineryService.getMachineryById(id));
    }
}