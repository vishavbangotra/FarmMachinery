package com.farmify.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.farmify.backend.model.Farm;
import com.farmify.backend.model.User;

public interface FarmRepository extends JpaRepository<Farm, Long> {
    
    Iterable<Farm> findByOwner(User owner);

    Optional<Farm> findById(Long id);
}
