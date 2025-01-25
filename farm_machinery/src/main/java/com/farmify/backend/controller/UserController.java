package com.farmify.backend.controller;

import com.farmify.backend.model.User;
import com.farmify.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Generate OTP
    @PostMapping("/generate-otp")
    public ResponseEntity<String> generateOtp(@RequestParam String phone) {
        String otp = userService.generateOtp(phone);
        return ResponseEntity.ok("OTP generated: " + otp); // For testing; in production, send via SMS
    }

    // Verify OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String phone, @RequestParam String otp) {
        if (userService.verifyOtp(phone, otp)) {
            return ResponseEntity.ok("OTP verified successfully");
        }
        return ResponseEntity.badRequest().body("Invalid OTP");
    }

    // Register User
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestParam String phone, @RequestParam String name) {
        User user = userService.registerUser(phone, name);
        return ResponseEntity.ok(user);
    }

    // Login User
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestParam String phone) {
        String token = userService.loginUser(phone);
        return ResponseEntity.ok("JWT Token: " + token);
    }
}
