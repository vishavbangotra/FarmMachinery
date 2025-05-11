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

@RestController
@RequestMapping("/api")
public class NotificationController {
    private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/store-token")
    public ResponseEntity<ApiResponse<String>> storeToken(@RequestBody Map<String, String> request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String pushToken = request.get("pushToken");
        logger.info("Storing push token for user: {}", userDetails.getUsername());
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!user.getPushTokens().stream().anyMatch(t -> t.getToken().equals(pushToken))) {
            user.addPushToken(pushToken);
            userRepository.save(user);
            logger.info("Push token added for user: {}", userDetails.getUsername());
        } else {
            logger.info("Push token already exists for user: {}", userDetails.getUsername());
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Token stored successfully", null));
    }
}