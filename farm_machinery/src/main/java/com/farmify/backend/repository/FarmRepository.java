package com.farmify.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.farmify.backend.model.Farm;
import com.farmify.backend.model.User;

@Repository
public interface FarmRepository extends JpaRepository<Farm, Long> {
    
    Optional<Farm> findByOwner(User owner);

    Optional<Farm> findById(Long id);
}
