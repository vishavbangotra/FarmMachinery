package com.farmify.backend.service;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.farmify.backend.model.User;
import com.farmify.backend.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void updateUser(String phoneNumber, String imageUrl, String name) {
        User user = userRepository.findByPhoneNumber(phoneNumber).orElse(null);
        if (user != null) {
            user.setImageUrl(imageUrl);
            user.setName(name);
            userRepository.save(user);
        } 
    }
    
    public User findByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber).orElse(null);
    }
    
    public User createUser(String phoneNumber) {
        User user = new User();
        user.setPhoneNumber(phoneNumber);
        user.setDateCreated(LocalDate.now());
        return userRepository.save(user);
    }
}