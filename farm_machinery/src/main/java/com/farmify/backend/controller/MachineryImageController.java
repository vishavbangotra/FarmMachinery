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
import com.farmify.backend.dto.ApiResponse;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/machinery/{machineId}/images")
@RequiredArgsConstructor
public class MachineryImageController {
    private static final Logger logger = LoggerFactory.getLogger(MachineryImageController.class);
    private final MachineryImageService imageService;

    @PostMapping
    public ResponseEntity<ApiResponse<String>> uploadImage(
            @PathVariable Long machineId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("imageNumber") Integer imageNumber) throws Exception {
        logger.info("Uploading image for machineId={}, imageNumber={}", machineId, imageNumber);
        String key = imageService.uploadImage(machineId, file, imageNumber);
        String url = imageService.getImageUrl(machineId, imageNumber).orElseThrow();
        logger.info("Image uploaded for machineId={}, imageNumber={}, url={}", machineId, imageNumber, url);
        return ResponseEntity.ok(new ApiResponse<>(true, "Image uploaded successfully", url));
    }

    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<List<String>>> uploadMultiple(
            @PathVariable Long machineId,
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "imageNumbers", required = false) List<Integer> imageNumbers) throws Exception {
        logger.info("Uploading multiple images for machineId={}", machineId);
        List<String> urls = imageService.uploadImages(machineId, files, imageNumbers);
        logger.info("{} images uploaded for machineId={}", urls.size(), machineId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Images uploaded successfully", urls));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<String>>> listImages(@PathVariable Long machineId) {
        logger.info("Listing images for machineId={}", machineId);
        List<String> urls = imageService.listImageUrls(machineId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Images fetched successfully", urls));
    }

    @DeleteMapping("/{imageNumber}")
    public ResponseEntity<ApiResponse<Void>> deleteImage(
            @PathVariable Long machineId,
            @PathVariable Integer imageNumber) {
        logger.info("Deleting image for machineId={}, imageNumber={}", machineId, imageNumber);
        imageService.deleteImage(machineId, imageNumber);
        logger.info("Image deleted for machineId={}, imageNumber={}", machineId, imageNumber);
        return ResponseEntity.ok(new ApiResponse<>(true, "Image deleted", null));
    }
}
