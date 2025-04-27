package com.farmify.backend.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.farmify.backend.model.Machinery;
import com.farmify.backend.model.MachineryImage;
import com.farmify.backend.repository.MachineryImageRepository;
import com.farmify.backend.repository.MachineryRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MachineryImageService {
    private final MachineryRepository machineryRepo;
    private final MachineryImageRepository imageRepo;
    private final S3Service s3Service;

    /** Upload or replace a single image in a slot */
    @Transactional
    public String uploadImage(Long machineryId,
            MultipartFile file,
            Integer imageNumber) throws IOException {
        Machinery m = machineryRepo.findById(machineryId)
                .orElseThrow(() -> new EntityNotFoundException("Machine not found"));

        if (imageNumber < 1 || imageNumber > 5)
            throw new IllegalArgumentException("imageNumber must be 1-5");

        // If exists, delete old
        Optional<MachineryImage> existing = imageRepo.findByMachineryAndImageNumber(m, imageNumber);
        if (existing.isPresent()) {
            s3Service.deleteFile(existing.get().getKey());
            imageRepo.delete(existing.get());
        } else {
            // New slot: enforce max
            if (imageRepo.countByMachinery(m) >= 5)
                throw new IllegalStateException("Cannot exceed 5 images");
        }

        String key = s3Service.uploadFile(machineryId, file);
        MachineryImage img = new MachineryImage();
        img.setMachinery(m);
        img.setImageNumber(imageNumber);
        img.setKey(key);
        imageRepo.save(img);

        return key;
    }

    /** Bulk upload with optional specified slots */
    @Transactional
    public List<String> uploadImages(Long machineryId,
            List<MultipartFile> files,
            List<Integer> imageNumbers) throws IOException {
        Machinery m = machineryRepo.findById(machineryId)
                .orElseThrow(() -> new EntityNotFoundException("Machine not found"));

        List<Integer> slots = new ArrayList<>();
        if (imageNumbers != null && !imageNumbers.isEmpty()) {
            if (imageNumbers.size() != files.size())
                throw new IllegalArgumentException("files and imageNumbers size mismatch");
            slots.addAll(imageNumbers);
        } else {
            // auto-assign free slots
            Set<Integer> used = imageRepo.findByMachineryOrderByImageNumberAsc(m)
                    .stream().map(MachineryImage::getImageNumber)
                    .collect(Collectors.toSet());
            int slot = 1;
            for (int i = 0; i < files.size(); i++) {
                while (used.contains(slot))
                    slot++;
                if (slot > 5)
                    throw new IllegalStateException("No free slots available");
                slots.add(slot);
                used.add(slot);
            }
        }

        List<String> urls = new ArrayList<>();
        for (int i = 0; i < files.size(); i++) {
            MultipartFile f = files.get(i);
            Integer imgNo = slots.get(i);
            // replace if exists
            imageRepo.findByMachineryAndImageNumber(m, imgNo)
                    .ifPresent(img -> {
                        s3Service.deleteFile(img.getKey());
                        imageRepo.delete(img);
                    });

            String key = s3Service.uploadFile(machineryId, f);
            MachineryImage img = new MachineryImage();
            img.setMachinery(m);
            img.setImageNumber(imgNo);
            img.setKey(key);
            imageRepo.save(img);

            urls.add(s3Service.getFileUrl(key));
        }
        return urls;
    }

    public Optional<String> getImageUrl(Long machineryId, Integer imageNumber) {
        Machinery m = machineryRepo.getReferenceById(machineryId);
        return imageRepo.findByMachineryAndImageNumber(m, imageNumber)
                .map(MachineryImage::getKey)
                .map(k -> s3Service.getFileUrl(k));
    }

    public List<String> listImageUrls(Long machineryId) {
        Machinery m = machineryRepo.getReferenceById(machineryId);
        return imageRepo.findByMachineryOrderByImageNumberAsc(m)
                .stream()
                .map(MachineryImage::getKey)
                .map(k -> s3Service.getFileUrl(k))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteImage(Long machineryId, Integer imageNumber) {
        Machinery m = machineryRepo.getReferenceById(machineryId);
        MachineryImage img = imageRepo.findByMachineryAndImageNumber(m, imageNumber)
                .orElseThrow(() -> new EntityNotFoundException("Image not found"));
        s3Service.deleteFile(img.getKey());
        imageRepo.delete(img);
    }
}