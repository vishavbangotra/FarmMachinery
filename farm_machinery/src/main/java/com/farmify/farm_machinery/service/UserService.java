package com.farmify.farm_machinery.service;

import com.farmify.farm_machinery.model.User;
import com.farmify.farm_machinery.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final Map<String, String> otpStorage = new HashMap<>();
    private final Map<String, User> loggedInUsers = new HashMap<>();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String generateOtp(String phone) {
        Random random = new Random();
        String otp = String.format("%06d", random.nextInt(1000000));
        otpStorage.put(phone, otp);
        return otp;
    }

    public boolean verifyOtp(String phone, String otp) {
        String storedOtp = otpStorage.get(phone);
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStorage.remove(phone); // OTP is one-time use
            return true;
        }
        return false;
    }

    public User registerUser(String phone, String name, String password) {
        if (userRepository.findByPhone(phone) != null) {
            throw new RuntimeException("User already registered with this phone number");
        }
        User user = new User();
        user.setPhone(phone);
        user.setName(name);
        user.setPassword(password); // Ideally, hash passwords before storing
        return userRepository.save(user);
    }

    public User loginUser(String phone, String password) {
        User user = userRepository.findByPhone(phone);
        if (user == null || !user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid phone number or password");
        }
        loggedInUsers.put(phone, user);
        return user;
    }

    public void logoutUser(String phone) {
        if (!loggedInUsers.containsKey(phone)) {
            throw new RuntimeException("User is not logged in");
        }
        loggedInUsers.remove(phone);
    }
}
