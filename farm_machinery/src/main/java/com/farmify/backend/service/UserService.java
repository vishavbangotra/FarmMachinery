package com.farmify.backend.service;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.farmify.backend.exception.ResourceNotFoundException;
import com.farmify.backend.model.User;
import com.farmify.backend.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Updates a user's image URL and name by phone number.
     * @param phoneNumber User's phone number
     * @param imageUrl New image URL
     * @param name New name
     */
    public void updateUser(String phoneNumber, String imageUrl, String name) {
        User user = userRepository.findByPhoneNumber(phoneNumber)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with phone number: " + phoneNumber));
        user.setImageUrl(imageUrl);
        user.setName(name);
        userRepository.save(user);
        log.info("Updated user {} with new image and name", phoneNumber);
    }
    
    /**
     * Finds a user by phone number.
     * @param phoneNumber User's phone number
     * @return User
     */
    public User findByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with phone number: " + phoneNumber));
    }
    
    /**
     * Finds a user by ID.
     * @param id User's ID
     * @return User
     */
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
    
    /**
     * Creates a new user with the given phone number.
     * @param phoneNumber User's phone number
     * @return Created User
     */
    public User createUser(String phoneNumber) {
        User user = new User();
        user.setPhoneNumber(phoneNumber);
        user.setDateCreated(LocalDate.now());
        User saved = userRepository.save(user);
        log.info("Created new user with phone number {}", phoneNumber);
        return saved;
    }
}