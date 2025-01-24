package com.farmify.farm_machinery.repository;

import com.farmify.farm_machinery.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
    User findByPhone(String phone);
}
