package com.farmify.backend.service;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

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
        User user = userRepository.findByPhoneNumber(phoneNumber).orElse(null);
        if (user != null) {
            user.setImageUrl(imageUrl);
            user.setName(name);
            userRepository.save(user);
            log.info("Updated user {} with new image and name", phoneNumber);
        } else {
            log.warn("Attempted to update non-existent user with phone number {}", phoneNumber);
        }
    }
    
    /**
     * Finds a user by phone number.
     * @param phoneNumber User's phone number
     * @return User or null if not found
     */
    public User findByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber).orElse(null);
    }
    
    /**
     * Finds a user by ID.
     * @param id User's ID
     * @return User or null if not found
     */
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
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