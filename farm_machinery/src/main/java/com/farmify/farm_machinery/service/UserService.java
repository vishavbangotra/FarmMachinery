package com.farmify.farm_machinery.service;

import com.farmify.farm_machinery.model.User;
import com.farmify.farm_machinery.repository.UserRepository;
import com.farmify.farm_machinery.util.JwtUtil;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final Map<String, String> otpStorage = new HashMap<>();
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    // Generate OTP for a phone number
    public String generateOtp(String phone) {
        Random random = new Random();
        String otp = String.format("%06d", random.nextInt(1000000));
        otpStorage.put(phone, otp);
        return otp;
    }

    // Verify OTP
    public boolean verifyOtp(String phone, String otp) {
        String storedOtp = otpStorage.get(phone);
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStorage.remove(phone); // OTP is one-time use
            return true;
        }
        return false;
    }

    // Register a new user
    public User registerUser(String phone, String name) {
        User existingUser = userRepository.findByPhone(phone);
        if (existingUser != null) {
            throw new RuntimeException("User already registered with this phone number");
        }
        User user = new User();
        user.setPhone(phone);
        user.setName(name);
        return userRepository.save(user);
    }

    // Login a user and return a JWT
    public String loginUser(String phone) {
        User user = userRepository.findByPhone(phone);
        if (user == null) {
            throw new RuntimeException("User not registered");
        }
        // Generate a JWT for the user
        return jwtUtil.generateToken(user.getPhone());
    }

    // Verify a JWT and return the authenticated user's phone number
    public String validateToken(String token) {
        return jwtUtil.extractUsername(token);
    }
}
