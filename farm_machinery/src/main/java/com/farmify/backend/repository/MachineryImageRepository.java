package com.farmify.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.farmify.backend.model.Machinery;
import com.farmify.backend.model.MachineryImage;

public interface MachineryImageRepository
        extends JpaRepository<MachineryImage, Long> {

    boolean existsByMachineryAndImageNumber(Machinery m, Integer imageNumber);

    int countByMachinery(Machinery m);

    List<MachineryImage> findByMachineryOrderByImageNumberAsc(Machinery m);

    Optional<MachineryImage> findByMachineryAndImageNumber(Machinery m, Integer imageNumber);
}
