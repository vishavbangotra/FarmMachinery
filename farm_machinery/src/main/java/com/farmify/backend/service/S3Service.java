package com.farmify.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.ServerSideEncryption;

import java.io.IOException;
import java.time.Instant;
import java.util.UUID;

@Service
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
    }

    /** Uploads under machinery/{id}/ and returns the key */
    public String uploadFile(Long machineryId, MultipartFile file) throws IOException {
        String orig = file.getOriginalFilename();
        String ext = orig != null && orig.contains(".") ? orig.substring(orig.lastIndexOf('.')) : "";
        String key = String.format("machinery/%d/%s-%s%s",
                machineryId,
                Instant.now().toString().replace(':', '-'),
                UUID.randomUUID(),
                ext);

        PutObjectRequest por = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .acl(ObjectCannedACL.PUBLIC_READ)
                .contentType(file.getContentType())
                .serverSideEncryption(ServerSideEncryption.AES256)
                .build();

        s3.putObject(por, RequestBody.fromBytes(file.getBytes()));
        return key;
    }

    /** Deletes by key */
    public void deleteFile(String key) {
        DeleteObjectRequest dor = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        s3.deleteObject(dor);
    }

    /** Builds public URL */
    public String getFileUrl(String key) {
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, key);
    }
}
