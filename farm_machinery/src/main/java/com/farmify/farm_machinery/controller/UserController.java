package com.farmify.farm_machinery.controller;

import com.farmify.farm_machinery.model.User;
import com.farmify.farm_machinery.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/generate-otp")
    public ResponseEntity<String> generateOtp(@RequestParam String phone) {
        String otp = userService.generateOtp(phone);
        return ResponseEntity.ok("OTP sent to phone: " + otp); // For testing, display the OTP
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestParam String phone, @RequestParam String name,
            @RequestParam String otp) {
        if (!userService.verifyOtp(phone, otp)) {
            return ResponseEntity.badRequest().body(null);
        }
        User user = userService.registerUser(phone, name);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String phone, @RequestParam String otp) {
        if (!userService.verifyOtp(phone, otp)) {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }
        User user = userService.loginUser(phone);
        return ResponseEntity.ok("Logged in successfully as " + user.getName());
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestParam String phone) {
        userService.logoutUser(phone);
        return ResponseEntity.ok("Logged out successfully");
    }
}
