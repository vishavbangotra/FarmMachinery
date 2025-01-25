package com.farmify.backend.model;

import jakarta.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Machinery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String image;

    @Column(nullable = false)
    private java.sql.Date date;

    @Column(nullable = false)
    private boolean available;

    @ManyToOne
    @JoinColumn(nullable = false)
    private User owner;

}
