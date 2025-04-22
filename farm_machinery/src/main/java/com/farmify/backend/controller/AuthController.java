package com.farmify.backend.controller;

import com.farmify.backend.dto.*;
import com.farmify.backend.model.User;
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
    public ResponseEntity<OtpResponse> sendOtp(@RequestBody OtpRequest request) {
        try {
            Verification verification = Verification.creator(
                    verifyServiceSid,
                    request.getPhoneNumber(), // Ensure this is in E.164 format (e.g., +912345678901)
                    "sms").create();

            logger.info("OTP sent to {}", request.getPhoneNumber());
            return ResponseEntity.ok(new OtpResponse(true, "OTP sent successfully", verification.getStatus()));
        } catch (ApiException e) {
            logger.error("Twilio API error while sending OTP to {}: {}", request.getPhoneNumber(), e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new OtpResponse(false, "Twilio API error: " + e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Unexpected error while sending OTP to {}: {}", request.getPhoneNumber(), e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new OtpResponse(false, "Unexpected error: " + e.getMessage(), null));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Object> verifyOtp(@RequestBody OtpVerifyRequest request) {
        try {
            VerificationCheck verificationCheck = VerificationCheck.creator(verifyServiceSid, request
                    .getOtp())
                    .setTo(request.getPhoneNumber())
                    .create();

            if ("approved".equalsIgnoreCase(verificationCheck.getStatus())) {
                boolean isNewUser = false;
                if(userService.findByPhoneNumber(request.getPhoneNumber()) == null) {
                    userService.createUser(request.getPhoneNumber());
                    isNewUser = true;
                }
                Long userId = userService.findByPhoneNumber(request.getPhoneNumber()).getId();
                String token = jwtService.generateToken(userId, request.getPhoneNumber());
                return ResponseEntity.ok(new AuthResponse(true, "Login successful", token, isNewUser));
            } else {
                logger.warn("Invalid OTP for phone number: {}", request.getPhoneNumber());
                return ResponseEntity.ok(new OtpResponse(false, "Invalid OTP", verificationCheck.getStatus()));
            }
        } catch (ApiException e) {
            logger.error("Twilio API error while verifying OTP for {}: {}", request.getPhoneNumber(), e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new OtpResponse(false, "Twilio API error: " + e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Unexpected error while verifying OTP for {}: {}", request.getPhoneNumber(), e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new OtpResponse(false, "Unexpected error: " + e.getMessage(), null));
        }
    }
}
