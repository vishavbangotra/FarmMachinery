package com.farmify.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.farmify.backend.model.Rotavator;

public interface RotavatorRepository extends JpaRepository<Rotavator, Long> {
}