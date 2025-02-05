package com.farmify.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.farmify.backend.model.User;
import java.util.List;

public interface UserRepository extends JpaRepository<User, String> {
    User findByPhone(String phone);
   
    @Query("SELECT u FROM User u WHERE u.machineType = :machineType AND " +
        "ST_Distance_Sphere(point(u.longitude, u.latitude), point(:longitude, :latitude)) <= :radius")
    List<User> findUsersByLocationAndMachineType(@Param("latitude") double latitude, 
                               @Param("longitude") double longitude, 
                               @Param("radius") double radius, 
                               @Param("machineType") String machineType);
    
}
