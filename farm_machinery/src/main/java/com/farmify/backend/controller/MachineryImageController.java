package com.farmify.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.farmify.backend.service.MachineryImageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/machinery/{machineId}/images")
@RequiredArgsConstructor
public class MachineryImageController {
    private final MachineryImageService imageService;

    @PostMapping
    public ResponseEntity<String> uploadImage(
            @PathVariable Long machineId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("imageNumber") Integer imageNumber) throws Exception {
        String key = imageService.uploadImage(machineId, file, imageNumber);
        String url = imageService.getImageUrl(machineId, imageNumber).orElseThrow();
        return ResponseEntity.ok(url);
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<String>> uploadMultiple(
            @PathVariable Long machineId,
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "imageNumbers", required = false) List<Integer> imageNumbers) throws Exception {
        List<String> urls = imageService.uploadImages(machineId, files, imageNumbers);
        return ResponseEntity.ok(urls);
    }

    @GetMapping
    public ResponseEntity<List<String>> listImages(@PathVariable Long machineId) {
        return ResponseEntity.ok(imageService.listImageUrls(machineId));
    }

    @DeleteMapping("/{imageNumber}")
    public ResponseEntity<Void> deleteImage(
            @PathVariable Long machineId,
            @PathVariable Integer imageNumber) {
        imageService.deleteImage(machineId, imageNumber);
        return ResponseEntity.noContent().build();
    }
}
