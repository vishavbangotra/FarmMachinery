package com.farmify.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.farmify.backend.model.Tractor;

public interface TractorRepository extends JpaRepository<Tractor, Long> {
}
