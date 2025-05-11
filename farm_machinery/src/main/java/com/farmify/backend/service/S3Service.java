package com.farmify.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.ServerSideEncryption;

import java.io.IOException;
import java.time.Instant;
import java.util.UUID;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class S3Service {
    private final S3Client s3;
    private final String bucketName;
    private final String region;

    public S3Service(S3Client s3Client,
            @Value("${aws.s3.bucket}") String bucketName,
            @Value("${aws.region}") String region) {
        this.s3 = s3Client;
        this.bucketName = bucketName;
        this.region = region;
        log.info("S3Service initialized for bucket: {} in region: {}", bucketName, region);
    }

    /**
     * Uploads a file to S3 under machinery/{id}/ and returns the key.
     * @param machineryId Machinery ID
     * @param file MultipartFile to upload
     * @return S3 key of the uploaded file
     * @throws IOException if upload fails
     */
    public String uploadFile(Long machineryId, MultipartFile file) throws IOException {
        String orig = file.getOriginalFilename();
        String ext = orig != null && orig.contains(".") ? orig.substring(orig.lastIndexOf('.')) : "";
        String key = String.format("machinery/%d/%s-%s%s",
                machineryId,
                Instant.now().toString().replace(':', '-'),
                UUID.randomUUID(),
                ext);
        try {
            PutObjectRequest por = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .serverSideEncryption(ServerSideEncryption.AES256)
                    .build();
            s3.putObject(por, RequestBody.fromBytes(file.getBytes()));
            log.info("File uploaded to S3: {}", key);
            return key;
        } catch (Exception e) {
            log.error("Failed to upload file to S3 for machineryId {}: {}", machineryId, e.getMessage(), e);
            throw new IOException("Failed to upload file to S3", e);
        }
    }

    /**
     * Deletes a file from S3 by key.
     * @param key S3 key to delete
     */
    public void deleteFile(String key) {
        try {
            DeleteObjectRequest dor = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            s3.deleteObject(dor);
            log.info("File deleted from S3: {}", key);
        } catch (Exception e) {
            log.error("Failed to delete file from S3: {}", key, e);
            throw new RuntimeException("Failed to delete file from S3: " + key, e);
        }
    }

    /**
     * Builds a public URL for a file in S3.
     * @param key S3 key
     * @return Public URL
     */
    public String getFileUrl(String key) {
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, key);
    }
}
