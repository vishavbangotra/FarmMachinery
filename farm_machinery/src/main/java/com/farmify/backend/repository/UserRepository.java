package com.farmify.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.farmify.backend.model.User;

public interface UserRepository extends JpaRepository<User, String> {
    User findByPhone(String phone);
    
}
