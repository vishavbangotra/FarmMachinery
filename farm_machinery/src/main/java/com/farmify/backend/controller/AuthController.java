package com.farmify.backend.controller;

import com.farmify.backend.dto.*;
import com.farmify.backend.exception.ResourceNotFoundException;
import com.farmify.backend.service.JwtService;
import com.farmify.backend.service.UserService;
import com.twilio.exception.ApiException;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Value("${twilio.verifyServiceSid}")
    private String verifyServiceSid;

    @Autowired
    UserService userService;

    @Autowired
    JwtService jwtService;

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<OtpResponse>> sendOtp(@RequestBody OtpRequest request) {
        try {
            Verification verification = Verification.creator(
                    verifyServiceSid,
                    request.getPhoneNumber(),
                    "sms").create();
            logger.info("OTP sent to {}", request.getPhoneNumber());
            OtpResponse otpResponse = new OtpResponse(true, "OTP sent successfully", verification.getStatus());
            return ResponseEntity.ok(new ApiResponse<>(true, "OTP sent successfully", otpResponse));
        } catch (ApiException e) {
            logger.error("Twilio API error while sending OTP to {}: {}", request.getPhoneNumber(), e.getMessage());
            OtpResponse otpResponse = new OtpResponse(false, "Twilio API error: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Twilio API error", otpResponse));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Object>> verifyOtp(@RequestBody OtpVerifyRequest request) {
        try {
            VerificationCheck verificationCheck = VerificationCheck.creator(verifyServiceSid, request
                    .getOtp())
                    .setTo(request.getPhoneNumber())
                    .create();
            if ("approved".equalsIgnoreCase(verificationCheck.getStatus())) {
                boolean isNewUser = false;
                Long userId;
                try {
                    userId = userService.findByPhoneNumber(request.getPhoneNumber()).getId();
                } catch (ResourceNotFoundException e) {
                    logger.info("User not found, creating user for phone number: {}", request.getPhoneNumber());
                    userId = userService.createUser(request.getPhoneNumber()).getId();
                    isNewUser = true;
                }
                String token = jwtService.generateToken(userId, request.getPhoneNumber());
                AuthResponse authResponse = new AuthResponse(true, "Login successful", token, isNewUser);
                return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", authResponse));
            } else {
                logger.warn("Invalid OTP for phone number: {}", request.getPhoneNumber());
                OtpResponse otpResponse = new OtpResponse(false, "Invalid OTP", verificationCheck.getStatus());
                return ResponseEntity.ok(new ApiResponse<>(false, "Invalid OTP", otpResponse));
            }
        } catch (ApiException e) {
            logger.error("Twilio API error while verifying OTP for {}: {}", request.getPhoneNumber(), e.getMessage());
            OtpResponse otpResponse = new OtpResponse(false, "Twilio API error: " + e.getMessage(), null);
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Twilio API error", otpResponse));
        }
    }
}
