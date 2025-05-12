package com.farmify.backend.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class CustomUserDetails extends User {
    private final String phoneNumber;
    private final String name;

    public CustomUserDetails(String username, String password, Collection<? extends GrantedAuthority> authorities,
            String phoneNumber, String name) {
        super(username, password, authorities);
        this.phoneNumber = phoneNumber;
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getName() {
        return name;
    }
}