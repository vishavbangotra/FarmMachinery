package com.farmify.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.*;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class AwsS3Config {

    @Value("${aws.region}")
    private String awsRegion;

    @Bean
    public AwsCredentialsProvider awsCredentialsProvider() {
        // This will automatically pick up AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
        // env vars,
        // or IAM role on an EC2/EKS instance.
        return DefaultCredentialsProvider.create();
    }

    @Bean
    public S3Client s3Client(AwsCredentialsProvider credentialsProvider) {
        return S3Client.builder()
                .credentialsProvider(credentialsProvider)
                .region(Region.of(awsRegion))
                .build();
    }
}
