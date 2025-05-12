package com.farmify.backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.farmify.backend.model.User;
import com.farmify.backend.repository.UserRepository;
import com.farmify.backend.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api")
public class NotificationController {
    private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/notifications/send")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<String>> sendNotification(
            @RequestBody Map<String, Object> payload,
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.info("Sending notification for userId={}", userDetails.getUsername());
        // Notification logic here (stub)
        return ResponseEntity.ok(new ApiResponse<>(true, "Notification sent", null));
    }
}