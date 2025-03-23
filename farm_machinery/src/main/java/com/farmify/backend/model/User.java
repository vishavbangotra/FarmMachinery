package com.farmify.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Data
@Table(name = "users", indexes = @Index(columnList = "phoneNumber"))
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate dateCreated;

    @Column(unique = true, nullable = false)
    private String phoneNumber;
}