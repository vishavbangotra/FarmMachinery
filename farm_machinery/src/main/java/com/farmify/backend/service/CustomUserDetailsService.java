package com.farmify.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.farmify.backend.model.CustomUserDetails;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserService userService;

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        Long id;
        try {
            id = Long.valueOf(userId);
        } catch (NumberFormatException e) {
            throw new UsernameNotFoundException("Invalid user ID format: " + userId);
        }

        com.farmify.backend.model.User user = userService.findById(id);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with ID: " + userId);
        }

        // Return a CustomUserDetails object with user data
        return new CustomUserDetails(
                user.getId().toString(), // Username as user ID
                "", // Empty password (JWT-based auth)
                Collections.emptyList(), // No authorities yet
                user.getPhoneNumber(), // Include phone number
                user.getName() // Include name
        );
    }
}